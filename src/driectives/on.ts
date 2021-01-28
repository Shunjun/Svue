import { expr } from '../expression'
import VElememt from '../velement'

export default {
  init(velement: VElememt, direction: DirectiveOption) {
    if (!direction.value || !direction.arg) return

    let eventHandler = (ev: Event) => {
      // 只有一个函数可以不写括号
      // fn
      // fn()
      velement._component._data.$event = ev
      let str = direction.value
      if (/^[\$|_|a-z][a-z|0-9|_|\$|]*$/i.test(str)) {
        str = `${str}($event)`
      }
      expr(str, velement._component._data)
    }
    velement._eventHandler = { name: direction.arg, handler: eventHandler }

    velement._el.addEventListener(direction.arg, eventHandler)
  },
  update: null,
  destory(velement: VElememt, _direction: DirectiveOption) {
    if (velement._eventHandler) {
      const { name, handler } = velement._eventHandler
      velement._el.removeEventListener(name, handler)
    }
  },
}
