import { expr } from '../expression'
import VElememt from '../velement'

export default {
  init: null,
  update(velement: VElememt, direction: Directive) {
    let result = expr(direction.value, velement._component._data)

    if (result) {
      velement._el.style.display = ''
    } else {
      velement._el.style.display = 'none'
    }
  },
  destory: null,
}
