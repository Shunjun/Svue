import { assert } from './common'
import VElememt from './velement'
import Vue from './vue'

export default class VComponent extends VElememt {
  constructor(options, component: Vue) {
    assert(options)
    super(options, component)
  }

  render() {}
}
