const path = require('path');

const productionPlugins = [
  '@babel/plugin-transform-react-constant-elements',
  [
    'babel-plugin-transform-react-remove-prop-types',
    {
      mode: 'unsafe-wrap',
    },
  ],
];

module.exports = function getBabelConfig(api) {
  const useESModules = api.env(['stable']);

  const presets = [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        browserslistEnv: process.env.BABEL_ENV || process.env.NODE_ENV,
        debug: process.env.MUI_BUILD_VERBOSE === 'true',
        modules: useESModules ? false : 'commonjs',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ];

  const plugins = [
    // Need the following 3 proposals for all targets in .browserslistrc.
    // With our usage the transpiled loose mode is equivalent to spec mode.
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules,
        version: '^7.4.4',
      },
    ],
  ];

  plugins.push(...productionPlugins);

  return {
    presets,
    plugins,
    ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
    env: {
      coverage: {
        plugins: [
          'babel-plugin-istanbul',
          [
            'babel-plugin-module-resolver',
            {
              root: ['./'],
            },
          ],
        ],
      },
      development: {
        plugins: [
          [
            'babel-plugin-module-resolver',
            {
              alias: {
                modules: './modules',
              },
            },
          ],
        ],
      },
      legacy: {
        plugins: [
          // IE11 support
          '@babel/plugin-transform-object-assign',
        ],
      },
      test: {
        sourceMaps: 'both',
        plugins: [
          [
            'babel-plugin-module-resolver',
            {
              root: ['./'],
            },
          ],
        ],
      },
      benchmark: {
        plugins: [...productionPlugins, ['babel-plugin-module-resolver']],
      },
    },
  };
};
