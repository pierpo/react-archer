---
id: archer-element
title: <ArcherElement>
sidebar_label: ArcherElement
sidebar_position: 2
---

# `<ArcherElement>`

Marks an element as a source and/or target of arrows. Must be rendered inside an
[`<ArcherContainer>`](./archer-container.md).

## Props

| Prop | Type | Default | Description |
| - | - | - | - |
| `id` | `string` | — | Unique id used to reference this element from a relation's `targetId`. |
| `relations` | [`Relation[]`](./types.md#relation) | `[]` | The arrows that originate from this element. |
| `children` | `ReactElement` | — | ⚠️ Must be a **single** element. A custom component must forward its `ref` (or be wrapped in a `div`), since the library reads the rendered DOM node. |

:::warning Single, ref-able child
`ArcherElement` clones its child and attaches a `ref` to measure its position.
If you pass a custom component, wrap it in a `div` or forward the ref. See
[this release note](https://github.com/pierpo/react-archer/releases/tag/v2.0.0).
:::

## Example

```tsx
<ArcherElement
  id="root"
  relations={[
    {
      targetId: 'child',
      targetAnchor: 'top',
      sourceAnchor: 'bottom',
      style: { strokeColor: 'blue', strokeWidth: 1 },
      label: 'Arrow 1',
    },
  ]}
>
  <div>Root</div>
</ArcherElement>
```

Each entry in `relations` is a [`Relation`](./types.md#relation).
