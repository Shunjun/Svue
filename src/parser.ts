import { assert } from './common'

export function isHtmlElement(dom: Node): dom is HTMLElement {
  return dom.nodeType === document.ELEMENT_NODE
}

export function isTextElement(dom: Node): dom is Text {
  return dom.nodeType === document.TEXT_NODE
}

/**
 * 解析原始DOM,创建虚拟Dom的option
 *
 * @export
 * @param {Node} dom
 * @return {*}  {(VOptions | null)}
 */
export function parserDOM(dom: Node): VOptions | null {
  if (isHtmlElement(dom)) {
    // 处理 Element 节点

    // 标签类型
    let tag = dom.tagName
    // 属性
    let atts = Array.from(dom.attributes).map((att) => {
      return { name: att.name, value: att.value }
    })

    // children
    let children: VOptions[] | null = null
    if (dom.childNodes.length > 0) {
      children = Array.from(dom.childNodes)
        .map((child) => parserDOM(child))
        .filter((item) => item !== null) as VOptions[]
    }

    // 是否原生HTML元素
    let isHtml = dom.constructor !== HTMLUnknownElement && dom.constructor !== HTMLElement

    return {
      type: 'element',
      tag,
      el: dom,
      atts,
      children,
      isHtml,
      _vue: true,
    }
  } else if (isTextElement(dom)) {
    // 处理 text 节点
    let str = dom.data.trim()
    if (str) {
      return {
        type: 'text',
        el: dom,
        data: str,
        children: null,
        isHtml: true,
        _vue: true,
      }
    }
    return null
  }
  return null
}

/**
 * 解析指令,返回指令列表
 *
 * @export
 * @param {Attributes} attrs
 * @return {*} {name, arg, value}
 */
export function parserDirectives(attrs: Attributes): DirectiveOption[] {
  let directives: DirectiveOption[] = []

  for (const key in attrs) {
    if (Object.prototype.hasOwnProperty.call(attrs, key)) {
      let directive: DirectiveOption | undefined
      const attribute = attrs[key]
      let value = attribute.value === '' ? 'true' : attribute.value
      if (attribute.name.startsWith('v-')) {
        // v- v-if="xxx" v-bind:xxx="xxx" v-show="xxx" v-on:xxx="xxx"
        let [name, arg] = attribute.name.split(':')
        name = name.replace(/^v\-/, '')
        directive = { name, arg, value, mate: {} }
      } else if (attribute.name.startsWith(':')) {
        // : v-bind:xxx
        let arg = attribute.name.slice(1)
        directive = { name: 'bind', arg, value, mate: {} }
      } else if (attribute.name.startsWith('@')) {
        // @ v-on:xxx
        let arg = attribute.name.slice(1)
        directive = { name: 'on', arg, value, mate: {} }
      }

      if (directive) {
        assert(directive.name, `directive's name is required: ${key} `)
        assert((directive.name === 'on' && directive.arg) || directive.name !== 'on', `v-on arg is required: ${key} `)
        assert(
          (directive.name === 'bind' && directive.arg) || directive.name !== 'bind',
          `v-bind arg is required: ${key} `
        )

        if (directive.name === 'model') {
          // 拆分model指令为on和bind
          let value = directive.value

          directives.push({ name: 'on', arg: 'input', value: `${value}=$event.target.value`, mate: {} })
          directives.push({ name: 'bind', arg: 'value', value: value, mate: {} })
        } else {
          directives.push(directive)
        }
      }
    }
  }

  return directives
}

export function parserListeners(directives: DirectiveOption[]) {
  return directives.filter((directive) => directive.name === 'on')
}
