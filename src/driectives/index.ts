import { expr } from '../expression'
import VElememt from '../velement'

import bind from './bind'
import on from './on'
import show from './show'
import cloak from './cloak'
import ifDri from './if'
import forDri from './for'

let directives: Directives = {
  bind,
  on,
  cloak,
  show,
  if: ifDri,
  'else-if': {},
  else: {},
  for: forDri,
  html: {
    init: null,
    update(velement: VElememt, direction: DirectiveOption) {
      let result = expr(direction.value, velement._proxy)

      velement._el.innerHTML = result
    },
    destory: null,
  },
  text: {
    init: null,
    update(velement: VElememt, direction: DirectiveOption) {
      let result = expr(direction.value, velement._proxy)
      let text = document.createTextNode(result)
      velement._el.innerHTML = ''
      velement._el.appendChild(text)
    },
    destory: null,
  },
}

export default directives
