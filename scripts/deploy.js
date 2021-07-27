const path = require('path');
const ci = require('miniprogram-ci');
const { spawn } = require('child_process');
const chalk = require('chalk');
const packageJson = require('../package.json');
const projectConfigJson = require('../project.config.json');
const deployConfig = require('../deploy.config');

const query = process.argv.slice(2).reduce((a, val) => {
  const [k, v] = val.split('=');
  a[k] = v;
  return a;
}, {});

const project = new ci.Project({
  appid: projectConfigJson.appid,
  type: 'miniProgram',
  projectPath: path.resolve(__dirname, '../dist'),
  // privateKeyPath: path.resolve(__dirname, 'private.key'),
  privateKeyPath: deployConfig.privateKeyPath,
  ignores: ['node_modules/**/*'],
});

(async () => {
  try {
    await mpBuild();

    if (query.type === 'upload') {
      await mpUpload();
    }

    if (query.type === 'preview') {
      await mpPreview();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

async function mpBuild() {
  await exec('npx', ['taro', 'build', '--type', 'weapp']);
}

async function mpUpload() {
  const uploadResult = await ci.upload({
    project,
    version: packageJson.version,
    setting: projectConfigJson.setting,
    onProgressUpdate: chalk.green,
  });
  chalk.green(uploadResult);
}

async function mpPreview() {
  const previewResult = await ci.preview({
    project,
    setting: projectConfigJson.setting,
    qrcodeFormat: 'image',
    // qrcodeOutputDest: 'preview.jpg',
    qrcodeOutputDest: deployConfig.qrcodeOutputDest,
    onProgressUpdate: chalk.green,
  });
  chalk.green(previewResult);
}

function exec(command, args, opts) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      stdio: 'inherit',
      env: process.env,
      ...opts,
    });
    child.once('error', (err) => {
      console.log(err);
      reject(err);
    });
    child.once('close', (code) => {
      if (code === 1) {
        process.exit(1);
      } else {
        resolve();
      }
    });
  });
}
