const childProcess = require('child_process');
const glob = require('fast-glob');
const path = require('path');
const { promisify } = require('util');
const yargs = require('yargs');

const exec = promisify(childProcess.exec);

const validBundles = [
  // build for common using commonJS modules
  'common',
  // build with a hardcoded target using ES6 modules
  'stable',
];

async function run(argv) {
  const { bundle, outDir: relativeOutDir, verbose } = argv;

  if (validBundles.indexOf(bundle) === -1) {
    throw new TypeError('Unrecognized bundle');
  }

  const env = {
    NODE_ENV: 'production',
    BABEL_ENV: 'bundle',
  };

  const babelConfigPath = path.resolve(__dirname, '../babel.config.js');
  const srcDir = path.resolve('./src');
  const extensions = ['.js', '.ts', '.tsx'];
  const ignore = [
    '**/*.test.js',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.d.ts',
  ];

  const outDir = path.resolve(
    relativeOutDir,
    {
      common: './common',
      stable: './',
    }[bundle],
  );

  const command = [
    'yarn babel',
    '--config-file',
    babelConfigPath,
    '--extensions',
    `"${extensions.join(',')}"`,
    srcDir,
    '--out-dir',
    outDir,
    '--ignore',
    `"${ignore.join('","')}"`,
  ].join(' ');

  // eslint-disable-next-line no-console
  console.log(`running '${command}' with ${JSON.stringify(env)}`);

  const { stderr, stdout } = await exec(command, {
    env: { ...process.env, ...env },
  });
  if (stderr) {
    throw new Error(`'${command}' failed with \n${stderr}`);
  }

  // eslint-disable-next-line no-console
  console.log(stdout);
}

yargs
  .command({
    command: '$0 <bundle>',
    description: 'build package',
    builder: command => {
      return command
        .positional('bundle', {
          description: `Valid bundles: "${validBundles.join('" | "')}"`,
          type: 'string',
        })
        .option('out-dir', { default: './build', type: 'string' });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
