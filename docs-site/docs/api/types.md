---
id: types
title: Types
sidebar_label: Types
sidebar_position: 3
---

# Types

The object types accepted by [`<ArcherElement>`](./archer-element.md) and
[`<ArcherContainer>`](./archer-container.md).

## Relation

A single arrow originating from an `ArcherElement`, passed in its `relations`
array.

| Prop | Type | Default | Description |
| - | - | - | - |
| `targetId` | `string` | — | Id of the [`<ArcherElement>`](./archer-element.md) this arrow points to. |
| `targetAnchor` | [`Anchor`](#anchors) | `'auto'` | Edge of the **target** the arrow ends on. |
| `sourceAnchor` | [`Anchor`](#anchors) | `'auto'` | Edge of the **source** the arrow leaves from. |
| `label` | `ReactNode` | — | Rendered at the middle of the arrow. |
| `style` | [`LineStyle`](#line-styling) | inherits container | Per‑arrow style overrides. |
| `order` | `number` | `0` | Drawing order; a higher value draws on top of others. |
| `className` | `string` | — | Class applied to the SVG path. |
| `domAttributes` | `DOMAttributes<SVGElement>` | — | DOM attributes on the SVG path (e.g. `onClick`, `onMouseEnter`) — makes the arrow selectable. |
| `cursor` | `Property.Cursor` | — | Hover cursor for the arrow. Requires `domAttributes`. |
| `hitSlop` | `number` | — | Widens the clickable/hover area, in px. Requires `domAttributes`. |

## Line styling

The shape of a relation's `style`, and also the set of styling props on
[`<ArcherContainer>`](./archer-container.md). For any given arrow the value is
resolved as:

> **relation `style`** → **container prop** → **built‑in default**

so a container sets the defaults and each relation overrides them as needed.

| Field | Type | Default | Description |
| - | - | - | - |
| `strokeColor` | `string` | `'#f00'` | Arrow color. |
| `strokeWidth` | `number` | `2` | Arrow thickness, in px. |
| `strokeDasharray` | `string` | — | Dash pattern, e.g. `'5,5'`. |
| `lineStyle` | `'angle' \| 'straight' \| 'curve'` | `'curve'` | How the line is drawn. |
| `noCurves` | `boolean` | `false` | Draw angles instead of curves (`lineStyle` takes precedence). |
| `startMarker` | `boolean` | `false` | Marker at the start of the arrow. |
| `endMarker` | `boolean` | `true` | Marker at the end of the arrow. |
| `endShape` | [`EndShape`](#end-shape) | arrow | Shape drawn at the end. |

## End shape

`endShape` is an object whose **present key selects the shape** — the default is
a triangular `arrow`; provide `circle` to draw a circle instead.

```ts
// arrow (default)
endShape={{ arrow: { arrowLength: 10, arrowThickness: 6 } }}

// circle
endShape={{ circle: { radius: 6, fillColor: '#f472b6', strokeColor: '#be185d', strokeWidth: 3 } }}
```

`arrow`:

| Field | Type | Default | Description |
| - | - | - | - |
| `arrowLength` | `number` | `10` | Length of the arrow head, in px. |
| `arrowThickness` | `number` | `6` | Width of the arrow head, in px. |

`circle`:

| Field | Type | Default | Description |
| - | - | - | - |
| `radius` | `number` | `2` | Circle radius, in px. |
| `fillColor` | `string` | `'#f00'` | Fill color. |
| `strokeColor` | `string` | `'#0ff'` | Border color. |
| `strokeWidth` | `number` | `1` | Border thickness, in px. |

## Anchors

`targetAnchor` and `sourceAnchor` accept:

`'top' | 'bottom' | 'left' | 'right' | 'middle' | 'auto'`

:::note `auto`
The default. The facing edge is chosen automatically from the live positions of
the two elements.
:::

:::note `middle`
The `middle` anchor doesn't look great: the curve isn't smooth and the marker is
slightly offset. This is a known, long‑standing limitation.
:::
