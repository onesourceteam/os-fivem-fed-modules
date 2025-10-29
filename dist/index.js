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
import { useEffect, useRef } from "react";
var NuiListener = class {
  action;
  savedHandler;
  constructor(action, handler) {
    this.action = action;
    this.savedHandler = useRef(noop);
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
  const listener = useRef(new NuiListener(action, handler));
  useEffect(() => {
    listener.current.setHandler(handler);
  }, [handler]);
  useEffect(() => {
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
import { useEffect as useEffect2, useRef as useRef2 } from "react";
var Listener = class {
  event;
  savedHandler;
  constructor(event, handler) {
    this.event = event;
    this.savedHandler = useRef2(handler);
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
  const listener = useRef2(new Listener(event, handler));
  useEffect2(() => {
    listener.current.setHandler(handler);
  }, [handler]);
  useEffect2(() => {
    return listener.current.listen(target);
  }, [event, target]);
};
export {
  Debugger,
  Post,
  isEnvBrowser,
  noop,
  useListen,
  useObserve
};
//# sourceMappingURL=index.js.map