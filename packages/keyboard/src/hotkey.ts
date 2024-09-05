import type { AlphaKey, KeyboardKey, ModifierKey } from "src/key-types";
import { isModifierKey } from "src/is-key-type";

type Modifier = "meta" | "ctrl" | "alt" | "shift";
type Modifiers = `${"" | "meta + "}${"" | "ctrl + "}${"" | "alt + "}${"" | "shift + "}`;
type NonModifierKey = Exclude<KeyboardKey, ModifierKey | Lowercase<AlphaKey>>;
type KeyboardEventListener = (event: KeyboardEvent) => void;

export type HotkeyPatten = `${Modifiers}${NonModifierKey}`;

export type HotkeyMatchConfig = {
  [Key in HotkeyPatten | "default"]?: KeyboardEventListener;
};

export class Hotkey {
  private listeners: KeyboardEventListener[] = [];

  constructor(
    public readonly key: NonModifierKey,
    public readonly modifiers: Record<Modifier, boolean>,
    public enabled: boolean = true,
  ) {
    Object.freeze(this.modifiers);
  }

  format(): HotkeyPatten {
    const { meta, ctrl, alt, shift } = this.modifiers;
    return `${meta ? "meta + " : ""}${ctrl ? "ctrl + " : ""}${alt ? "alt + " : ""}${shift ? "shift + " : ""}${this.key}`;
  }

  matches(event: KeyboardEvent) {
    return (
      event.key.toLowerCase() === this.key.toLowerCase() &&
      event.shiftKey === this.modifiers.shift &&
      event.ctrlKey === this.modifiers.ctrl &&
      event.altKey === this.modifiers.alt &&
      event.metaKey === this.modifiers.meta
    );
  }

  onPress(handler: KeyboardEventListener) {
    this.listeners.push(handler);
    return () => {
      const index = this.listeners.lastIndexOf(handler);
      if (index !== -1) this.listeners.splice(index, 1);
    };
  }

  register(container: HTMLElement | Window = window, capture = false) {
    const handler: KeyboardEventListener = event => {
      if (!this.enabled || !this.matches(event)) return;
      for (const listener of this.listeners) {
        // noinspection JSVoidFunctionReturnValueUsed
        const result = listener(event) as unknown;
        if (result != null && event.defaultPrevented) return result;
      }
    };
    container.addEventListener("keydown", handler as never, { capture });
    return () => container.removeEventListener("keydown", handler as never, { capture });
  }

  static parse(pattern: HotkeyPatten) {
    const modifiers: Hotkey["modifiers"] = { ctrl: false, alt: false, shift: false, meta: false };
    const key = pattern.replace(/(meta|ctrl|alt|shift)\s\+\s/g, (_, modifier: Modifier) => {
      modifiers[modifier] = true;
      return "";
    });
    return new this((key.length === 1 ? key.toUpperCase() : key) as never, modifiers);
  }

  static fromEvent(event: KeyboardEvent): Hotkey | undefined {
    if (isModifierKey(event.key)) return undefined;
    return new this((event.key.length === 1 ? event.key.toUpperCase() : event.key) as never, {
      meta: event.metaKey,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    });
  }

  static match(config: HotkeyMatchConfig): KeyboardEventListener {
    const mapped = new Map<Hotkey, KeyboardEventListener>();
    let defaultListener: KeyboardEventListener | undefined = undefined;

    for (const [pattern, listener] of Object.entries(config)) {
      if (pattern === "default") defaultListener = listener;
      else if (listener) mapped.set(Hotkey.parse(pattern as HotkeyPatten), listener);
    }

    return event => {
      for (const [hotkey, listener] of mapped.entries()) if (hotkey.matches(event)) return listener(event);
      if (defaultListener) return defaultListener(event);
    };
  }
}
