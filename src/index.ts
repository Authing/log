import LogModel from './log-model'
import { GSGLConfig } from './types'
import { doReports, findParent } from './util'

const GrassSnakesGrayLines = class {
  reportDict: any
  config?: GSGLConfig

  constructor(reportDict, config?: GSGLConfig) {
    this.reportDict = reportDict
    this.config = config
  }

  bury(log) {
    let m = new LogModel(log, this.config)
    m.inspectionPassed && doReports(m, this.reportDict)
  }
}

export const registerLogTrack = (reportDict, config?: GSGLConfig) => {
  let gsgl = new GrassSnakesGrayLines(reportDict, config)
  document.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) {
      return
    }
    // 点击的元素本身就可以触发
    if (e.target.dataset.log) {
      let log = e.target.dataset.log
      gsgl.bury(log)
      return
    }
    // 点击元素本身不能触发，尝试寻找父元素触发
    let dom = findParent(e.target)
    if (dom) {
      let log = dom.dataset.log
      gsgl.bury(log)
    } else {
      // console.log("最终没有找到可触发的父元素，本次点击未埋点");
    }
  })
  return gsgl
}

export { LogModel }
