import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Examples',
      link: {
        type: 'generated-index',
        slug: '/examples',
        title: 'Examples',
        description:
          'Live, interactive examples — each rendered from the project’s example components, the exact same code shown in the snippet and used for the end-to-end tests.',
      },
      items: [
        'examples/basic-arrows',
        'examples/dynamic-elements',
        'examples/angle-lines',
        'examples/straight-lines',
        'examples/anchor-offsets',
        'examples/middle-anchor',
        'examples/custom-labels',
        'examples/circle-ends',
        'examples/start-markers',
        'examples/styled-relations',
        'examples/interactive',
        'examples/drag-and-drop',
      ],
    },
    {
      type: 'category',
      label: 'API reference',
      link: {
        type: 'generated-index',
        slug: '/api',
        title: 'API reference',
        description:
          'The full surface of react-archer: the ArcherContainer and ArcherElement components, plus the object types they accept.',
      },
      items: ['api/archer-container', 'api/archer-element', 'api/types'],
    },
    'troubleshooting',
  ],
};

export default sidebars;
