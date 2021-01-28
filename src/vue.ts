import { dom } from './common'
import createVDom from './vdom'
import { parserDOM } from './parser'
import VNode from './vnode'
import createProxy from './proxy'
import defaultDriectives from './driectives'

class Vue {
  root: VNode<any>
  _data: DateType
  _directives: Directives
  status: StatusType
  created?: () => void
  updated?: () => void
  constructor(options: VueOptions) {
    const { data, methed, created, updated, directives } = options
    // 初始化响应数据
    let _staticData = { ...methed } // 不被监听的对象
    this._data = createProxy(data || {}, _staticData, () => {
      this.render()
    })

    this._directives = { ...defaultDriectives, ...directives }
    this.created = created
    this.updated = updated

    let el = dom(options.el)
    let domTree = parserDOM(el)
    let vdomTree = createVDom(domTree!, this)
    this.root = vdomTree

    // 初始化结束 执行 created 方法
    this.status = 'init'
    this.created && this.created.call(this._data)

    // 第一次渲染
    this.render()
  }

  render() {
    // 渲染自己
    this.root.render()

    // 渲染子集
    this.root.$children?.forEach((child) => child.render())

    this.status = 'update'
    this.updated && this.updated.call(this._data)
  }
}

// 只导出
export default (options: VueOptions) => {
  let vue = new Vue(options)

  return vue._data
}
