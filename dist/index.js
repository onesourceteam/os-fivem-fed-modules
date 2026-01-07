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
import { lazy } from "react";
var lazyLoad = (loader) => new Proxy({}, {
  get: (_, componentName) => {
    if (typeof componentName === "string") {
      return lazy(
        () => loader().then((module) => ({
          default: module[componentName]
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

// src/hooks/image-validation.hook.ts
import { useEffect as useEffect3, useState } from "react";
function isImgValid(url) {
  const img = new Image();
  img.src = url;
  return new Promise((resolve) => {
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
  });
}
var useImageValidation = (imageUrl) => {
  const [isImageValid, setIsImageValid] = useState(true);
  useEffect3(() => {
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
import { useEffect as useEffect4, useRef as useRef3, useState as useState2 } from "react";
var useSound = (src, options = {}) => {
  const { volume = 1, loop = false } = options;
  const [isPlaying, setIsPlaying] = useState2(false);
  const audioRef = useRef3(null);
  useEffect4(() => {
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

// src/hooks/key-press.hook.ts
import { useEffect as useEffect5, useRef as useRef4 } from "react";
var useKeyPress = (key, handler, options = {}) => {
  const {
    enabled = true,
    preventDefault = false,
    stopPropagation = false
  } = options;
  const savedHandler = useRef4(noop);
  useEffect5(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect5(() => {
    if (!enabled) return;
    const listener = (event) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      savedHandler.current(event);
    };
    window.addEventListener("keyup", listener);
    return () => window.removeEventListener("keyup", listener);
  }, [key, enabled, preventDefault, stopPropagation]);
};
export {
  Debugger,
  Post,
  isEnvBrowser,
  lazyLoad,
  noop,
  sleep,
  useImageValidation,
  useKeyPress,
  useListen,
  useObserve,
  useSound
};
//# sourceMappingURL=index.js.map