import { assert } from './common'
import { parserDirectives, parserListeners } from './parser'
import VNode from './vnode'
import createVDom from './vdom'
import { parserDOM } from './parser'
import VComponent from './vcomponent'

export default class VElememt extends VNode<HTMLElement> {
  public type: VElementOption['type']
  public $attrs: VElementOption['atts']
  public $directives: DirectiveOption[]
  public $listeners: DirectiveOption[]
  public _options: VElementOption

  constructor(options: VElementOption, parent: VNode<any> | VComponent, component: VComponent) {
    assert(options)
    assert(options.el)
    assert(options.atts)
    super(options.el as HTMLElement, parent, component)

    this._options = options
    this.type = options.type
    this.$attrs = options.atts
    this.$directives = parserDirectives(this.$attrs)
    this.$listeners = parserListeners(this.$directives)
    this._data = {}

    this._directive('init')
    this.status = 'init'
  }

  render() {
    this._directive('update')

    this.$children?.forEach((ele) => ele.render())

    this.status = 'update'
  }

  _directive(type: VNode<any>['status']) {
    // 优先执行model
    runDirective.call(this, this.$directives)

    // 执行其他指令

    function runDirective(this: VElememt, dirArr: DirectiveOption[]) {
      dirArr.forEach((directive) => {
        let directiveObj = this.$root._directives[directive.name]

        if (directiveObj && type !== 'uninit') {
          let dirFn = directiveObj[type]
          typeof dirFn === 'function' && dirFn.call(this, this, directive)
        }
      })
    }
  }

  clone() {
    let domTree = parserDOM(this._el.cloneNode(true))! as VElementOption
    // 删除 v-for 的 atts
    // 不删除会引起递归渲染
    domTree.atts = domTree.atts.filter((item) => item.name !== 'v-for')
    let vdomTree = createVDom(domTree!, this.$parent, this.$root) as VElememt

    return vdomTree
  }
}
