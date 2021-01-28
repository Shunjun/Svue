import { expr } from '../expression'
import VElememt from '../velement'

export default {
  init(velement: VElememt, direction: DirectiveOption) {
    if (!direction.value || !direction.arg) return
    let value = direction.value

    // 添加一个事件
    velement.$directives.push({ name: 'on', arg: 'input', value: `${value}=$event.target.value` })

    velement.$directives.push({ name: 'bind', arg: 'value', value: value })
  },
  update(velement: VElememt, direction: DirectiveOption) {
    let result = expr(direction.value, velement._component._data)

    velement._el.setAttribute(direction.arg!, result)
  },
  destory: null,
}
