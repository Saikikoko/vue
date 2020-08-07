function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get: function() {
      console.log('get 获取数据', val)
      return val
    },
    set: function(newVal) {
      if(newVal !== val) {
        val = newVal
        observe(val)
        console.log('set 值更新了', val)
      }
    }
  })
}

function observe(obj) {
  // 判断一下是否是对象
  if(obj === null || typeof obj !== 'object') return;
  const ob = new Observer(obj)
}
class Observer {
  constructor(value) {
    this.value = value
    this.walk(value)
  }

  walk(obj) {
    // 遍历this.value
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })

  }
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}
const obj = {
  foo: '111',
  bar: 'baz',
  coo: {
    a: 1
  }
}
observe(obj)
// obj.foo
// obj.foo = 'bar'
// obj.bar
// obj.bar = '222'
// obj.coo.a
// obj.coo.a = 2
// obj.coo
obj.foo = {
  bbb: '111'
}

obj.foo.bbb
obj.foo.bbb = '222'
obj.ccc = 'ccccc'
obj.ccc
set(obj, 'ccc', 'ccccccc')
obj.ccc
