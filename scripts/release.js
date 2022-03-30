// yarn release --targetVersion xxx

const fs = require('fs')
const chalk = require('chalk')
const execa = require('execa')
const args = require('minimist')(process.argv.slice(2))

const step = msg => console.log(chalk.cyan(msg))
const run = (bin, args, opts = {}) => execa.sync(bin, args, { stdio: 'inherit', ...opts })

readyGo()

function readyGo () {
  const targetVersion = args.targetVersion

  updateVersion(targetVersion)

  const { stdout } = run('git', ['diff', '--cached'], { stdio: 'pipe' })

  if (stdout) {
    step('\nCommitting changes...')
    run('git', ['add', '-A'])
    run('git', ['commit', '-m', `release: v${targetVersion} :rocket:`])
  } else {
    console.log('No changes to commit.')
  }
  
  step('\nPushing to GitHub...')
  run('git', ['tag', `v${targetVersion}`])
  run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  run('git', ['push'])
}

function updateVersion (targetVersion) {
  const files = ['package.json']

  files.forEach(file => {
    const pkg = require(`../${file}`)
    pkg.version = targetVersion
    
    const content = JSON.stringify(pkg, null, 2)
    fs.writeFileSync(`./${file}`, content, 'utf8')
  })
}
