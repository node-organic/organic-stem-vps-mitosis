const loadCellInfo = require('lib/load-cell-info')
const getGitBranchName = require('git-branch-name')
const List = require('prompt-list')
const getBranchName = function () {
  return new Promise((resolve, reject) => {
    getGitBranchName(require('repo-full-path'), (err, branchName) => {
      if (err) return reject(err)
      resolve(branchName)
    })
  })
}
const doPromise = function (angel, cmdInput) {
  return new Promise((resolve, reject) => {
    angel.do(cmdInput, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
module.exports = function (angel) {
  angel.on('start remote mitosis :mitosisName', async function (angel) {
    let list = new List({
      name: 'versionChange',
      message: 'version change?',
      choices: [ 'major', 'minor', 'patch', 'prerelease', 'none' ]
    })
    let versionChange = await list.run()
    if (versionChange === 'prerelease') {
      versionChange = 'prerelease --preid=' + (await getBranchName())
    }
    if (versionChange !== 'none') {
      await angel.exec([
        `npm version ${versionChange}`,
        `git push --tags`
      ].join(' && '))
    }
    let cellInfo = await loadCellInfo('{{{cell-name}}}')
    let packagejson = require('../package.json')
    let mitosis = cellInfo.dna.mitosis[angel.cmdData.mitosisName]
    let packPath = `./${cellInfo.cwd}/archived`
    let cellMode = mitosis.mode
    let remoteDistPath = `~/deployments/cells/{{{cell-name}}}/${packagejson.version}-${cellMode}`
    console.info('packing...')
    await doPromise(angel, 'pack')
    console.info('pack complete, uploading & complete mitosis...')
    let deployCmd = [
      `cd ${require('lib/full-repo-path')}`,
      `ssh node@${mitosis.target.ip} '${[
        `mkdir -p ${remoteDistPath}`,
      ].join(' && ')}'`,
      `scp ${packPath}/${packagejson.version}.zip node@${mitosis.target.ip}:${remoteDistPath}/deployment.zip`,
      `ssh node@${mitosis.target.ip} '${[
        `cd ${remoteDistPath}`,
        'unzip deployment.zip',
        '. ~/.nvm/nvm.sh',
        `nvm install ${packagejson.engines.node}`,
        `nvm use ${packagejson.engines.node}`,
        `cd ${remoteDistPath}`,
        `npm i --production`,
        `cd ${remoteDistPath}/${cellInfo.cwd}`,
        'npm i --production',
        `npx angel complete mitosis ${mitosis.name}`
      ].join(' && ')}'`
    ].join(' && ')
    if (process.env.DRY || angel.dry) {
      console.info(deployCmd)
    } else {
      await angel.exec(deployCmd)
    }
  })
}
