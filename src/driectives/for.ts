import VElememt from '../velement'
import { expr } from '../expression'

export default {
  init(velement: VElememt, direction: DirectiveOption) {
    const template = (direction.mate.template = velement)
    const holder = (direction.mate._holder = document.createComment('for holder'))
    const parentNode = velement._el.parentNode
    // 初始化一个容器,用来存放生成的循环节点
    let elements: VElememt[] = (direction.mate.elements = [])
    direction.mate.oldData = []
    // 用注释节点替换原节点
    parentNode?.replaceChild(holder, template._el)

    // 重写顶级for元素的render,每次执行时调用 elements 中的render
    velement.render = function () {
      const { dataName, keyName, indexName } = parserForValue(direction.value)
      const oldData = [...direction.mate.oldData]

      let resArr = expr(dataName, velement._proxy)

      let newELements = new Array<VElememt | null>(resArr.length)

      // diff 渲染后的数据
      resArr.forEach((data: any, index: number) => {
        let i = oldData.indexOf(data) // 如果oldData里有

        if (i !== -1) {
          // 旧数据中纯在,则移动旧元素到新元素中
          newELements[index] = elements[i]
          elements.splice(i, 1)
          oldData.splice(i, 1)
        } else {
          // 如果旧数据中不存在,则放置一个空
          newELements[index] = null
        }
      })

      let fm = document.createDocumentFragment()
      newELements.forEach((vele, index: number) => {
        if (vele === null) {
          if (elements.length) {
            vele = newELements[index] = elements.pop()!
          } else {
            vele = newELements[index] = template.clone()
          }
        }
        let data = resArr[index]

        // 将数据放到当前元素的_data中
        vele._set(keyName, data)
        vele._set(indexName, index)

        vele.render()
        fm.append(vele._el)
      })

      elements.forEach((item) => item._el.remove())

      elements = newELements as VElememt[]
      holder.after(fm)

      direction.mate.oldData = [...resArr]
    }
  },
  update: null,
  destory: null,
}

/**
 * 解析 for 指令
 *
 * @param {string} str 'item,index in data'
 * @return {*} {keyName:'item',indexName:'index',dataName:'data}
 */
function parserForValue(str: string) {
  let [keys, dataName] = str.split(' in ')
  let [keyName, indexName] = keys.split(',')
  return {
    keyName: keyName || 'item',
    indexName: indexName || 'index',
    dataName,
  }
}
