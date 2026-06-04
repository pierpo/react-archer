import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';

const config: Config = {
  title: 'react-archer',
  tagline: 'Draw arrows between DOM elements in React',

  url: 'https://pierpo.github.io',
  baseUrl: '/react-archer/',

  organizationName: 'pierpo',
  projectName: 'react-archer',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // Docs-only mode: serve docs at the site root.
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/pierpo/react-archer/tree/master/docs-site/',
          remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Allow MDX pages to import the shared example/library sources that live
  // outside the docs-site directory. Docusaurus's babel-loader only compiles
  // files inside the site by default, so we widen its `include` to also cover
  // ../example and ../src.
  plugins: [
    function shareSourcesPlugin() {
      return {
        name: 'react-archer-share-sources',
        configureWebpack() {
          return {
            resolve: {
              // The shared example/src files live next to the root node_modules
              // (React 19). Force every import to resolve to the docs site's
              // single React 18 copy to avoid a duplicate-React "invalid hook
              // call" at runtime.
              alias: {
                react: path.resolve(__dirname, 'node_modules/react'),
                'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
              },
            },
            module: {
              rules: [
                {
                  test: /\.[jt]sx?$/,
                  include: [
                    path.resolve(__dirname, '../example'),
                    path.resolve(__dirname, '../src'),
                  ],
                  use: [
                    {
                      loader: require.resolve('babel-loader'),
                      options: {
                        presets: [
                          require.resolve('@babel/preset-typescript'),
                          [
                            require.resolve('@babel/preset-react'),
                            { runtime: 'automatic' },
                          ],
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          };
        },
      };
    },
  ],

  themeConfig: {
    navbar: {
      hideOnScroll: true,
      title: 'react-archer',
      items: [
        { to: '/', label: 'Docs', position: 'left', activeBaseRegex: '^/react-archer/$' },
        { to: '/examples', label: 'Examples', position: 'left' },
        { to: '/api', label: 'API', position: 'left' },
        {
          href: 'https://www.npmjs.com/package/react-archer',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/pierpo/react-archer',
          position: 'right',
          className: 'navbar-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
