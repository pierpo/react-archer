---
id: archer-container
title: <ArcherContainer>
sidebar_label: ArcherContainer
sidebar_position: 1
---

# `<ArcherContainer>`

Wraps the area in which arrows are drawn. Every [`<ArcherElement>`](./archer-element.md)
must be rendered inside an `ArcherContainer`.

The styling props below set the **defaults for every arrow** in the container.
Any individual arrow can override them through its relation's
[`style`](./types.md#line-styling) — see [Line styling](./types.md#line-styling).

## Props

| Prop | Type | Default | Description |
| - | - | - | - |
| `children` | `ReactNode \| (context) => ReactNode` | — | Your layout. May also be a function of the internal context for third‑party renderers. |
| `strokeColor` | `string` | `'#f00'` | Default arrow color. |
| `strokeWidth` | `number` | `2` | Default arrow thickness, in px. |
| `strokeDasharray` | `string` | — | Default dash pattern, e.g. `'5,5'`. See the [SVG stroke docs](https://www.w3schools.com/graphics/svg_stroking.asp). |
| `lineStyle` | [`'angle' \| 'straight' \| 'curve'`](./types.md#line-styling) | `'curve'` | How lines are drawn. Overrides `noCurves`. |
| `noCurves` | `boolean` | `false` | Draw angles instead of curves (equivalent to `lineStyle="angle"`). |
| `offset` | `number` | — | Space between an element and the start/end of its strokes, in px. |
| `endShape` | [`EndShape`](./types.md#end-shape) | arrow | Default shape at the end of arrows. |
| `startMarker` | `boolean` | `false` | Render a marker at the start of arrows too. |
| `endMarker` | `boolean` | `true` | Render a marker at the end of arrows. |
| `svgContainerStyle` | `CSSProperties` | `{}` | Style of the SVG layer. Useful to set a `z-index` so arrows draw under your elements, for example. |
| `style` | `CSSProperties` | — | Style of the container `div`. |
| `className` | `string` | — | Class on the container `div`. |

## Ref — `refreshScreen()`

The container exposes an imperative handle. Hold a `ref` to recompute all arrow
positions on demand — useful when the viewport or some elements move without
the container itself resizing.

```tsx
import { useRef } from 'react';
import { ArcherContainer, ArcherContainerRef } from 'react-archer';

const ref = useRef<ArcherContainerRef>(null);
// ...
<ArcherContainer ref={ref}>{/* ... */}</ArcherContainer>;
// later, e.g. on scroll:
ref.current?.refreshScreen();
```

See [Troubleshooting](../troubleshooting.md) for when you need this.
