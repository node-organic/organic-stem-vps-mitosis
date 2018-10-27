const loadRootDNA = require('lib/load-root-dna')
const loadCellInfo = require('lib/load-cell-info')
const Plasma = require('organic-plasma')
const Channel = require('organic-plasma-channel')

module.exports = function (angel) {
  angel.on('complete mitosis :mitosisName', async (angel) => {
    let rootDNA = await loadRootDNA()
    let cellInfo = await loadCellInfo('{{{cell-name}}}')
    let packagejson = require('../package.json')
    let mitosis = cellInfo.dna.mitosis[angel.cmdData.mitosisName]
    let port = rootDNA['cell-ports'][cellInfo.name]
    let mitosisChemical = {
      action: 'onCellMitosisComplete',
      cellInfo: {
        name: cellInfo.name,
        cwd: process.cwd(),
        version: packagejson.version,
        nodeVersion: packagejson.engines.node,
        endpoint: 'http://localhost:' + port,
        port: port,
        mountpoint: rootDNA['cell-mountpoints'][cellInfo.name],
        domain: rootDNA['cell-domains'][cellInfo.name],
        mitosis: mitosis
      }
    }
    if (mitosis.zygote) {
      mitosisChemical.cellInfo.endpoint = mitosisChemical.cellInfo.cwd
    }
    let notifyChannels = mitosis.notifyChannels
    notifyChannels.forEach((channelName) => {
      let plasma = new Plasma()
      let channel = new Channel(plasma, Object.assign({
        'channelName': channelName,
        'swarmOpts': {
          'utp': false,
          'tcp': false,
          'dns': true,
          'dht': false
        },
        'emitReady': 'channelReady'
      }, mitosis.broadcastChannelDNA))
      plasma.on('channelReady', () => {
        plasma.emit(Object.assign({
          type: 'control',
          channel: channel.dna.channelName
        }, mitosisChemical), () => {
          plasma.emit('kill')
        })
      })
    })
  })
}
