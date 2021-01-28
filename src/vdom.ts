import { assert, isElementOption } from './common'
import VElememt from './velement'
import VComponent from './vcomponent'
import VNode from './vnode'
import VText from './vtest'
import Vue from './vue'

export default function createVDom(node: VOptions, compoennt: Vue) {
  assert(node)
  assert(node._vue)
  assert(node.type === 'element' || node.type === 'text')

  if (isElementOption(node)) {
    let parent: VNode<any>
    if (node.isHtml) {
      // VElement
      parent = new VElememt(node, compoennt)
    } else {
      // Component
      parent = new VComponent(node, compoennt)
    }
    parent.$children = node.children?.map((child) => createVDom(child, compoennt))

    return parent
  } else {
    // VText
    return new VText(node, compoennt)
  }
}
