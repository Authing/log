
// 工具函数
export const findParent = (e: HTMLElement) => {
  let parent = e.parentNode
  while (parent) {
    let next = parent as HTMLElement
    if (next?.dataset?.log) {
      return next
    }
    parent = parent.parentNode
  }
}

export const doReports = (m, callbackDict) => {
  Object.keys(callbackDict).forEach((key) => {
    let call = callbackDict[key]
    let aliveFilter = m.filterPoint['alive']
    if (aliveFilter) {
      if (aliveFilter === key) {
        call && call(m)
      }
    } else {
      call && call(m)
    }
  })
}
