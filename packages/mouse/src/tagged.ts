declare const Tag: unique symbol;

export type Tagged<T, Tag> = T & { [Tag]?: Tag };
