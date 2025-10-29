"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Debugger: () => Debugger,
  Post: () => Post,
  isEnvBrowser: () => isEnvBrowser,
  noop: () => noop,
  useListen: () => useListen,
  useObserve: () => useObserve
});
module.exports = __toCommonJS(index_exports);

// src/utils/misc.ts
var isEnvBrowser = () => !window.invokeNative;
var noop = () => {
};

// src/utils/debugger.ts
var Debugger = class {
  events;
  timer = 1e3;
  constructor(events, timer) {
    this.events = events;
    if (timer) {
      this.timer = timer;
    }
    if (isEnvBrowser()) {
      this.startProcessing();
    }
  }
  startProcessing() {
    this.events.forEach((event) => {
      setTimeout(() => {
        this.handleEvent(event);
      }, this.timer);
    });
  }
  handleEvent(event) {
    console.log("Processing event:", event);
    setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { ...event }
        })
      );
    });
  }
};

// src/hooks/observe.hook.ts
var import_react = require("react");
var NuiListener = class {
  action;
  savedHandler;
  constructor(action, handler) {
    this.action = action;
    this.savedHandler = (0, import_react.useRef)(noop);
    this.setHandler(handler);
  }
  setHandler(handler) {
    this.savedHandler.current = handler;
  }
  observe() {
    const eventListener = (event) => {
      const { action: eventAction, data } = event.data;
      if (eventAction === this.action && this.savedHandler.current) {
        if (isEnvBrowser()) {
          console.log("Observed event:", event);
        }
        this.savedHandler.current(data);
      }
    };
    window.addEventListener("message", eventListener);
    return () => window.removeEventListener("message", eventListener);
  }
};
var useObserve = (action, handler) => {
  const listener = (0, import_react.useRef)(new NuiListener(action, handler));
  (0, import_react.useEffect)(() => {
    listener.current.setHandler(handler);
  }, [handler]);
  (0, import_react.useEffect)(() => {
    return listener.current.observe();
  }, [action]);
};

// src/hooks/post.hook.ts
var Post = class _Post {
  eventName;
  data;
  mockData;
  constructor(eventName, data, mockData) {
    this.eventName = eventName;
    this.data = data;
    this.mockData = mockData;
  }
  static async create(eventName, data, mockData) {
    const instance = new _Post(eventName, data, mockData);
    return instance.execute();
  }
  async execute() {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(this.data)
    };
    if (isEnvBrowser() && this.mockData) {
      return this.mockData;
    }
    const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : "nui-frame-app";
    try {
      const resp = await fetch(
        `https://${resourceName}/${this.eventName}`,
        options
      );
      const respFormatted = await resp.json();
      return respFormatted;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
};

// src/hooks/listen.hook.ts
var import_react2 = require("react");
var Listener = class {
  event;
  savedHandler;
  constructor(event, handler) {
    this.event = event;
    this.savedHandler = (0, import_react2.useRef)(handler);
  }
  setHandler(handler) {
    this.savedHandler.current = handler;
  }
  listen(target) {
    const eventListener = (event) => {
      this.savedHandler.current(event);
    };
    target.addEventListener(this.event, eventListener);
    return () => target.removeEventListener(this.event, eventListener);
  }
};
var useListen = (event, handler, target = window) => {
  const listener = (0, import_react2.useRef)(new Listener(event, handler));
  (0, import_react2.useEffect)(() => {
    listener.current.setHandler(handler);
  }, [handler]);
  (0, import_react2.useEffect)(() => {
    return listener.current.listen(target);
  }, [event, target]);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Debugger,
  Post,
  isEnvBrowser,
  noop,
  useListen,
  useObserve
});
//# sourceMappingURL=index.cjs.map