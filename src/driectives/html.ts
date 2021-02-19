import {expr} from '../expression'
import VElement from '../velement'

export default {
  init: null,
  update(vElement: VElement, direction: DirectiveOption) {
    let result = expr(direction.value, vElement._proxy)
    vElement._el.innerHTML = result
  },
  destroy: null,
}
