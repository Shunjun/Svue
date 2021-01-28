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

export default function createProxy(activeData: DateType, cb: NotifyCb): DateType
export default function createProxy(activeData: DateType, staticData: DateType, cb: NotifyCb): DateType
export default function createProxy(activeData: DateType, staticData: DateType, cb?: NotifyCb): DateType {
  // 处理重构
  let callback: NotifyCb
  if (isNotifyCb(staticData)) {
    callback = staticData
    staticData = {}
  } else {
    callback = cb!
  }

  let data: DateType | Array<any>

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
      if (isstaticKey(key)) {
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

  if (staticData && !Array.isArray(data)) {
    // 将 staticData 放入 data
    for (const key in staticData) {
      data[key] = staticData[key]
    }
  }

  // 判断name 是不是静态 Key
  // 静态 Key 不会触发 Callback
  function isstaticKey(name: string | number) {
    if (typeof name === 'number') {
      return false
    } else {
      // key 是 object
      let res = false
      name in staticData && (res = true)
      staticKeys.forEach((key) => {
        name.startsWith(key) && (res = true)
      })

      return res
    }
  }

  return new Proxy(data, {
    get(data: DateType, name: keyof typeof data) {
      return Reflect.get(data, name)
    },
    set(data: DateType, name: keyof typeof data, val) {
      if (isstaticKey(name)) {
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
