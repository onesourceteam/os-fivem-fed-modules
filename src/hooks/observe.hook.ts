import { type RefObject, useEffect, useRef } from "react";

import { isEnvBrowser, noop } from "../utils/misc.js";
import type { ObservedMessageType } from "../types/observe.hook.types.js";

type NuiHandlerSignature<T> = (data: T) => void;

class NuiListener<T> {
  private action: string;
  private savedHandler: RefObject<NuiHandlerSignature<T>>;

  constructor(action: string, handler: NuiHandlerSignature<T>) {
    this.action = action;
    this.savedHandler = useRef<NuiHandlerSignature<T>>(noop);
    this.setHandler(handler);
  }

  setHandler(handler: NuiHandlerSignature<T>) {
    this.savedHandler.current = handler;
  }

  observe() {
    const eventListener = (event: MessageEvent<ObservedMessageType<T>>) => {
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
}

export const useObserve = <T = unknown>(
  action: string,
  handler: (data: T) => void
) => {
  const listener = useRef(new NuiListener<T>(action, handler));

  useEffect(() => {
    listener.current.setHandler(handler);
  }, [handler]);

  useEffect(() => {
    return listener.current.observe();
  }, [action]);
};
