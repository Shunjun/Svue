import Vue from "../src/vue";
import VElememt from "../src/velement";

Vue.component("cmp1", {
  template: `
    <div>{{a}}</div>
    `,
  props: ["a"],
});

Vue.component("cmp2", {
  template: `
    <div></div>
    `,
});

let vm = ((window as typeof window & { vm: any }).vm = Vue({
  el: "#root",
  data: {
    a: 12,
    b: 5,
    c: 100,
    json: { son: { d: 100 } },
    show: true,
    str: "<strong>这是插入的文字</strong>",
    arr: ["张三", "李四", "王五"],
  },
  method: {
    haha() {
      console.log("哈哈哈");
    },
    showHandler() {
      // @ts-ignore
      this.show = !this.show;
    },
    fn() {
      // @ts-ignore
      this.b++;
    },
    jsonAdd() {
      // @ts-ignore
      this.json.son.d++;
    },
    addpeople() {
      const names = ["张三", "李四", "王五", "赵六"];
      // @ts-ignore
      this.arr.push(names[Math.floor(Math.random() * 4)]);
    },
  },
  watch: {
    "json.son.d": function () {
      //@ts-ignore
      console.log("json.son.d 改变了", this.json);
    },
  },
  computed: {},
  created() {
    console.log("初始化完成");
  },
  updated() {
    console.log("更新了");
  },
  directives: {
    herf: {
      init(_vElement: VElememt, _direction: DirectiveOption) {},
    },
  },
  components: {
    "A-CMP": {
      template: `
      <div>哈哈哈{{a}}
        <input type="button" value="组件按钮" @click="haha"/>
      </div>`,
      data: {
        a: 1,
      },
      method: {
        haha() {
          // @ts-ignore
          this.a++;
        },
      },
    },
  },
}));

console.log(vm);
