# react-archer

🏹 Draw arrows between DOM elements in React 🖋

📖 **[Documentation & live examples →](https://pierpo.github.io/react-archer/)**

## Installation

`npm install react-archer --save` or `yarn add react-archer`

## Example

[![Example](./example.png)](https://pierpo.github.io/react-archer/)

```jsx
import { ArcherContainer, ArcherElement } from 'react-archer';

const boxStyle = { padding: '10px', border: '1px solid black' };

const App = () => (
  <ArcherContainer strokeColor="#6366f1">
    <ArcherElement
      id="root"
      relations={[
        {
          targetId: 'element2',
          sourceAnchor: 'bottom',
          targetAnchor: 'top',
          style: { strokeDasharray: '5,5' },
          // ...other relation options
        },
      ]}
    >
      <div style={boxStyle}>Root</div>
    </ArcherElement>

    {/* ...layout omitted... */}

    <ArcherElement id="element2" relations={[{ targetId: 'element3', label: 'Arrow 2' }]}>
      <div style={boxStyle}>Element 2</div>
    </ArcherElement>

    <ArcherElement id="element3">
      <div style={boxStyle}>Element 3</div>
    </ArcherElement>

    <ArcherElement id="element4" relations={[{ targetId: 'root', label: 'Arrow 3' }]}>
      <div style={boxStyle}>Element 4</div>
    </ArcherElement>
  </ArcherContainer>
);

export default App;
```

## Documentation

Full documentation lives on the website:

- **[Getting started](https://pierpo.github.io/react-archer/)**
- **[Examples](https://pierpo.github.io/react-archer/examples)** — live, interactive
- **[API reference](https://pierpo.github.io/react-archer/api)**
- **[Troubleshooting](https://pierpo.github.io/react-archer/troubleshooting)**

## Contributing

The library lives in `src/`. The `example/` app is a Vite playground used for
local development and end-to-end tests:

```bash
yarn install
yarn start        # run the example app at http://localhost:8080
yarn test         # format, lint, typecheck and unit tests
yarn test:e2e     # Cypress end-to-end tests
```

### Commit & PR conventions

PR titles must follow [Conventional Commits](https://www.conventionalcommits.org/)
(e.g. `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`). PRs are squash-merged
using their title, so this title becomes the commit on `master` and feeds the
changelog. A CI check validates the PR title.
