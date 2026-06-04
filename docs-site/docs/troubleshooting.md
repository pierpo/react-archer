---
id: troubleshooting
title: Troubleshooting
sidebar_position: 4
---

# Troubleshooting

## My arrows don't re-render correctly

Try using the `refreshScreen` instance method on your `ArcherContainer`. You can
access it through the [ref of the component](https://react.dev/learn/manipulating-the-dom-with-refs).

Call `refreshScreen` when the event you need is triggered (`onScroll`, etc.):

```tsx
import { useRef } from 'react';
import { ArcherContainer, ArcherContainerRef } from 'react-archer';

function App() {
  const archerRef = useRef<ArcherContainerRef>(null);

  return (
    <div onScroll={() => archerRef.current?.refreshScreen()}>
      <ArcherContainer ref={archerRef}>{/* ... */}</ArcherContainer>
    </div>
  );
}
```
