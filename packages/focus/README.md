# @norabelle-labs/focus
Focus management made easy!

A tiny utility for stepping into or out of elements and simulating tab flow.

## Installing

```shell
pnpm add @norabelle-labs/focus
```
```shell
bun add @norabelle-labs/focus
```
```shell
yarn add @norabelle-labs/focus
```
```shell
npm install @norabelle-labs/focus
```

## Usage

```typescript
import { Focus } from "@norabelle-labs/focus";

// Move the focus forwards (simulate a tab press)
Focus.step(1)

// Move it forwards 3 steps
Focus.step(3)

// Move it backwards instead (shift + tab)
Focus.step(-1)

// Select a given element explicitly
let recover = Focus.select(document.querySelector("#my-input"))

// Recover where focus was before selecting the element;
recover()

// Move focus inside a container element (last element steps to first and vice versa)
Focus.step(1, document.querySelector("#my-popover"))
Focus.step(-1, document.querySelector("#my-popover"))

// Select a given element in a container by index (default first element)
recover = Focus.stepInto(document.querySelector("#my-popover"), 2)

// Select the last element in a container
Focus.stepInto(document.querySelector("#my-popover"), -1)

// Recover where focus was before stepping into the popover
recover()

// Check if focus is inside an element or the element itself is focused
if (Focus.isInside(document.querySelector("#my-popover"))) {
  console.log("focus inside popover!")
}

// Get all focusable elements inside one or more containers
const elements = Focus.getFocusableElements(
  ...document.querySelectorAll("#my-popover>.content"),
  document.querySelector("#my-popover>.actions"),
)

// Step focus constrained to these elements
Focus.stepThrough(elements, 2)
```

All functions that actively shift focus, return a function, that resets the focus
to its previous location. They also accept an optional `FocusOptions` argument in
both the original function and the returned function to restore the previous
focus with.
