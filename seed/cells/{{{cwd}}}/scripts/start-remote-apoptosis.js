const loadCellInfo = require('lib/load-cell-info')

module.exports = function (angel) {
  angel.on('start remote apoptosis :mitosisName', async (angel) => {
    let cellInfo = await loadCellInfo('{{{cell-name}}}')
    let packagejson = require('../package.json')
    let mitosis = cellInfo.dna.mitosis[angel.cmdData.mitosisName]
    let cellMode = mitosis.mode
    let remoteDistPath = `~/deployments/cells/{{{cell-name}}}/${packagejson.version}-${cellMode}`
    await angel.exec([
      `ssh node@${mitosis.target.ip} '${[
        `cd ${remoteDistPath}/${cellInfo.cwd}`,
        '. ~/.nvm/nvm.sh',
        `nvm use ${packagejson.engines.node}`,
        'npx angel complete apoptosis ' + mitosis.name
      ].join(' && ')}'`
    ].join(' && '))
  })
}
