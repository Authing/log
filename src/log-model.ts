import { GSGLConfig } from './types'

const LogModel = class {
  name: string = ''
  site: string
  page: string
  block: string
  element: string

  uid: string
  upid: string
  aid: string
  expansionBlock: any

  inspectionPassed: boolean = true // 是否检查通过？
  filterPoint: any = {}

  constructor(buryCode: string, config?: GSGLConfig) {
    const diyWindow = {
      __userPoolId__: '-',
      __user__: { id: '-' },
      ...window,
    }
    // 四段式
    this.site = config?.defaultSite || '-' // todo，可以根据几个域名做字典映射
    this.page = config?.defaultPage || '-'
    this.block = config?.defaultBlock || '-'
    this.element = config?.defaultElement || '-'

    // 配置值 > window
    this.upid = config?.defaultUserPoolId || diyWindow?.__userPoolId__ || '-'
    this.uid = config?.defaultUserId || diyWindow?.__user__?.id || '-'

    this.expansionBlock = {} // 拓展块，未来要兼容其他格式用的

    this.paserCode(buryCode)
    this.setName() // 拼接埋点名字
  }

  paserCode(logString: string) {
    let [path, queryBlock] = logString.split('?')
    // 埋点字符串 格式校验
    if (!path) {
      console.warn('埋点解析错误，无法获取 path 块', logString)
      return
    }
    // 读取 query 部分解析

    queryBlock && this.paserQuery(queryBlock)
    this.paserPath(path)
  }

  paserPath(path) {
    // 读取 path 部分解析
    let pathList = path.split('/')
    if (pathList.length === 1) {
      // 只有 block/element 两个块，隐含表示 page 是 index
      let [e] = pathList
      this.element = e
    } else if (pathList.length === 2) {
      // 只有 block/element 两个块，隐含表示 page 是 index
      let [b, e] = pathList
      this.block = b
      this.element = e
    } else if (pathList.length === 3) {
      // 有 page/block/element，3个块，没有隐含表示
      let [p, b, e] = pathList
      this.page = p
      this.block = b
      this.element = e
    } else if (pathList.length === 4) {
      // 有 site/page/block/element，4个块，没有隐含表示
      let [s, p, b, e] = pathList
      this.site = s
      this.page = p
      this.block = b
      this.element = e
    } else {
      console.warn('埋点解析错误，path 块长度超出 4 位', path)
      this.inspectionPassed = false
    }
  }

  paserQuery(queryBlock) {
    let entries = queryBlock.split('&')
    entries.forEach((e) => {
      let [k, v] = e.split('=')
      if (k === 'alive') {
        this.filterPoint.alive = v
      }
    })
  }

  setName() {
    this.name = `${this.site}_${this.page}_${this.block}_${this.element}` // 拼接
    if (this.name?.includes('-')) {
      console.warn('埋点解析警告：本次埋点包含 "-"，表示某项信息没有补全', this.name)
    }
  }
}

export default LogModel
