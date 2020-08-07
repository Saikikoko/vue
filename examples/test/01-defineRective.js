function isObject(value) {
  return value !== null && typeof value === 'object'
}
function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}
function initState (vm) {
  // vm._watchers = []
  // const opts = vm.$options
  // if (opts.data) {
  //   initData(vm) // 响应式
  // } else {
  // }
  Dep.target = new Watcher()
  observe(vm)
}

// function initData (vm) {
//   let data = vm.$options.data
//   data = vm._data = typeof data === 'function'
//     ? getData(data, vm) // 组件使用function 所以使用函数取出data数据
//     : data || {}
//   if (!isPlainObject(data)) {
//     data = {}
//   }
//   // observe data
//   observe(data, true /* asRootData */) // 响应式
// }

function observe (value) {
  if (!isObject(value)) {
    return
  }
  let ob
  if (Array.isArray(value) || isPlainObject(value)) {
    // 新建一个观察者对象
    ob = new Observer(value)
  }
  return ob
}

class Observer {

  constructor (value) {
    this.value = value
    this.dep = new Dep()
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 如果是数组的话遍历执行
      this.observeArray(value)
    } else {
      // 遍历对象
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

function defineReactive (obj,key,val,)
{
  // 新建一个管家（本职就是观察者模式）用于通知更新
  const dep = new Dep() // 发布者

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = observe(val) // val可能本身是一个对象，所以需要重新调用observe
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        // 收集依赖
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }

      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    }
  })
}

class Dep {
  static target;

  constructor () {
    this.subs = []
  }

  addSub (sub) { // watcher就是我们的订阅者
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}


class Watcher {
  update() {
    console.log('收到，开始更新')
  }

  addDep (dep) {
    // const id = dep.id
    // if (!this.newDepIds.has(id)) {
    //   this.newDepIds.add(id)
    //   this.newDeps.push(dep)
    //   if (!this.depIds.has(id)) {
    //     dep.addSub(this)
    //   }
    // }
    dep.addSub(this)
  }
}

function dependArray (value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

const data = {
  foo: 'bar',
  baz: '111'
}
initState(data)

data.foo
data.foo = '222'
