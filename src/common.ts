export function assert<T>(exp: T, msg?: string): exp is NonNullable<T> {
  if (!exp) {
    throw new Error(msg || 'assert error')
  }
  return true
}

/**
 * 获取dom元素
 *
 * @export
 * @param {*} str
 * @return {*}
 */
export function dom(str: any): Node {
  if (typeof str === 'string') {
    let element = document.querySelector(str)
    assert(element, `${str} is not exist`)
    return element!
  } else if (str instanceof Node) {
    return str
  } else {
    throw new Error(`${str} is invalid`)
  }
}

export function isElementOption(option: any): option is VElementOption {
  return option.type === 'element'
}
