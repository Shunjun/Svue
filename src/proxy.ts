interface NotifyCb {
  (name: PropertyKey): void
}

function isObject(item: any): item is object {
  return typeof item === 'object'
}

function isNotifyCb(item: any): item is NotifyCb {
  return typeof item === 'function'
}

const staticKeys = ['$']

export default function createProxy(activeData: DataType, cb: NotifyCb): DataType
export default function createProxy(activeData: DataType, staticDatas: DataType, cb: NotifyCb): DataType
export default function createProxy(activeData: DataType, staticDatas: DataType, cb?: NotifyCb): DataType {
  // 处理重构
  let callback: NotifyCb
  if (isNotifyCb(staticDatas)) {
    callback = staticDatas
    staticDatas = {}
  } else {
    callback = cb!
  }

  let data: DataType | Array<any>

  if (Array.isArray(activeData)) {
    data = []
    activeData.forEach((item) => {
      if (isObject(item)) {
        data.push(createProxy(item, callback))
      } else {
        data.push(item)
      }
    })
  } else {
    data = {}
    for (const key in activeData) {
      if (isStaticKey(key)) {
        throw new Error(`[${key}] is unavailable`)
      }
      const item = activeData[key]

      if (isObject(item)) {
        data[key] = createProxy(item, callback)
      } else {
        data[key] = item
      }
    }
  }

  // 判断name 是不是静态 Key
  // 静态 Key 不会触发 Callback
  function isStaticKey(name: string | number) {
    if (typeof name === 'number') return false
    // 是 object
    let res = false
    staticKeys.forEach((key) => {
      name.startsWith(key) && (res = true)
    })

    return res
  }

  return new Proxy(data, {
    get(data: DataType, name: keyof typeof data | keyof typeof staticDatas) {
      if (name in staticDatas) {
        return staticDatas[name]
      } else {
        return Reflect.get(data, name)
      }
    },
    set(data: DataType, name: keyof typeof data, val) {
      if (isStaticKey(name)) {
        Reflect.set(data, name, val)
        return true
      } else {
        if (typeof val === 'object') {
          Reflect.set(data, name, createProxy(val, callback))
        } else {
          Reflect.set(data, name, val)
        }

        callback(name)

        return true
      }
    },
  })
}
