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
  lazyLoad: () => lazyLoad,
  noop: () => noop,
  sleep: () => sleep,
  useImageValidation: () => useImageValidation,
  useListen: () => useListen,
  useObserve: () => useObserve,
  useSound: () => useSound
});
module.exports = __toCommonJS(index_exports);

// src/utils/isEnvBrowser.ts
var isEnvBrowser = () => !window.invokeNative;

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

// src/utils/post.ts
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

// src/utils/lazyLoad.ts
var import_react = require("react");
var lazyLoad = (loader) => new Proxy({}, {
  get: (_, componentName) => {
    if (typeof componentName === "string") {
      return (0, import_react.lazy)(
        () => loader().then((module2) => ({
          default: module2[componentName]
        }))
      );
    }
    return;
  }
});

// src/utils/sleep.ts
var sleep = (delay) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, delay);
});

// src/utils/index.ts
var noop = () => {
};

// src/hooks/observe.hook.ts
var import_react2 = require("react");
var NuiListener = class {
  action;
  savedHandler;
  constructor(action, handler) {
    this.action = action;
    this.savedHandler = (0, import_react2.useRef)(noop);
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
  const listener = (0, import_react2.useRef)(new NuiListener(action, handler));
  (0, import_react2.useEffect)(() => {
    listener.current.setHandler(handler);
  }, [handler]);
  (0, import_react2.useEffect)(() => {
    return listener.current.observe();
  }, [action]);
};

// src/hooks/listen.hook.ts
var import_react3 = require("react");
var Listener = class {
  event;
  savedHandler;
  constructor(event, handler) {
    this.event = event;
    this.savedHandler = (0, import_react3.useRef)(handler);
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
  const listener = (0, import_react3.useRef)(new Listener(event, handler));
  (0, import_react3.useEffect)(() => {
    listener.current.setHandler(handler);
  }, [handler]);
  (0, import_react3.useEffect)(() => {
    return listener.current.listen(target);
  }, [event, target]);
};

// src/hooks/imageValidation.hook.ts
var import_react4 = require("react");
function isImgValid(url) {
  const img = new Image();
  img.src = url;
  return new Promise((resolve) => {
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
  });
}
var useImageValidation = (imageUrl) => {
  const [isImageValid, setIsImageValid] = (0, import_react4.useState)(true);
  (0, import_react4.useEffect)(() => {
    const validateImage = async () => {
      try {
        const isValid = await isImgValid(imageUrl);
        setIsImageValid(isValid);
      } catch (error) {
        console.error("Error validating image:", error);
        setIsImageValid(false);
      }
    };
    validateImage();
  }, [imageUrl]);
  return { isImageValid, imageUrl };
};

// src/hooks/sound.hook.ts
var import_react5 = require("react");
var useSound = (src, options = {}) => {
  const { volume = 1, loop = false } = options;
  const [isPlaying, setIsPlaying] = (0, import_react5.useState)(false);
  const audioRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    audioRef.current = new Audio(src);
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [src, volume, loop]);
  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  return { play, pause, isPlaying };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Debugger,
  Post,
  isEnvBrowser,
  lazyLoad,
  noop,
  sleep,
  useImageValidation,
  useListen,
  useObserve,
  useSound
});
//# sourceMappingURL=index.cjs.map