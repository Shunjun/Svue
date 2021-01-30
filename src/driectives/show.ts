import { expr } from '../expression'
import VElememt from '../velement'

export default {
  init: null,
  update(velement: VElememt, direction: DirectiveOption) {
    let result = expr(direction.value, velement._proxy)

    if (result) {
      velement._el.style.display = ''
    } else {
      velement._el.style.display = 'none'
    }
  },
  destory: null,
}
