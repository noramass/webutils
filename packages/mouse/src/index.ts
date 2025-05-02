import { enumType, type EnumValue } from "./enum";

type MouseHandler = (event: MouseEvent) => void;
export const MouseButton = enumType(
  {
    left: 0,
    middle: 1,
    right: 2,
    back: 3,
    forward: 4,
  } as const,
  "MouseButton" as const,
);
export type MouseButton = EnumValue<typeof MouseButton>;

interface HandlerBuilder {
  shift(val?: boolean): this;
  ctrl(val?: boolean): this;
  alt(val?: boolean): this;
  meta(val?: boolean): this;
  prevent(val?: boolean): this;

  left(handler: MouseHandler): this;
  middle(handler: MouseHandler): this;
  right(handler: MouseHandler): this;
  forward(handler: MouseHandler): this;
  back(handler: MouseHandler): this;
}

class HandlerBuilderImpl implements HandlerBuilder {
  constructor() {
    this._reset();
  }

  shift(val: boolean = true) {
    this._modifiers.shiftKey = val;
    return this;
  }

  ctrl(val: boolean = true) {
    this._modifiers.ctrlKey = val;
    return this;
  }

  alt(val: boolean = true) {
    this._modifiers.altKey = val;
    return this;
  }

  meta(val: boolean = true) {
    this._modifiers.metaKey = val;
    return this;
  }

  prevent(val: boolean = true) {
    this._prevent = val;
    return this;
  }

  left(handler: MouseHandler) {
    this._register(MouseButton.left, handler);
    return this;
  }

  middle(handler: MouseHandler) {
    this._register(MouseButton.middle, handler);
    return this;
  }

  right(handler: MouseHandler) {
    this._register(MouseButton.right, handler);
    return this;
  }

  forward(handler: MouseHandler) {
    this._register(MouseButton.forward, handler);
    return this;
  }

  back(handler: MouseHandler) {
    this._register(MouseButton.back, handler);
    return this;
  }

  _handlers: {
    left: MouseHandler[];
    middle: MouseHandler[];
    right: MouseHandler[];
    back: MouseHandler[];
    forward: MouseHandler[];
  } = {
    left: [],
    middle: [],
    right: [],
    back: [],
    forward: [],
  };
  _modifiers!: {
    shiftKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  };
  _prevent!: boolean;

  _reset() {
    this._modifiers = {};
    this._prevent = false;
  }

  _register(button: MouseButton, handler: MouseHandler) {
    const { _modifiers: modifiers, _prevent: prevent } = this;
    this._reset();
    this._modifiers = {};
    this._prevent = false;
    this._handlers[MouseButton.keyOf(button)].push(function (event) {
      for (const key in modifiers)
        if (event[key as keyof typeof modifiers] !== modifiers[key as keyof typeof modifiers]) return;
      if (prevent) event.preventDefault();
      return handler(event);
    });
  }

  _createHandler(): MouseHandler {
    const handlers = this._handlers;
    return event => {
      for (const handler of handlers[MouseButton.keyOf(event.button)]) handler(event);
    };
  }
}

export function mouseEvent(build: (builder: HandlerBuilder) => void): MouseHandler {
  const builder = new HandlerBuilderImpl();
  build(builder);
  return builder._createHandler();
}
