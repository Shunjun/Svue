import {expr} from '../expression'
import VElement from '../velement'

export default {
  init: null,
  update(vElement: VElement, direction: DirectiveOption) {
    let result = expr(direction.value, vElement._proxy)

    if (result) {
      vElement._el.style.display = ''
    } else {
      vElement._el.style.display = 'none'
    }
  },
  destroy: null,
}
