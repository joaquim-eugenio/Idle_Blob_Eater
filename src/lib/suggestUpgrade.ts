import {
  SKILL_TREE_NODES, SKILL_NODE_LOOKUP, SKILL_BRANCH_ORDER,
  type SkillNodeDef, type SkillBranchId, type SkillNodeType,
} from './constants';

export interface RunContext {
  eatRatio: number;       // levelItemsEaten / levelItemsTotal (0..1)
  survivalTime: number;   // seconds survived before death
}

function getChoiceLock(node: SkillNodeDef, unlockedNodeIds: string[]) {
  if (!node.choiceGroup) return false;
  return SKILL_TREE_NODES.some((n) =>
    n.choiceGroup === node.choiceGroup &&
    n.id !== node.id &&
    unlockedNodeIds.includes(n.id)
  );
}

function canUnlockNode(node: SkillNodeDef, unlockedNodeIds: string[]): boolean {
  if (node.type === 'gate') return false;

  if (node.requires.length > 0) {
    const reqNodes = node.requires.map((r) => SKILL_NODE_LOOKUP[r]).filter(Boolean);
    const choiceGroups = new Set(reqNodes.filter((n) => n.choiceGroup).map((n) => n.choiceGroup!));

    for (const reqId of node.requires) {
      const reqNode = SKILL_NODE_LOOKUP[reqId];
      if (reqNode?.choiceGroup && choiceGroups.has(reqNode.choiceGroup)) {
        const siblingsInReqs = node.requires.filter((r) => SKILL_NODE_LOOKUP[r]?.choiceGroup === reqNode.choiceGroup);
        const anyUnlocked = siblingsInReqs.some((r) => unlockedNodeIds.includes(r));
        if (!anyUnlocked) return false;
      } else {
        if (!unlockedNodeIds.includes(reqId)) return false;
      }
    }
  }

  if (node.gateRequired === 'gateA' && !unlockedNodeIds.includes('gate_a_unlock')) return false;
  if (node.gateRequired === 'gateB' && !unlockedNodeIds.includes('gate_b_unlock')) return false;
  if (getChoiceLock(node, unlockedNodeIds)) return false;
  return true;
}

const BRANCH_BASE_WEIGHT: Record<SkillBranchId, number> = {
  survival: 4,
  hunt: 3,
  feast: 2,
  automation: 1,
  evolution: 0,
};

const NODE_TYPE_BONUS: Record<SkillNodeType, number> = {
  keystone: 1.5,
  mechanic: 1.3,
  conditional: 1.2,
  trait: 1.1,
  choice: 1.1,
  minor: 1.0,
  gate: 0,
};

function countNodesByBranch(unlockedIds: string[]): Record<SkillBranchId, number> {
  const counts: Record<SkillBranchId, number> = {
    hunt: 0, feast: 0, survival: 0, automation: 0, evolution: 0,
  };
  for (const id of unlockedIds) {
    const node = SKILL_NODE_LOOKUP[id];
    if (node) counts[node.branch]++;
  }
  return counts;
}

/**
 * Scores a candidate node based on branch priority, build balance,
 * cost efficiency, node type, and optional run context.
 */
function scoreNode(
  node: SkillNodeDef,
  money: number,
  branchCounts: Record<SkillBranchId, number>,
  avgBranchCount: number,
  runContext?: RunContext,
): number {
  let score = BRANCH_BASE_WEIGHT[node.branch];
  if (score === 0) return 0;

  // Branch balancing: boost under-invested branches, dampen over-invested ones
  const branchCount = branchCounts[node.branch];
  if (avgBranchCount > 0) {
    const deficit = avgBranchCount - branchCount;
    score += deficit * 0.8;
  } else if (branchCount === 0) {
    score += 1.5;
  }

  // Run context adjustments
  if (runContext) {
    if (runContext.eatRatio < 0.4 && node.branch === 'hunt') {
      score += 2;
    }
    if (runContext.survivalTime < 8 && node.branch === 'survival') {
      score += 2;
    }
  }

  score *= NODE_TYPE_BONUS[node.type];

  // Cost efficiency: prefer affordable nodes, with a bonus for being within budget
  // but penalize nodes that are trivially cheap when the player has lots of money
  const costRatio = node.cost / Math.max(1, money);
  if (costRatio <= 0.5) {
    score *= 1.1;
  } else if (costRatio <= 0.8) {
    score *= 1.0;
  } else {
    score *= 0.9;
  }

  return score;
}

export function getSuggestedUpgrade(
  money: number,
  unlockedSkillNodes: string[],
  runContext?: RunContext,
): SkillNodeDef | null {
  const unlocked = new Set(unlockedSkillNodes);

  const candidates = SKILL_TREE_NODES.filter((node) =>
    node.type !== 'gate' &&
    node.branch !== 'evolution' &&
    !unlocked.has(node.id) &&
    money >= node.cost &&
    canUnlockNode(node, unlockedSkillNodes)
  );

  if (candidates.length === 0) return null;

  const branchCounts = countNodesByBranch(unlockedSkillNodes);
  const mainBranches = SKILL_BRANCH_ORDER.map((b) => branchCounts[b]);
  const totalMainNodes = mainBranches.reduce((a, b) => a + b, 0);
  const avgBranchCount = totalMainNodes / SKILL_BRANCH_ORDER.length;

  let bestNode: SkillNodeDef | null = null;
  let bestScore = -Infinity;

  for (const node of candidates) {
    const s = scoreNode(node, money, branchCounts, avgBranchCount, runContext);
    if (s > bestScore || (s === bestScore && bestNode && node.cost < bestNode.cost)) {
      bestScore = s;
      bestNode = node;
    }
  }

  return bestNode;
}

const BRANCH_TIPS: Record<SkillBranchId, string> = {
  hunt: 'Move faster to catch more food!',
  feast: 'Get more value from every bite!',
  survival: 'Your blob needs more hunger capacity!',
  automation: 'Let your blob work smarter!',
  evolution: '',
};

export function getSuggestionReason(node: SkillNodeDef): string {
  return BRANCH_TIPS[node.branch] || 'Power up your blob!';
}
