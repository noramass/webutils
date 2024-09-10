/* eslint-disable @typescript-eslint/no-extraneous-class */
import { cycle, multiSort, unique } from "src/utils";

export interface Focusable {
  focus: FocusFn;
}
export type FocusFn = (options?: FocusOptions) => void;
/* eslint-disable-next-line @typescript-eslint/no-empty-function */
const noop: FocusFn = () => {};

/**
 * Utility class for managing focus and simulating tab steps
 */
export class Focus {
  static candidates = [
    "input:not([type='hidden']):not([hidden]:not([hidden='false']))",
    "select",
    "textarea",
    "a[href]",
    "button",
    "[tabindex]",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]:not([contenteditable='false'])",
  ];

  static excluded = ["[disabled]:not([disabled='false'])", "[readonly]:not([readonly='false'])", "[tabindex='-1']"];

  private static _selector: string | undefined;

  /**
   * a selector for focusable dom elements for use with {@link Element#querySelector}.
   * it excludes elements that are disabled, readonly or have negative tabindex values.
   * @remarks cached after initial use.
   */
  static get selector() {
    if (this._selector) return this._selector;
    const excluded = this.excluded.map(it => `:not(${it})`).join("");
    return (this._selector = this.candidates.map(it => it + excluded).join(","));
  }

  /**
   * Select a focusable element.
   *
   * Internally calls {@link Element#focus} on the element to transfer focus.
   *
   * @param element The element to focus
   * @param options The options passed to {@link Element#focus}
   * @return a function to restore focus to the element that was active previously
   */
  static select(element: Focusable | null, options?: FocusOptions): FocusFn {
    if (!element) return noop;
    const current = document.activeElement as HTMLElement;
    if (current === element) return noop;
    element.focus(options);
    if (current === document.activeElement) return noop;
    return options => current.focus(options);
  }

  /**
   * Step an amount of steps through all focusable dom elements (optionally within a given
   * container), respecting tab order and order of occurrence. Basically simulates a number of
   * "tab" or "shift+tab" presses.
   *
   * Internally calls {@link Element#focus} on the element to transfer focus.
   *
   * @remarks if no element inside the given container is selected, the element to select is chosen
   * 					based on the sign of steps. with positive values selecting the first and negative
   * 				  values the last element.
   *
   * @param steps The amount of steps ("tab" presses) to apply. negative values step backwards.
   * @param container The container to step inside of, defaults to {@link document.body}
   * @param options The options passed to {@link Element#focus}
   * @return a function to restore focus to the element that was active previously
   */
  static step(steps = 1, container?: HTMLElement, options?: FocusOptions): FocusFn {
    return this.stepThrough(this.getFocusableElements(container), steps, options);
  }

  /**
   * Selects a focusable element inside a container by index, respecting tab order and order of
   * occurrence.
   *
   * Internally calls {@link Element#focus} on the element to transfer focus.
   *
   * @remarks if no index is passed, the first element will be selected. indexes wrap around at the
   * 					bounds of the container, meaning -1 selects the last element.
   *
   * @param container The container to select an element inside of
   * @param index The index of the element to select inside of the container. Negative values select from the end.
   * @param options The options passed to {@link Element#focus}
   * @return a function to restore focus to the element that was active previously
   */
  static stepInto(container: HTMLElement, index = 0, options?: FocusOptions): FocusFn {
    const elements = this.getFocusableElements(container);
    return this.select(cycle(elements, index), options);
  }

  /**
   * Step an amount of steps through a given list of elements.
   *
   * Internally calls {@link Element#focus} on the element to transfer focus.
   *
   * @remarks if no element inside the given container is selected, the element to select is chosen
   * 					based on the sign of steps. with positive values selecting the first and negative
   * 				  values the last element.
   *
   * @remarks assumes elements to be focusable and in order. best used with
   * 					{@link getFocusableElements}.
   *
   * @param elements a list of elements to step through
   * @param steps The amount of steps ("tab" presses) to apply. negative values step backwards.
   * @param options The options passed to {@link Element#focus}
   * @return a function to restore focus to the element that was active previously
   */
  static stepThrough(elements: HTMLElement[], steps = 1, options?: FocusOptions): FocusFn {
    const index = elements.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return this.select(elements.at(steps > 0 ? 0 : -1)!, options);
    return this.select(cycle(elements, index + steps), options);
  }

  /**
   * Step an amount of steps outside of a given element or container.
   * If an element outside the <code>elementOrContainer</code> is already selected, cycles the focus instead of
   * selecting the element at a given relative index.
   * Useful to, for example, step in front of or behind a form.
   *
   * Internally calls {@link Element#focus} on the element to transfer focus.
   *
   * @remarks throws an error when either the <code>elementOrContainer</code> or <code>container</code> parameters are
   *          not focusable or do not container focusable elements, or when <code>container</code> does not contain
   *          <code>elementOrContainer</code>.
   *
   * @param elementOrContainer the element or container to step out of
   * @param steps the amount of steps ("tab" presses) to apply. negative values step backwards.
   * @param container The encapsulating container to step inside of, defaults to {@link document.body}
   * @param options The options passed to {@link Element#focus}
   * @return a function to restore focus to the element that was active previously
   */
  static stepOutOf(
    elementOrContainer: HTMLElement,
    steps = 1,
    container?: HTMLElement,
    options?: FocusOptions,
  ): FocusFn {
    const inside = this.getFocusableElements(elementOrContainer);
    const outside = this.getFocusableElements(container);
    if (!inside.length)
      throw new RangeError("elementOrContainer is not focusable or does not contain focusable elements");
    if (!outside.length)
      throw new RangeError("container element is not focusable or does not contain focusable elements");
    const firstIndex = outside.indexOf(inside.at(0)!);
    if (firstIndex === -1) throw new RangeError("container does not contain element, can't step out of it");
    outside.splice(firstIndex, inside.length);
    if (outside.some(it => document.activeElement === it)) return Focus.stepThrough(outside, steps, options);
    return Focus.select(cycle(outside, firstIndex + (steps > 0 ? steps - 1 : steps)), options);
  }

  /**
   * Get a list of focusable html elements contained in a set of containers, sorted by tab order and
   * order of occurrence.
   *
   * @remarks handles duplicate container elements and nested container elements.
   *
   * @param containers the container elements to select focusable children from
   */
  static getFocusableElements(...containers: (HTMLElement | undefined | null)[]) {
    containers = containers.filter(it => it);
    if (containers.length === 0) containers = [document.body];

    return (
      (containers as HTMLElement[])
        // make sure each container is only included once
        .filter(unique())
        .sort(this._byDomOrder.bind(this))
        // extract all focusable elements from containers (including the containers themselves if they are focusable)
        .flatMap(this._flattenFocusableContainer.bind(this))
        // nested containers return duplicate children, prune them
        .filter(unique())
        // only select visible candidates
        .filter(this._isVisible.bind(this))
        // sort first by tab order, then by order of occurrence.
        .sort(multiSort(this._byTabOrder.bind(this), this._byDomOrder.bind(this)))
    );
  }

  /**
   * Returns true when the element or an element inside of it is currently focused.
   * @param element the element to search through
   */
  static isInside(element: HTMLElement) {
    return element === document.activeElement || element.contains(document.activeElement);
  }

  /**
   * Returns true when the element itself is focusable.
   * @param element the element to check
   */
  static isFocusable(element: HTMLElement) {
    return element.matches(this.selector);
  }

  /**
   * Returns true, when at least one descendant of this element is focusable
   * @param element the element to check through
   */
  static hasFocusableChildren(element: HTMLElement) {
    return element.matches(`:has(${this.selector})`);
  }

  private static _flattenFocusableContainer(element: HTMLElement): HTMLElement[] {
    const results = element.querySelectorAll<HTMLElement>(this.selector);
    if (this.isFocusable(element)) return [element, ...results];
    return [...results];
  }

  private static _byTabOrder(a: HTMLElement, b: HTMLElement) {
    return b.tabIndex - a.tabIndex;
  }

  private static _byDomOrder(a: HTMLElement, b: HTMLElement) {
    const pos = a.compareDocumentPosition(b);
    if (pos & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY)) return -1;
    else if (pos & (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_POSITION_CONTAINS)) return 1;
    else return 0;
  }

  private static _isVisible(el: HTMLElement) {
    // idea: a more extensive check through the hierarchy of the element could be made here
    // this is good enough for most cases, however.
    return getComputedStyle(el).visibility !== "hidden";
  }
}
