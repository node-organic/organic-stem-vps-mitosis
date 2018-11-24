const path = require('path')
const os = require('os')
const generateCore = require('organic-stem-core-template')
const generateCronCell = require('organic-stem-cron-cell-template')

let tempDir = path.join(os.tmpdir(), 'test-stack-upgrade-' + Math.random())

beforeAll(async () => {
  jest.setTimeout(60 * 1000)
  await generateCore({
    destDir: tempDir,
    answers: {
      'project-name': 'test'
    }
  })
  await generateCronCell({
    destDir: tempDir,
    answers: {
      'cell-name': 'testcell',
      'intervalMiliseconds': 1000,
      'cell-groups': ['test'],
      'cwd': 'crons/testcell'
    }
  })
})

test('stack upgrade', async () => {
  jest.setTimeout(60 * 1000)
  let execute = require('../index')
  await execute({
    destDir: tempDir,
    answers: {
      'cell-name': 'testcell',
      'cwd': 'crons/testcell',
      'vps-name': 'prod',
      'vps-ip': '127.0.0.1',
      'vps-domain': 'domain.com',
      'zygote': 'false',
      'count': 2,
      'notify-channels': ['nginx', 'systemd'],
      'mitosis-name': 'prod',
      'cell-mode': '_production'
    }
  })
})

test('stack upgrade again', async () => {
  jest.setTimeout(60 * 1000)
  let execute = require('../index')
  await execute({
    destDir: tempDir,
    answers: {
      'cell-name': 'testcell',
      'mitosis-name': 'prod',
      'override': true
    }
  })
})
