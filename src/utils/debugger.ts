import type { DebuggerEventType } from "../types/debugger.types.js";
import { isEnvBrowser } from "./misc.js";

export class Debugger {
  private events: DebuggerEventType[];
  private timer: number = 1000;

  constructor(events: DebuggerEventType[], timer?: number) {
    this.events = events;
    if (timer) {
      this.timer = timer;
    }
    if (isEnvBrowser()) {
      this.startProcessing();
    }
  }

  private startProcessing(): void {
    this.events.forEach((event) => {
      setTimeout(() => {
        this.handleEvent(event);
      }, this.timer);
    });
  }

  private handleEvent(event: DebuggerEventType): void {
    console.log("Processing event:", event);
    setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { ...event },
        })
      );
    });
  }
}
