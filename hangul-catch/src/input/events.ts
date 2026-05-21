export type InputEvent =
  | { type: 'aim'; x: number; y: number }
  | { type: 'catch'; x: number; y: number }
  | { type: 'release' };

export type InputListener = (event: InputEvent) => void;
