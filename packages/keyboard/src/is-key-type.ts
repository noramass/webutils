import type { ModifierKey } from "src/key-types";

const modifierKeys: ModifierKey[] = [
  "Alt",
  "AltGraph",
  "CapsLock",
  "Control",
  "Fn",
  "FnLock",
  "Hyper",
  "Meta",
  "NumLock",
  "ScrollLock",
  "Shift",
  "Super",
  "Symbol",
  "SymbolLock",
];

export function isModifierKey(key: string): key is ModifierKey {
  return modifierKeys.includes(key as never);
}
