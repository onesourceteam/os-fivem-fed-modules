import { useEffect, useRef } from "react";

import { noop } from "@/utils/index.js";

type KeyPressHandler = (event: KeyboardEvent) => void;

interface UseKeyPressOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export const useKeyPress = (
  key: string,
  handler: KeyPressHandler,
  options: UseKeyPressOptions = {}
) => {
  const {
    enabled = true,
    preventDefault = false,
    stopPropagation = false,
  } = options;

  const savedHandler = useRef<KeyPressHandler>(noop);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();

      savedHandler.current(event);
    };

    window.addEventListener("keyup", listener);
    return () => window.removeEventListener("keyup", listener);
  }, [key, enabled, preventDefault, stopPropagation]);
};
