import Vue from './vue'
import VElememt from './velement'

let vm = ((window as typeof window & { vm: any }).vm = Vue({
  el: '#root',
  data: {
    a: 12,
    b: 5,
    c: 100,
    show: true,
    str: '<strong>这是插入的文字</strong>',
  },
  methed: {
    showHandler() {
      console.log('show')
      // @ts-ignore
      this.show = !this.show
    },
    fn() {
      this.a++
    },
  },
  created() {
    console.log('初始化完成')
  },
  updated() {
    console.log('更新了')
  },
  directives: {
    herf: {
      init(velement: VElememt, direction: DirectiveOption) {
        console.log(this, velement, direction)
      },
    },
  },
}))

console.log(vm)