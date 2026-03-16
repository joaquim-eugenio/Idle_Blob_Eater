import { useEffect, useRef } from 'react';
import { useGameStore, Item } from '../store/gameStore';
import { BASE_SUCTION } from '../lib/constants';

const NUM_NODES = 16;
const SPRING_K = 0.15; // Spring stiffness
const DAMPING = 0.65; // Friction

class BlobNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<BlobNode[]>([]);
  const prevItemsRef = useRef<Item[]>([]);
  const camPosRef = useRef({ x: 200, y: 300 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const render = () => {
      // Handle resize
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      const state = useGameStore.getState();
      const { blobPosition, items, level, upgrades, starBoostActive, boostActive } = state;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      
      // Smooth camera follow
      const targetCamX = blobPosition.x;
      const targetCamY = blobPosition.y;
      
      // Initialize camera position if it's too far (e.g. on load)
      if (Math.hypot(camPosRef.current.x - targetCamX, camPosRef.current.y - targetCamY) > 1000) {
        camPosRef.current.x = targetCamX;
        camPosRef.current.y = targetCamY;
      } else {
        // Lerp camera position
        camPosRef.current.x += (targetCamX - camPosRef.current.x) * 0.1;
        camPosRef.current.y += (targetCamY - camPosRef.current.y) * 0.1;
      }
      
      // Camera translation with zoom based on blob scale
      const blobScale = 1 + (level - 1) * 0.2;
      const maxTier = Math.floor((level - 1) / 5) + 1;
      const zoom = 1 / blobScale;
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camPosRef.current.x, -camPosRef.current.y);

      // Draw background grid
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.15)';
      ctx.lineWidth = 1 / zoom;
      const gridSize = 100;
      
      const startX = Math.floor((camPosRef.current.x - canvas.width / 2 / zoom) / gridSize) * gridSize;
      const endX = startX + canvas.width / zoom + gridSize;
      const startY = Math.floor((camPosRef.current.y - canvas.height / 2 / zoom) / gridSize) * gridSize;
      const endY = startY + canvas.height / zoom + gridSize;

      ctx.beginPath();
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();
      
      // Draw suction radius
      const suctionRadius = (BASE_SUCTION + (upgrades.suction || 0) * 15) * blobScale;
      ctx.beginPath();
      ctx.arc(blobPosition.x, blobPosition.y, suctionRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'; // Tailwind blue-500 with opacity
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([8 / zoom, 8 / zoom]); // Dashed line
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash
      
      // Draw items
      const baseItemScale = 1 + (upgrades.spawnValue || 0) * 0.15;
      
      items.forEach(item => {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation || 0);
        
        const tierScale = Math.pow(1.5, item.tier - 1);
        const itemScale = baseItemScale * tierScale;
        ctx.scale(itemScale, itemScale);
        
        const canEat = item.tier <= maxTier || item.type === 'star';
        if (!canEat) {
          ctx.globalAlpha = 0.4; // Make items that are too big semi-transparent
        }
        
        if (item.type === 'triangle') {
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(10, 10);
          ctx.lineTo(-10, 10);
          ctx.fill();
        } else if (item.type === 'square') {
          ctx.fillStyle = '#facc15';
          ctx.fillRect(-10, -10, 20, 20);
        } else if (item.type === 'hexagon') {
          ctx.fillStyle = '#f87171';
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const px = Math.cos(angle) * 12;
            const py = Math.sin(angle) * 12;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.fill();
        } else if (item.type === 'star') {
          const time = performance.now() / 1000;
          
          // Glowing aura
          ctx.shadowBlur = 40;
          ctx.shadowColor = '#e9d5ff'; // Very light purple glow
          
          // Pulsing scale
          const pulse = 1 + Math.sin(time * 8 + item.x) * 0.15;
          ctx.scale(pulse, pulse);
          
          ctx.fillStyle = '#d8b4fe'; // Even brighter purple star
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? 18 : 7; // Slightly larger
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.fill();
          
          // Inner core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? 8 : 3;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.fill();
          
          // Draw dynamic sparkles
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';
          for (let i = 0; i < 12; i++) {
            const speed = i % 2 === 0 ? 4 : -3;
            const sparkleAngle = time * speed + (i * Math.PI * 2) / 12;
            const sparkleDist = 25 + Math.sin(time * 5 + i * 2) * 15;
            const sx = Math.cos(sparkleAngle) * sparkleDist;
            const sy = Math.sin(sparkleAngle) * sparkleDist;
            
            const sparkleSize = Math.max(0, 2.5 + Math.sin(time * 10 + i));
            
            if (sparkleSize > 0) {
              ctx.fillStyle = i % 3 === 0 ? '#f3e8ff' : '#ffffff';
              ctx.beginPath();
              ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          
          // Reset shadow
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      });
      
      // Update and draw blob
      const baseSize = (50 + Math.min(level * 4, 300)) * blobScale;
      
      // Breathing effect
      const time = performance.now() / 1000;
      const breath = Math.sin(time * 2) * (baseSize * 0.05);
      const radius = (baseSize + breath) / 2;
      
      const nodes = nodesRef.current;
      
      // Initialize nodes if empty
      if (nodes.length === 0) {
        for (let i = 0; i < NUM_NODES; i++) {
          const angle = (i / NUM_NODES) * Math.PI * 2;
          nodes.push(new BlobNode(
            blobPosition.x + Math.cos(angle) * radius,
            blobPosition.y + Math.sin(angle) * radius
          ));
        }
      }

      // Handle eating animations
      const currentItems = items;
      const prevItems = prevItemsRef.current;
      
      if (prevItems.length > 0) {
        const currentItemIds = new Set(currentItems.map(i => i.id));
        const eatenItems = prevItems.filter(i => !currentItemIds.has(i.id));
        
        eatenItems.forEach(item => {
          // Check if it was close enough to be eaten (not just despawned)
          const dist = Math.hypot(item.x - blobPosition.x, item.y - blobPosition.y);
          if (dist < suctionRadius + 50) {
            const angle = Math.atan2(item.y - blobPosition.y, item.x - blobPosition.x);
            
            // Apply outward bump to nodes closest to the eaten item
            for (let i = 0; i < NUM_NODES; i++) {
              const nodeAngle = (i / NUM_NODES) * Math.PI * 2;
              let diff = Math.abs(nodeAngle - angle);
              if (diff > Math.PI) diff = 2 * Math.PI - diff;
              
              if (diff < Math.PI / 2) {
                const force = (Math.PI / 2 - diff) * 25 * blobScale; // Bump strength scales with blob
                nodes[i].vx += Math.cos(angle) * force;
                nodes[i].vy += Math.sin(angle) * force;
              }
            }
          }
        });
      }
      
      prevItemsRef.current = currentItems;
      
      // Physics update
      for (let i = 0; i < NUM_NODES; i++) {
        const node = nodes[i];
        const angle = (i / NUM_NODES) * Math.PI * 2;
        
        // Target position based on current center
        const targetX = blobPosition.x + Math.cos(angle) * radius;
        const targetY = blobPosition.y + Math.sin(angle) * radius;
        
        // Spring force pulling node to target
        const fx = (targetX - node.x) * SPRING_K;
        const fy = (targetY - node.y) * SPRING_K;
        
        node.vx += fx;
        node.vy += fy;
        
        node.vx *= DAMPING;
        node.vy *= DAMPING;
        
        node.x += node.vx;
        node.y += node.vy;
      }
      
      // Draw blob body
      if (starBoostActive) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#d8b4fe'; // Purple glow when star boosted
        ctx.fillStyle = '#a855f7'; // Purple blob
      } else if (boostActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#facc15'; // Yellow glow when ad boosted
        ctx.fillStyle = '#3b82f6'; // Blue blob
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0088ff'; // Normal blue blob
      }
      
      ctx.beginPath();
      
      // Quadratic curves between midpoints of nodes for a smooth blob
      let prevNode = nodes[NUM_NODES - 1];
      let firstMidX = (prevNode.x + nodes[0].x) / 2;
      let firstMidY = (prevNode.y + nodes[0].y) / 2;
      
      ctx.moveTo(firstMidX, firstMidY);
      
      for (let i = 0; i < NUM_NODES; i++) {
        const currNode = nodes[i];
        const nextNode = nodes[(i + 1) % NUM_NODES];
        
        const midX = (currNode.x + nextNode.x) / 2;
        const midY = (currNode.y + nextNode.y) / 2;
        
        ctx.quadraticCurveTo(currNode.x, currNode.y, midX, midY);
      }
      
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow
      
      // Calculate visual center of the blob
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < NUM_NODES; i++) {
        cx += nodes[i].x;
        cy += nodes[i].y;
      }
      cx /= NUM_NODES;
      cy /= NUM_NODES;
      
      // Parallax effect for face based on velocity/lag
      let dx = blobPosition.x - cx;
      let dy = blobPosition.y - cy;
      
      // Clamp parallax so eyes don't leave the body
      const maxParallax = radius * 0.4;
      const parallaxDist = Math.hypot(dx, dy);
      if (parallaxDist > maxParallax) {
        dx = (dx / parallaxDist) * maxParallax;
        dy = (dy / parallaxDist) * maxParallax;
      }
      
      ctx.fillStyle = '#1a237e';
      
      // Left eye
      ctx.beginPath();
      ctx.arc(cx - radius * 0.25 + dx, cy - radius * 0.1 + dy, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      // Right eye
      ctx.beginPath();
      ctx.arc(cx + radius * 0.25 + dx, cy - radius * 0.1 + dy, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      // Mouth
      ctx.beginPath();
      ctx.arc(cx + dx, cy + radius * 0.15 + dy, radius * 0.1, 0, Math.PI, false);
      ctx.fill();
      
      ctx.restore(); // Restore camera translation
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}
