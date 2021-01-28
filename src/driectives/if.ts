import { expr } from '../expression'
import VElememt from '../velement'

export default {
  init(velement: VElememt, _direction: DirectiveOption) {
    // 创建一个注释节点,并保存在虚拟DOM上
    let holder = document.createComment('holder')
    velement._holder = holder
  },
  update(velement: VElememt, direction: DirectiveOption) {
    let result = expr(direction.value, velement._component._data)
    const el = velement._el
    const holder = velement._holder

    if (result) {
      if (!el.parentNode) {
        holder.parentNode?.replaceChild(el, holder)
      }
    } else {
      if (!holder.parentNode) {
        el.parentNode?.replaceChild(holder, el)
      }
    }
  },
}
