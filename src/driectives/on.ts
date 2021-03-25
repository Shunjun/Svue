import { expr } from "../expression";
import VElement from "../velement";

export default {
  init(velement: VElement, direction: DirectiveOption) {
    if (!direction.value || !direction.arg) return;

    let eventHandler = (ev: Event) => {
      // 只有一个函数可以不写括号
      // fn
      // fn()
      velement._set("$event", ev);

      let str = direction.value;
      if (/^[\$|_|a-z][a-z|0-9|_|\$|]*$/i.test(str)) {
        str = `${str}($event)`;
      }
      // console.log("v-on", str, velement._proxy);
      expr(str, velement._proxy);
    };
    direction.mate._eventHandler = {
      name: direction.arg,
      handler: eventHandler,
    };
    velement._el.addEventListener(direction.arg, eventHandler);
  },
  update: null,
  destroy(velement: VElement, direction: DirectiveOption) {
    const eventHandler = direction.mate._eventHandler;
    if (eventHandler) {
      const { name, handler } = eventHandler;
      velement._el.removeEventListener(name, handler);
    }
  },
};
