const OSS = require('ali-oss')
const path = require('path')
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: args.accessKeyId,
  accessKeySecret: args.accessKeySecret,
  bucket: 'authing-cdn-cn-prod'
})

async function put (ossPath) {
  try {
    const { version } = require(`${process.cwd()}/package.json`)
    await client.put(
      `packages/authing-log/${version}/${ossPath}`, 
      path.normalize(`${process.cwd()}/build/${ossPath}`)
    )
  } catch (e) {
    throw new Error('put oss error: ' + JSON.stringify(e))
  }
}

function getAndPutFile (dir = `${process.cwd()}/build`) {
  fs.readdirSync(dir).forEach(async (item) => {
    const fullPath = path.join(dir, item)
    
    if (fs.statSync(fullPath).isDirectory()) {
      return getAndPutFile(fullPath)
    }

    const separator = '/build/'
    const index = fullPath.indexOf(separator)
    const ossPath = fullPath.slice(index + separator.length)

    console.log(ossPath)
    put(ossPath)
  })
}

getAndPutFile()
