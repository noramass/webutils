import type { Tagged } from "./tagged";

type Enum<T, Tag = never> = {
  [K in keyof T]: Tagged<T[K], Tag>;
} & EnumFunctions<T, Tag>;

interface EnumFunctions<T, Tag> {
  values(): Tagged<T[keyof T], Tag>;
  keyOf<V>(value: V): LookupKeyType<T, V>;
  [Symbol.iterator](): IterableIterator<T[keyof T]>;
}

type LookupKeyType<T, V> = keyof {
  [K in keyof T]: T[K] extends V ? K : never;
};

type ValuesOf<T> = T[keyof T];
type EnumTag<T> = T extends Enum<unknown, infer V> ? V : never;

export type EnumValue<T> = T[Exclude<keyof T, keyof EnumFunctions<T, EnumTag<T>>>];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function enumType<T, Tag = never>(def: T, tag?: Tag): Enum<T, Tag> {
  const reverseLookup = new Map<ValuesOf<T>, keyof T>();
  for (const [key, value] of Object.entries(def as never)) reverseLookup.set(value as ValuesOf<T>, key as keyof T);

  Object.defineProperty(def, "values", {
    value: () => Object.values(def as never),
    configurable: false,
    enumerable: false,
    writable: false,
  });

  Object.defineProperty(def, "keyOf", {
    value: (value: ValuesOf<T>) => reverseLookup.get(value),
    configurable: false,
    enumerable: false,
    writable: false,
  });

  Object.defineProperty(def, Symbol.iterator, {
    value: () => Object.values(def as never)[Symbol.iterator](),
    configurable: false,
    enumerable: false,
    writable: false,
  });

  Object.freeze(def);

  return def as Enum<T, Tag>;
}
