export function cycle<T>(array: T[], index: number): T {
  return array[((index % array.length) + array.length) % array.length];
}

export function unique(): (el: unknown) => boolean {
  const found: unknown[] = [];
  return el => {
    if (found.includes(el)) return false;
    found.push(el);
    return true;
  };
}

export function multiSort<T>(...sorters: ((a: T, b: T) => number)[]): (a: T, b: T) => number {
  return (a, b) => {
    for (const sorter of sorters) {
      const result = sorter(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}
