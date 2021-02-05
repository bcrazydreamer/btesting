/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const glob = require('fast-glob');

const rootPath = process.cwd();
const buildPath = path.join(rootPath, './build');
const srcPath = path.join(rootPath, './src');

const sortObj = ob =>
  Object.keys(ob)
    .sort()
    .reduce((o, k) => {
      o[k] = ob[k];
      return o;
    }, {});

const copyDotTs = async ({ from: f, to: t }) => {
  if (!(await fs.pathExists(t))) {
    return console.warn(`path ${t} does not exists`);
  }
  const files = await glob('**/*.d.ts', { cwd: f });
  return Promise.all(
    files.map(file => fs.copy(path.resolve(f, file), path.resolve(t, file))),
  );
};

const copyPackageJson = async () => {
  const pkgRoot = await fs.readFile(
    path.resolve(rootPath, './package.json'),
    'utf8',
  );
  const {
    scripts,
    dependencies,
    devDependencies,
    workspaces,
    ...rest
  } = JSON.parse(pkgRoot);

  if (dependencies) {
    rest.dependencies = sortObj(dependencies);
  }

  const newPkgData = {
    ...rest,
    private: false,
    main: './common/index.js',
    module: './index.js',
    types: './index.d.ts',
  };
  const targetPath = path.resolve(buildPath, './package.json');
  await fs.writeFile(targetPath, JSON.stringify(newPkgData, null, 2), 'utf8');
};

async function run() {
  try {
    await copyPackageJson();
    await copyDotTs({ from: srcPath, to: buildPath });
    console.log('copy require file process done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
