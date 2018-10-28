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
  angel.on('setup vps {{{vps-name}}} mitosis', async function () {
    let rootDNA = await loadRootDNA()
    let vpsIP = rootDNA.vps['{{{vps-name}}}'].ip
    console.log('setup ' + vpsIP)
    let setupCmds = `ssh root@${vpsIP} '${[
      'adduser --disabled-password --gecos "" --home /home/node node',
      'apt-get update',
      'apt-get -y install git build-essential',
      'cd /home/node/',
      'git clone https://github.com/creationix/nvm.git .nvm',
      'cd /home/node/.nvm',
      'git checkout v0.33.11',
      'mkdir /home/node/.ssh',
      `echo "${await pubsshkey_contents()}" >> /home/node/.ssh/authorized_keys`
    ].join(' && ')}'`
    console.info(setupCmds)
    await angel.exec(setupCmds)
    console.info('commands completed sucessfully...')
    console.info('installing root cells...')
    await angel.exec('npx organic-nginx-configurator ' + vpsIP)
    await angel.exec('npx organic-systemd-configurator ' + vpsIP)
    console.info(`setup of ${vpsIP} done.`)
  })
}
