import { assert, dom } from './common'
import createVDom from './vdom'
import { parserDOM } from './parser'
import VNode from './vnode'
import createProxy from './proxy'
import defaultDriectives from './driectives'

export default class VComponent {
  // @ts-ignore
  root?: VNode<any> | VComponent
  _data: DataType
  _staticData: DataType
  _directives: Directives
  _render_timeer: NodeJS.Timeout
  status: StatusType
  options: ComponentOptions
  _watch: Watch
  _watch_list: Watch[keyof Watch][]
  _computed: Computed
  _computed_result: DataType
  public vue: ComponentOptions | null
  public _isvue: boolean //用来判断是否是vue实例
  public _isroot: boolean
  created?: () => void
  updated?: () => void

  constructor(options: ComponentOptions, vue?: ComponentOptions, node?: VElementOption) {
    const { data, method, created, updated, directives, watch, computed, props } = options
    this.options = options
    this._watch = watch || {}
    this._watch_list = []
    this._computed = computed || {}
    this._computed_result = {}
    this._isvue = true
    this._isroot = vue ? false : true
    this.vue = vue || null
    this.created = created
    this.updated = updated
    this._render_timeer = (0 as unknown) as NodeJS.Timeout

    // 初始化响应数据
    this._staticData = { ...method, ...this._computed_result } // 可以获取值但不会触发 callback

    this._data = createProxy(data || {}, this._staticData, (path: PropertyKey[]) => {
      this.doWatch(path)
      // TODO computed 如何缓存结果
      this.doComputed()
      this.forceRender()
    })
    this._directives = { ...defaultDriectives, ...directives }

    this.doComputed()

    this.initDomTree()
    // 初始化结束 执行 created 方法

    // 没有解析props,没法传表达式
    props?.forEach(item => {
      this._staticData[item] = undefined
      node?.atts.forEach(att => {
        if (att.name === item) {
          this._staticData[item] = att.value
        }
      })
    })
    console.log(this._staticData)

    this.status = 'init'
    this.created && this.created.call(this._data)

    this.render()
  }

  initDomTree() {
    // 初始化所有虚拟节点,过程中会初始化所有指令
    const el = pickElement(this.options)
    let domTree = parserDOM(el)
    if (!this._isroot && this.vue) {
      let vdomTree = createVDom(domTree!, this, this, this.vue)
      this.root = vdomTree
    } else {
      let vdomTree = createVDom(domTree!, this, this, this)
      this.root = vdomTree
    }
  }

  doComputed() {
    Object.keys(this._computed).forEach((key) => {
      const comput = this._computed[key]

      this._computed_result[key] = comput()
      comput()
    })
  }

  doWatch(path: PropertyKey[]) {
    let watchKey: string = ''

    path.forEach((key) => {
      // TODO 处理symbol
      watchKey += watchKey === '' ? String(key) : `.${String(key)}`
      if (watchKey in this._watch) {
        this._watch_list.push(this._watch[watchKey])
      }
    })
  }

  forceRender() {
    clearTimeout(this._render_timeer)
    this._render_timeer = setTimeout(() => {
      this.render()
    }, 0)
  }

  render() {
    this.root!.render()

    // 执行 watch
    this._watch_list.forEach((cb) => cb.call(this._data, this._data))
    this._watch_list.length = 0

    this.status = 'update'
    this.updated && this.updated.call(this._data)
  }
}


function pickElement(options: ComponentOptions) {
  const { el, template } = options
  if (el) {
    return dom(el)
  } else if (template && typeof template === 'string') {
    const el = document.createElement('div')
    el.innerHTML = template
    assert(el.children.length === 1)
    return el.children[0]
  } else {
    throw new Error("can't find element")
  }
}