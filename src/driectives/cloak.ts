import VElememt from '../velement'

export default {
  init: null,
  update(velement: VElememt, _direction: DirectiveOption) {
    if (velement._el.getAttributeNames().indexOf('v-cloak')) {
      velement._el.removeAttribute('v-cloak')
    }
  },
  destory: null,
}
