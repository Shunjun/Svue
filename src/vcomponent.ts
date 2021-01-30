import { assert } from './common'
import VElememt from './velement'
import VNode from './vnode'

export default class VComponent extends VElememt {
  public _directives: any
  constructor(options, parent: VNode<any> | Vue, component: Vue | VComponent) {
    assert(options)
    super(options, parent, component)
  }

  render() {}
}
