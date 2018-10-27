const loadRootDNA = require('../cells/node_modules/lib/load-root-dna')
module.exports = function (angel) {
  angel.on('setup {{{vps-name}}} mitosis', async function () {
    let rootDNA = await loadRootDNA()
    let vpsIP = rootDNA.vps['{{{vps-name}}}'].ip
    await angel.exec(`ssh root@${vpsIP} '${[
      'adduser node -D /home/node || true',
      'apt-get update',
      'apt-get -y install git build-essentials',
      'git clone https://github.com/creationix/nvm.git /home/node/.nvm || true',
      'cd /home/node/.nvm',
      'git checkout v0.33.11'
    ].join(' && ')}'`)
    await angel.exec('npx organic-nginx-configurator ' + vpsIP)
    await angel.exec('npx organic-systemd-configurator ' + vpsIP)
  })
}
