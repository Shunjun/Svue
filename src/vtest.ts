import VNode from './vnode'
import { assert } from './common'
import Vue from './vue'
import { compileStringTemplate, expr } from './expression'

export default class VText extends VNode<Text> {
  public _template: string
  constructor(options: VTextOption, component: Vue) {
    assert(options)
    assert(options.el)
    assert(options.data)

    super(options.el as Text, component)

    this._template = options.data

    this.render()

    this.status = 'init'
  }

  render() {
    let data = compileStringTemplate(this._template)
      .map((item) => {
        if (item.type === 'expression') {
          return expr(item.value, this._component._data)
        } else {
          return item.value
        }
      })
      .join('')

    this._el.data = data

    this.status = 'update'
  }
}
