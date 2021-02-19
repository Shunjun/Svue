// import { assert } from './common'
import VComponent from './vcomponent'

const globalComponents: { [K: string]: ComponentOptions } = {}

export default function Vue(options: VueOptions) {
  for (const key in options.components) {
    const definition = options.components[key];
    Vue.component(key, definition)
  }

  return new VComponent(options)
}

Vue.component = function (id: string, definition?: ComponentOptions) {
  id = id.toLowerCase()
  if (!definition) {
    return globalComponents[id]
  } else {
    definition.name = definition.name || id
    globalComponents[id] = definition
    return definition
  }
}