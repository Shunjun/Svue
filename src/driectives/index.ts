import { expr } from '../expression'
import VElememt from '../velement'

import bind from './bind'
import on from './on'
import model from './model'
import show from './show'
import cloak from './cloak'
import ifDri from './if'

let directives: Directives = {
  bind,
  on,
  model,
  cloak,
  show,
  if: ifDri,
  'else-if': {},
  else: {},
  for: {},
  html: {
    init: null,
    update(velement: VElememt, direction: DirectiveOption) {
      let result = expr(direction.value, velement._component._data)

      velement._el.innerHTML = result
    },
    destory: null,
  },
  text: {
    init: null,
    update(velement: VElememt, direction: DirectiveOption) {
      let result = expr(direction.value, velement._component._data)
      let text = document.createTextNode(result)
      velement._el.innerHTML = ''
      velement._el.appendChild(text)
    },
    destory: null,
  },
}

export default directives
