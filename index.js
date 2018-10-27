#!/usr/bin/env node

const StackUpgrade = require('organic-stack-upgrade')
const path = require('path')

const execute = async function ({destDir = process.cwd(), answers} = {}) {
  let stack = new StackUpgrade({
    destDir: destDir,
    packagejson: path.join(__dirname, '/package.json')
  })
  if (!await stack.checkUpgrade('organic-stem-core-template', '^2.1.0')) {
    throw new Error('organic-stem-core-template ^2.1.0 not found, are you working into the repo root?')
  }
  let resulted_answers = answers || {}
  if (!resulted_answers['cell-name']) {
    resulted_answers['cell-name'] = await stack.ask('cell-name?')
  }
  if (!resulted_answers['cwd']) {
    resulted_answers['cwd'] = await stack.ask(`cwd? (relative to ${destDir}/cells/)`, resulted_answers['cell-name'])
  }
  resulted_answers['cdp'] = path.resolve(resulted_answers['cwd'], '../')
  if (!resulted_answers['zygote']) {
    resulted_answers['zygote'] = await stack.ask('zygote? (true for static webapps)', 'true')
  }
  if (resulted_answers['zygote'] === 'true') {
    resulted_answers['count'] = 1
  } else {
    if (!resulted_answers['count']) {
      resulted_answers['count'] = await stack.ask('count?', 2)
    }
  }
  if (!resulted_answers['notify-channels']) {
    let defaultChannels = ['nginx', 'systemd']
    if (resulted_answers['zygote'] === 'true') {
      defaultChannels = ['nginx']
    }
    resulted_answers['notify-channels'] = (await stack.ask('notify-channels? (comma separated)', defaultChannels)).split(',')
  }
  resulted_answers = await stack.configure({
    sourceDirs: [path.join(__dirname, 'seed')],
    answers: resulted_answers
  })
  await stack.merge({
    sourceDir: path.join(__dirname, 'seed'),
    answers: resulted_answers
  })
  await stack.updateJSON()
  let cellName = resulted_answers['cell-name']
  console.info(`run npm install on ${cellName}...`)
  await stack.exec(`npx angel repo cell ${cellName} -- npm install`)
  console.info('run npm install...')
  await stack.exec('npm install')
  if (!resulted_answers['disable-vps-setup']) {
    if (await stack.ask(`setup ${resulted_answers['vps-name']} for mitosis?`, 'yes') === 'yes') {
      await stack.exec(`npx angel setup vps ${resulted_answers['vps-name']} mitosis`)
    }
  }
}

if (module.parent) {
  module.exports = execute
} else {
  execute().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
