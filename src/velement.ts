import { assert } from './common'
import { parserDirectives, parserListeners } from './parser'
import VNode from './vnode'

export default class VElememt extends VNode<HTMLElement> {
  public type: VElementOption['type']
  public $attrs: VElementOption['atts']
  public $directives: DirectiveOption[]
  public $listeners: DirectiveOption[]
  // TODO 应该统一管理eventHandler
  public _eventHandler?: { name: string; handler: EventListener }

  constructor(options: VElementOption, component: Vue) {
    assert(options)
    assert(options.el)
    assert(options.atts)
    super(options.el as HTMLElement, component)

    this.type = options.type
    this.$attrs = options.atts
    this.$directives = parserDirectives(this.$attrs)
    this.$listeners = parserListeners(this.$directives)

    this._directive('init')

    this.status = 'init'

    // 更新
    this.render()
  }

  render() {
    // 渲染自己---执行指令
    this._directive('update')

    // 渲染子集
    this.$children?.forEach((child) => child.render())

    this.status = 'update'
  }

  _directive(type: VNode<any>['status']) {
    // 优先执行model
    runDirective.call(
      this,
      this.$directives.filter((dire) => dire.name === 'model')
    )

    // 执行其他指令
    runDirective.call(
      this,
      this.$directives.filter((dire) => dire.name !== 'model')
    )

    function runDirective(this: VElememt, dirArr: DirectiveOption[]) {
      dirArr.forEach((directive) => {
        let directiveObj = this._component._directives[directive.name]

        if (directiveObj && type !== 'uninit') {
          let dirFn = directiveObj[type]
          typeof dirFn === 'function' && dirFn.call(this, this, directive)
        }
      })
    }
  }
}
