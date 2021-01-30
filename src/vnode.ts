import { assert } from './common'
import * as uuid from 'uuid'
import VComponent from './vcomponent'

export default class VNode<T extends Node> {
  public _el: T
  public $children: VNode<Node>[]
  public $root: Vue | VComponent
  public status: StatusType
  public _data: DataType
  public $parent: VNode<any> | Vue
  public _proxy: DataType
  public name: string
  public _vue: true

  constructor(el: T, parent: VNode<any> | Vue, component: Vue | VComponent) {
    assert(el)
    assert(el instanceof Node)

    this._vue = true
    this._el = el
    this.status = 'uninit'
    this.name = `${el.nodeName}-${uuid.v4()}`
    this.$root = component
    this.$parent = parent
    this.$children = []
    this._data = {}
    let _that = this
    this._proxy = new Proxy(this.$root._data, {
      get(_target: DataType, key: string) {
        return _that._get(key)
      },
    })
  }

  _set(key: string, value: any) {
    this._data[key] = value
  }

  _get(key: string): any {
    let cur: VNode<any> | Vue = this

    while (cur) {
      if (cur._data[key] !== undefined) {
        return cur._data[key]
      }

      if (isVNode(cur)) {
        cur = cur.$parent
      } else {
        break
      }
    }

    return undefined
  }

  render() {
    throw new Error('render has not rewrite')
  }

  clone() {
    // TODO
    return new VNode(this._el.cloneNode(true), this.$parent, this.$root)
  }
}

function isVNode(item: any): item is VNode<any> {
  return !!(item?._vue && item?.$parent)
}
