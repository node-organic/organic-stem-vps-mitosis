const loadCellInfo = require('lib/load-cell-info')
const path = require('path')

module.exports = function (angel) {
  angel.on('pack', async (angel, done) => {
    let cellInfo = await loadCellInfo('{{{cell-name}}}')
    let packagejson = require('../package.json')
    let mitosis = cellInfo.dna.mitosis[angel.cmdData.mitosisName]
    let srcPaths = [
      'cells/node_modules/',
      'dna/',
      `${cellInfo.cwd}/`,
      'package.json'
    ]
    let packPath = `./${cellInfo.cwd}/archived`
    let cellMode = mitosis.mode
    if (packagejson.scripts.build) {
      await angel.exec(`CELL_MODE=${cellMode} npm run build`)
      srcPaths = [ path.join(cellInfo.cwd, 'dist/') ]
    }
    let bundleCmd = [
      `cd ${require('lib/full-repo-path')}`,
      `mkdir -p ${packPath}`,
      `tar ${[
        `--exclude='.git*'`,
        `--exclude='dist*'`,
        `--exclude='archived*'`,
        `--exclude='${cellInfo.cwd}/node_modules*'`,
        `--exclude='coverage*'`,
        `--exclude='__tests__*'`
      ].join(' ')} -zcvf ${packPath}/${packagejson.version}.tar.gz ${srcPaths.join(' ')}`
    ].join(' && ')
    if (process.env.DRY || angel.dry) {
      console.info(bundleCmd)
    } else {
      await angel.exec(bundleCmd)
    }
  })
}