// yarn release xxx

const fs = require('fs')
const chalk = require('chalk')
const execa = require('execa')
const args = require('minimist')(process.argv.slice(2))

const step = msg => console.log(chalk.cyan(msg))
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })

readyGo()

async function readyGo() {
  const targetVersion = args._[0]

  updateVersion(targetVersion)

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })

  if (stdout) {
    step('\nCommitting changes...')
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: v${targetVersion} :tada:`])
  } else {
    console.log('No changes to commit.')
  }

  step('\nPushing to GitHub...')
  await run('git', ['push'])
  await run('git', ['tag', `v${targetVersion}`])
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
}

function updateVersion(targetVersion) {
  const files = ['package.json']

  files.forEach(file => {
    const pkg = require(`../${file}`)
    pkg.version = targetVersion

    const content = JSON.stringify(pkg, null, 2)
    fs.writeFileSync(`./${file}`, content, 'utf8')
  })
}