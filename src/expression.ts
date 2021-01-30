import { assert } from './common'
import VComponent from './vcomponent'
import VNode from './vnode'

type Data = { [K: string]: any }

/**
 * 解析字符指令,并通过evel执行,返回运行的结果
 *
 * @export
 * @template T
 * @param {string} str 需要解析的字符串
 * @param {T} data 数据
 * @return {*}
 */
export function expr<T extends Data>(str: string, data: T): any {
  const keyWords: { [K: string]: true } = {
    new: true,
    class: true,
    let: true,
    const: true,
    true: true,
  }

  let strSegment = parserStr(str)

  let evalStrArr: string[] = []

  for (const key in strSegment) {
    if (Object.prototype.hasOwnProperty.call(strSegment, key)) {
      const segment = strSegment[key]
      if (segment.type === 'expr') {
        // 用来储存上一次匹配到的字符串
        let lastStr: string
        function saveLastStr(str: string) {
          lastStr = str
          return str
        }

        let value = segment.value.replace(/\.?[\$|_|a-z][a-z|0-9|_|\$|]*/gi, (str: string) => {
          if (str.startsWith('.')) {
            return saveLastStr(str)
          }
          if ((str in window && !data[str]) || str in keyWords) {
            return saveLastStr(str)
          } else {
            if (lastStr in keyWords || str in keyWords) {
              keyWords[str] = true
              return saveLastStr(str)
            }
            return saveLastStr(`data.${str}`)
          }
        })
        evalStrArr.push(value)
      } else if (segment.type === 'string') {
        evalStrArr.push(`"${segment.value}"`)
      }
    }
  }
  let evalStr = evalStrArr.join('')

  return eval(evalStr)
}

/**
 * 解析字符串模板
 * {{xxx}}
 *
 * @export
 * @param {string} str
 * @param {Data} data
 */
export function compileStringTemplate(str: string) {
  let result: { type: 'string' | 'expression'; value: string }[] = []

  let s = 0
  let n = 0
  while ((n = str.indexOf('{{', s)) !== -1) {
    if (n > s) {
      result.push({ type: 'string', value: str.slice(s, n) })
    }

    let m = 2
    for (let i = n + 2; i < str.length; i++) {
      const letter = str[i]

      if (letter === '{') {
        m++
      }
      if (letter === '}') {
        m--
      }

      if (m === 0) {
        s = i + 1
        break
      }
    }
    if (m !== 0) {
      throw new Error('花括号没有配对')
    }
    result.push({
      type: 'expression',
      value: str.slice(n + 2, s - 2),
    })
  }

  if (s < str.length - 1) {
    result.push({ type: 'string', value: str.slice(s) })
  }

  return result
}

/**
 * 处理表达式,区分表达式与字符串
 *
 * @export
 * @param {string} str
 * @return {*}
 */
export function parserStr(
  str: string
): {
  type: string
  value: any
}[] {
  let strArr = []

  while (1) {
    let n = str.search(/'|"/)

    if (n === -1) {
      strArr.push({
        type: 'expr',
        value: str,
      })
      break
    }

    if (n > 0) {
      strArr.push({
        type: 'expr',
        value: str.slice(0, n),
      })
    }
    str = str.slice(n)

    // 找匹配的第二个引号
    let m = 1
    let sign = str[0]

    while (1) {
      m = str.indexOf(sign, m)

      if (m === -1) {
        assert(false, '引号没配对')
      }

      if (str[m - 1] === '\\') {
        m++
        continue
      } else {
        break
      }
    }
    strArr.push({
      type: 'string',
      value: str.slice(1, m),
    })
    str = str.slice(m + 1)
  }

  return strArr
}
