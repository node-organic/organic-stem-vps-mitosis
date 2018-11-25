#!/usr/bin/env node

const StackUpgrade = require('organic-stack-upgrade')
const path = require('path')
const getcells = require('organic-dna-cells-info')

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
  if (!resulted_answers['mitosis-name']) {
    resulted_answers['mitosis-name'] = await stack.ask('mitosis-name?')
  }
  let loadRootDNA = require(path.join(destDir, 'cells/node_modules/lib/load-root-dna'))
  let rootDNA = await loadRootDNA()
  let cells = getcells(rootDNA.cells)
  let cellFound = false
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].name === resulted_answers['cell-name']) {
      resulted_answers['cwd'] = cells[i].cwd.replace('cells/', '')
      resulted_answers['cdp'] = cells[i].dnaBranchPath
        .replace(/\./g, path.sep)
        .replace(resulted_answers['cell-name'], '')
      cellFound = cells[i]
      if (!cells[i].dna.mitosis) continue
      let mitosis = cells[i].dna.mitosis[resulted_answers['mitosis-name']]
      if (!mitosis) throw new Error('mitosis not found ' + resulted_answers['mitosis-name'] + ' for cell ' + resulted_answers['cell-name'])
      resulted_answers['zygote'] = mitosis.zygote ? 'true' : 'false'
      resulted_answers['count'] = mitosis.count
      resulted_answers['vps-name'] = mitosis.target.name
      resulted_answers['vps-ip'] = mitosis.target.ip
      resulted_answers['vps-domain'] = mitosis.target.domain
      resulted_answers['cell-mode'] = mitosis.mode
      break
    }
  }
  if (!cellFound) throw new Error('cell not found ' + resulted_answers['cell-name'])
  if (!resulted_answers['zygote']) {
    resulted_answers['zygote'] = await stack.ask('zygote? (true for static webapps)', 'false')
  }
  if (resulted_answers['zygote'] === 'true') {
    resulted_answers['count'] = 1
  } else {
    if (!resulted_answers['count']) {
      resulted_answers['count'] = await stack.ask('count?', 2)
    }
  }
  resulted_answers = await stack.configure({
    sourceDirs: [path.join(__dirname, 'seed')],
    answers: resulted_answers
  })
  await stack.merge({
    sourceDir: path.join(__dirname, 'seed'),
    answers: resulted_answers
  })
  if (resulted_answers['zygote'] !== 'true') {
    await stack.merge({
      sourceDir: path.join(__dirname, 'seed-server-cell'),
      answers: resulted_answers
    })
  }
  await stack.updateJSON()
  let cellName = resulted_answers['cell-name']
  console.info(`run npm install on ${cellName}...`)
  await stack.exec(`npx angel repo cell ${cellName} -- npm install`)
  console.info('run npm install...')
  await stack.exec('npm install')
}

if (module.parent) {
  module.exports = execute
} else {
  execute().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
