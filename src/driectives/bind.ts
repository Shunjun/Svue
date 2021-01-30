import { expr } from '../expression'
import VElememt from '../velement'

export default {
  init(velement: VElememt, direction: DirectiveOption) {
    direction.mate._last_result = null
  },
  update(velement: VElememt, direction: DirectiveOption) {
    const lastResult = direction.mate._last_result
    const result = expr(direction.value, velement._proxy)

    if (result !== lastResult) {
      velement._el.setAttribute(direction.arg!, result)
      if (direction.arg === 'value') {
        // TODO 抱错因为velement 的类型有问题 HTMLElement上 不存在value 必须为 HTMLInputElement or ...
        // @ts-ignore
        velement._el.value = result
      }
      direction.mate._last_result = result
    }
  },
  destory: null,
}
