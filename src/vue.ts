import { dom } from './common'
import createVDom from './vdom'
import { parserDOM } from './parser'
import VNode from './vnode'
import createProxy from './proxy'
import defaultDriectives from './driectives'

class Vue {
  root: VNode<any>
  _data: DataType
  _directives: Directives
  _render_timeer: NodeJS.Timeout
  status: StatusType
  created?: () => void
  updated?: () => void
  constructor(options: VueOptions) {
    const { data, methed, created, updated, directives } = options
    // 初始化响应数据
    let _staticData = { ...methed } // 不被监听的对象
    this._data = createProxy(data || {}, _staticData, () => {
      this.forceRender()
    })
    this._directives = { ...defaultDriectives, ...directives }
    this.created = created
    this.updated = updated
    this._render_timeer = (0 as unknown) as NodeJS.Timeout
    let el = dom(options.el)
    let domTree = parserDOM(el)
    let vdomTree = createVDom(domTree!, this, this)
    this.root = vdomTree

    // 初始化所有 directive
    // function initDirective(ele: VElememt) {
    //   if (ele._directive) {
    //     ele._directive('init')
    //     ele.status = 'init'
    //   }

    //   ele.$children?.forEach((ele) => ele._directive('init'))
    // }
    // initDirective(this.root)

    // 初始化结束 执行 created 方法
    this.status = 'init'
    this.created && this.created.call(this._data)

    this.render()
  }

  forceRender() {
    clearTimeout(this._render_timeer)

    this._render_timeer = setTimeout(() => {
      this.render()
    }, 0)
  }

  render() {
    this.root.render()

    this.status = 'update'
    this.updated && this.updated.call(this._data)
  }
}

// 只导出
export default (options: VueOptions) => {
  let vue = new Vue(options)

  return vue._data
}
