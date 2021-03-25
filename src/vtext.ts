import VNode from "./vnode";
import { assert } from "./common";
import { compileStringTemplate, expr } from "./expression";
import VComponent from "./vcomponent";

export default class VText extends VNode<Text> {
  public _template: string;
  public _last_data: string; // 上一次渲染的内容,用来比较更新

  constructor(
    options: VTextOption,
    parent: VNode<any> | Vue,
    component: Vue | VComponent
  ) {
    assert(options);
    assert(options.el);
    assert(options.data);

    super(options.el as Text, parent, component);
    this._template = options.data;
    this._last_data = "";

    this.status = "init";
  }

  render() {
    let data = compileStringTemplate(this._template)
      .map((item) => {
        if (item.type === "expression") {
          return expr(item.value, this._proxy);
        } else {
          return item.value;
        }
      })
      .join("");

    if (data !== this._last_data) {
      this._el.data = data;
      this._last_data = data;
    }

    this.status = "update";
  }
}
