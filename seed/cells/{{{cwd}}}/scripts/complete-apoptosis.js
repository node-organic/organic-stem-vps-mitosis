const loadCellInfo = require('lib/load-cell-info')
const Plasma = require('organic-plasma')
const buildChannel = require('organic-plasma-channel')

module.exports = function (angel) {
  angel.on('complete apoptosis :mitosisName', async function (angel) {
    let cellInfo = await loadCellInfo('{{{cell-name}}}')
    let packagejson = require('../package.json')
    let mitosis = cellInfo.dna.mitosis[angel.cmdData.mitosisName]
    let apoptosisChemical = {
      action: 'onCellApoptosisComplete',
      cellInfo: {
        name: cellInfo.name,
        cwd: process.cwd(),
        version: packagejson.version,
        nodeVersion: packagejson.engines.node,
        mitosis: mitosis
      }
    }
    let notifyChannels = mitosis.notifyChannels
    notifyChannels.forEach((channelName) => {
      let plasma = new Plasma()
      buildChannel(plasma, Object.assign({
        'channelName': channelName,
        'swarmOpts': {
          'utp': false,
          'tcp': true,
          'dns': true,
          'dht': false
        },
        'emitReady': 'channelReady'
      }, mitosis.broadcastChannelDNA))
      plasma.on('channelReady', () => {
        console.info('notify ' + channelName + ' ...')
        plasma.emit(Object.assign({
          type: 'control',
          channel: channelName
        }, apoptosisChemical), () => {
          console.info(channelName + ' acknowledged.')
          plasma.emit('kill')
        })
      })
    })
  })
}
