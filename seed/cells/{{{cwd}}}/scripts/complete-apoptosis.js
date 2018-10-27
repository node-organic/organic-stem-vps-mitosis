const loadCellInfo = require('lib/load-cell-info')
const Plasma = require('organic-plasma')
const Channel = require('organic-plasma-channel')

module.exports = function (angel) {
  angel.on('complete apoptosis :mitosisName', async function () {
    let cellInfo = await loadCellInfo('{{{cell-name}}}')
    let packagejson = require('../package.json')
    let mitosis = cellInfo.dna.mitosis[angel.cmdData.mitosisName]
    let aptosisChemical = {
      action: 'onCellAptosisComplete',
      cellInfo: {
        name: cellInfo.name,
        cwd: process.cwd(),
        version: packagejson.version,
        nodeVersion: packagejson.engines.node,
        mitosis: mitosis
      }
    }
    let notifyChannels = cellInfo.dna.mitosis.notify
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
        }, aptosisChemical), () => {
          plasma.emit('kill')
        })
      })
    })
  })
}
