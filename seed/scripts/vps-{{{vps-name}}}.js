const loadRootDNA = require('../cells/node_modules/lib/load-root-dna')
const fs = require('fs')
const pubsshkey_contents = function () {
  return new Promise((resolve, reject) => {
    fs.readFile(`/home/${process.env.USER}/.ssh/id_rsa.pub`, (err, contents) => {
      if (err) return reject(err)
      resolve(contents.toString())
    })
  })
}
module.exports = function (angel) {
  angel.on('vps {{{vps-name}}} setup', async function () {
    let rootDNA = await loadRootDNA()
    let vpsIP = rootDNA.vps['{{{vps-name}}}'].ip
    console.log('setup ' + vpsIP)
    let setupFilePath = 'dna/vps/{{{vps-name}}}.sh'
    await angel.exec(`scp ${setupFilePath} root@${vpsIP}:/home/root/setup.sh`)
    let setupCmds = `ssh root@${vpsIP} '${[
      '/bin/bash /home/root/setup.sh',
      `echo "${await pubsshkey_contents()}" >> /home/node/.ssh/authorized_keys`
    ].join(' && ')}'`
    console.info(setupCmds)
    await angel.exec(setupCmds)
    console.info('installing root cell node-organic/organic-nginx-configurator...')
    await angel.exec('npx node-organic/organic-nginx-configurator ' + vpsIP)
    console.info('installing root cell node-organic/organic-systemd-configurator...')
    await angel.exec('npx node-organic/organic-systemd-configurator ' + vpsIP)
    console.info('installing root cell node-organic/organic-flush-legacy-cells...')
    await angel.exec('npx node-organic/organic-flush-legacy-cells ' + vpsIP)
    console.info('{{{vps-name}}} vps setup done.')
  })
  angel.on('vps {{{vps-name}}} update services', async () => {
    let rootDNA = await loadRootDNA()
    let vpsIP = rootDNA.vps['{{{vps-name}}}'].ip
    console.info('updating root cell node-organic/organic-nginx-configurator...')
    await angel.exec('npx node-organic/organic-nginx-configurator ' + vpsIP)
    console.info('updating root cell node-organic/organic-systemd-configurator...')
    await angel.exec('npx node-organic/organic-systemd-configurator ' + vpsIP)
    console.info('installing root cell node-organic/organic-flush-legacy-cells...')
    await angel.exec('npx node-organic/organic-flush-legacy-cells ' + vpsIP)
  })
  angel.on('vps {{{vps-name}}} restart services', async () => {
    let rootDNA = await loadRootDNA()
    let vpsIP = rootDNA.vps['{{{vps-name}}}'].ip
    let reloadCmds = `ssh root@${vpsIP} '${[
      'systemctl restart organic-nginx-configurator',
      'systemctl restart organic-systemd-configurator',
      'systemctl restart organic-flush-legacy-cells',
    ].join(' && ')}'`
    console.info(reloadCmds)
    await angel.exec(reloadCmds)
  })
  angel.on('vps {{{vps-name}}} status', async () => {
    let rootDNA = await loadRootDNA()
    let vpsIP = rootDNA.vps['v9'].ip
    let statusCmd = `ssh root@${vpsIP} 'systemctl status'`
    console.info(statusCmd)
    await angel.exec(statusCmd)
  })
}
