import bind from './bind'
import on from './on'
import show from './show'
import cloak from './cloak'
import ifDri from './if'
import forDri from './for'
import html from './html'
import text from './text'

let directives: Directives = {
  bind,
  on,
  cloak,
  show,
  if: ifDri,
  'else-if': {},
  else: {},
  for: forDri,
  html,
  text,
}

export default directives
