const loadCellInfo = require('lib/load-cell-info')
const path = require('path')

module.exports = function (angel) {
  angel.on('start remote mitosis :mitosisName', async function (angel) {
    let cellInfo = await loadCellInfo('{{{cell-name}}}')
    let packagejson = require('../package.json')
    let mitosis = cellInfo.dna.mitosis[angel.cmdData.mitosisName]
    let commonCodePaths = [
      'cells/node_modules',
      'dna'
    ].map((relativePath) => {
      return path.join(require('full-repo-path'), relativePath)
    })
    let srcPaths = [ process.cwd() ].concat(commonCodePaths)
    let packPath = `./archived/${packagejson.version}`
    let cellMode = mitosis.mode
    let remoteDistPath = `./deployments/cells/{{{cell-name}}}/${packagejson.version}-${cellMode}`
    if (packagejson.scripts.build) {
      await angel.exec(`CELL_MODE=${cellMode} npm run build`)
      srcPaths = [ path.join(process.cwd(), './dist/') ]
    }
    let bundleCmd = [
      `mkdir -p ./${packPath}`,
      `tar ${[
        `--exclude='.git*'`,
        `--exclude='dist*'`,
        `--exclude='archived*'`,
        `--exclude='./node_modules*'`,
        `--exclude='coverage*'`,
        `--exclude='__tests__*'`
      ].join(' ')} -zcvf ${packPath}.tar.gz ${srcPaths.join(' ')}`
    ].join(' && ')
    if (process.env.DRY || angel.dry) {
      console.info(bundleCmd)
    } else {
      await angel.exec(bundleCmd)
    }
    let deployCmd = [
      `scp ${packPath} ${mitosis.target.ip}:${remoteDistPath}/deployment.tar.gz`,
      `ssh ${mitosis.target.ip} '${[
        `cd ${remoteDistPath}`,
        'tar -zxf deployment.tar.gz',
        '. ~/.nvm/nvm.sh',
        `nvm use ${packagejson.engines.node}`,
        'npm i',
        `npx angel complete mitosis ${mitosis.target.name}`
      ].join(' && ')}'`
    ].join(' && ')
    if (process.env.DRY || angel.dry) {
      console.info(deployCmd)
    } else {
      await angel.exec(deployCmd)
    }
  })
}
