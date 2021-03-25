import { assert, isElementOption } from "./common";
import VElememt from "./velement";
import VComponent from "./vcomponent";
import VText from "./vtext";
import VNode from "./vnode";
import Vue from "./vue";

export default function createVDom(
  node: VOptions,
  parent: VNode<any> | ComponentOptions,
  component: ComponentOptions | VComponent,
  vue: ComponentOptions
) {
  assert(node?._vue);
  assert(node.type === "element" || node.type === "text");

  if (isElementOption(node)) {
    if (node.isHtml) {
      // 创建VElement
      const vele = new VElememt(node, parent, component);
      vele.$children =
        node.children?.map((child) =>
          createVDom(child, vele, component, vue)
        ) || [];
      return vele;
    } else {
      // 创建Component
      let comp = Vue.component(node.tag);
      assert(comp, `no "${node.tag}" component fond!`);

      let vComp = new VComponent(comp, vue, node);
      // @ts-ignore
      node.el.replaceWith(vComp.root._el);
      return vComp;
    }
  } else {
    // VText
    return new VText(node, parent, component);
  }
}
