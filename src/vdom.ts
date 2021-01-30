import { assert, isElementOption } from './common'
import VElememt from './velement'
import VComponent from './vcomponent'
import VText from './vtext'
import VNode from './vnode'

export default function createVDom(node: VOptions, parent: VNode<any> | Vue, compoennt: Vue | VComponent) {
  assert(node?._vue)
  assert(node.type === 'element' || node.type === 'text')

  if (isElementOption(node)) {
    if (node.isHtml) {
      // VElement
      let vele = new VElememt(node, parent, compoennt)
      vele.$children = node.children?.map((child) => createVDom(child, vele, compoennt)) || []
      return vele
    } else {
      // Component
      let vcmp = new VComponent(node, parent, compoennt)
      vcmp.$children = node.children?.map((child) => createVDom(child, vcmp, vcmp)) || []
      return vcmp
    }
  } else {
    // VText
    return new VText(node, parent, compoennt)
  }
}
