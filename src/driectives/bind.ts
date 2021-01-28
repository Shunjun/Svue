import { expr } from '../expression'
import VElememt from '../velement'

export default {
  init: null,
  update(velement: VElememt, direction: DirectiveOption) {
    let result = expr(direction.value, velement._component._data)

    velement._el.setAttribute(direction.arg!, result)
    if (direction.arg === 'value') {
      // TODO 抱错因为velement 的类型有问题 HTMLElement上 不存在value 必须为 HTMLInputElement or ...
      // @ts-ignore
      velement._el.value = result
    }
  },
  destory: null,
}
