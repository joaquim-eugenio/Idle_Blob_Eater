export const LEVEL_CLEAR_QUOTES = [
  'And the blob is as hungry as never!',
  "Full? The blob doesn't know that word.",
  'Ate everything... still not satisfied.',
  'One level down, infinite hunger to go.',
  'The blob licked the floor clean. Wants seconds.',
  'Hunger status: growing. Always growing.',
  'The blob burps proudly. Then gets hungry again.',
  'Was that a snack or a level? Hard to tell.',
];

export const WORLD_UNLOCK_QUOTES = [
  'A whole new world to devour!',
  'New world, same bottomless appetite.',
  'The blob smells fresh food across the horizon.',
  "One world wasn't enough. Obviously.",
  'Breaking news: local blob still hungry after eating an entire world.',
  'The blob has entered the chat. And the buffet.',
  'New cuisine unlocked. The blob drools.',
  'Conquered a world, still room for dessert.',
];

export function pickQuote(quotes: string[]): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
