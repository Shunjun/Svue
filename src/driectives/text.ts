import {expr} from '../expression'
import VElement from '../velement'

export default {
  init: null,
  update(vElement: VElement, direction: DirectiveOption) {
    let result = expr(direction.value, vElement._proxy)
    let text = document.createTextNode(result)
    vElement._el.innerHTML = ''
    vElement._el.appendChild(text)
  },
  destroy: null,
}
