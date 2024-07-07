export enum MovementKeymap {
  ArrowUp = 0, // Up
  ArrowRight = 1, // Right
  ArrowDown = 2, // Down
  ArrowLeft = 3, // Left
}

const movementKeys = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
  'k',
  'w',
  'l',
  'd',
  'j',
  's',
  'a',
  'h',
] as const;
export type MovementKey = (typeof movementKeys)[number];
export function isMovementKey(userInput: string): userInput is MovementKey {
  return (movementKeys as readonly string[]).includes(userInput);
}

const validKeys = [...movementKeys] as const;
export type ValidKey = (typeof validKeys)[number];

export function isValidKey(userInput: string): userInput is ValidKey {
  return (validKeys as readonly string[]).includes(userInput);
}

export function getMovement(key: MovementKey): MovementKeymap {
  switch (key) {
    case 'ArrowUp':
    case 'k':
    case 'w':
      return MovementKeymap.ArrowUp;
    case 'ArrowRight':
    case 'l':
    case 'd':
      return MovementKeymap.ArrowRight;
    case 'ArrowDown':
    case 'j':
    case 's':
      return MovementKeymap.ArrowDown;
    case 'ArrowLeft':
    case 'a':
    case 'h':
    default:
      return MovementKeymap.ArrowLeft;
  }
}
// export const movementKeymap = {
//   ArrowUp: 0, // Up
//   k: 0, // Up (vim)
//   w: 0, // Up (wsad)
//   ArrowRight: 1, // Right
//   l: 1, // Right (vim)
//   d: 1, // Right (wsad)
//   ArrowDown: 2, // Down
//   j: 2, // Down (vim)
//   s: 2, // Down (wsad)
//   ArrowLeft: 3, // Left
//   a: 3, // Left (vim)
//   h: 3, // Left (wsad)
// };

// export const validKeymap = {
//   //   ...movementKeymap,
//   // 71: 'Gear', // G
//   // 73: 'Gear', // I
//   // 27: 'Menu', // Esc
//   // 77: 'Menu', // M
// };

// export const validMenuKeymap = {
//   ...movementKeymap,
//   27: 'Cancel', // Esc
//   77: 'Cancel', // M
//   13: 'Select', // Enter
//   32: 'Select', // Space
// };
