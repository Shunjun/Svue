import { assert } from './common'
import Vue from './vue'

export default class VNode<T extends Node> {
  public _el: T
  public $children?: VNode<Node>[]
  public _component: Vue
  public status: StatusType
  constructor(el: T, component: Vue) {
    assert(el)
    assert(el instanceof Node)
    this._el = el
    this.status = 'uninit'
    this._component = component
  }

  render() {
    throw new Error('render has not rewrite')
  }
}
