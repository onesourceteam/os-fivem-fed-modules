---
# os-fivem-fed-modules

A **React/TypeScript utility library** for FiveM NUI development, including hooks for reactive UI, event listeners, image validation, sound handling, lazy component loading, and utilities for debugging, posting events, and more.
---

## 📦 Installation

```bash
npm install os-fivem-fed-modules
# or
yarn add os-fivem-fed-modules
```

---

## 🪝 Hooks

### Index

- [useImageValidation](#useimagevalidation)
- [useListen](#uselistenn)
- [useObserve](#useobserve)
- [useSound](#usesound)

---

### `useImageValidation`

Validates an image URL before using it, returning a boolean state indicating if the image is valid.

#### **Import**

```ts
import { useImageValidation } from "os-fivem-fed-modules";
```

#### **Usage**

```tsx
const { isImageValid, imageUrl } = useImageValidation(
  "https://example.com/image.png"
);

return (
  <>
    {isImageValid ? (
      <img src={imageUrl} alt="Valid image" />
    ) : (
      <span>Invalid image</span>
    )}
  </>
);
```

#### **Return**

| Property       | Type      | Description                                  |
| -------------- | --------- | -------------------------------------------- |
| `isImageValid` | `boolean` | Indicates whether the image loaded correctly |
| `imageUrl`     | `string`  | The validated image URL                      |

---

### `useListen`

Adds a **reactive event listener** to an element or the `window`, ensuring the latest handler is always used without recreating the listener.

#### **Import**

```ts
import { useListen } from "os-fivem-fed-modules";
```

#### **Usage**

```tsx
useListen("keydown", (event) => {
  if (event.key === "Escape") {
    console.log("Escape key pressed!");
  }
});
```

#### **Custom element**

```tsx
const ref = useRef<HTMLDivElement>(null);

useListen(
  "click",
  () => {
    console.log("Element clicked!");
  },
  ref.current!
);
```

#### **Parameters**

| Parameter | Type                 | Default  | Description                                 |
| --------- | -------------------- | -------- | ------------------------------------------- |
| `event`   | `string`             | —        | Event name (e.g., `"click"`, `"keydown"`)   |
| `handler` | `(event: T) => void` | —        | Function to execute when event occurs       |
| `target`  | `EventTarget`        | `window` | Element where the listener will be attached |

---

### `useObserve`

Listens to messages sent via `window.postMessage` and executes a handler whenever the specified action matches. Ideal for NUI/iframe communication.

#### **Import**

```ts
import { useObserve } from "os-fivem-fed-modules";
```

#### **Usage**

```ts
useObserve("updatePlayerData", (data) => {
  console.log("Received data:", data);
});
```

#### **Parameters**

| Parameter | Type                | Description                                                         |
| --------- | ------------------- | ------------------------------------------------------------------- |
| `action`  | `string`            | The action name to observe in messages                              |
| `handler` | `(data: T) => void` | Function called when a message with the matching action is received |

---

### `useSound`

Handles audio playback in the browser, allowing play, pause, volume control, and looping.

#### **Import**

```ts
import { useSound } from "os-fivem-fed-modules";
```

#### **Usage**

```tsx
const { play, pause, isPlaying } = useSound("/sounds/notification.mp3", {
  volume: 0.8,
  loop: false,
});

return (
  <div>
    <button onClick={play}>Play</button>
    <button onClick={pause}>Pause</button>
    <p>{isPlaying ? "Playing..." : "Paused"}</p>
  </div>
);
```

#### **Parameters**

| Parameter | Type                       | Default                        | Description                 |
| --------- | -------------------------- | ------------------------------ | --------------------------- |
| `src`     | `string`                   | —                              | Audio file path or URL      |
| `options` | `UseSoundOptionsInterface` | `{ volume: 1.0, loop: false }` | Audio configuration options |

#### **Return**

| Property    | Type         | Description                            |
| ----------- | ------------ | -------------------------------------- |
| `play`      | `() => void` | Plays the audio                        |
| `pause`     | `() => void` | Pauses the audio                       |
| `isPlaying` | `boolean`    | Indicates whether the audio is playing |

---

## 🧩 Utilities

### `Debugger`

Processes and logs debug events sequentially, dispatching them via `window.postMessage`.

#### **Import**

```ts
import { Debugger } from "os-fivem-fed-modules";
```

#### **Usage**

```ts
const events = [
  { action: "playerJoin", data: { name: "Mestre" } },
  { action: "playerLeave", data: { name: "Enrique" } },
];

const debuggerInstance = new Debugger(events, 2000); // optional timer in ms
```

#### **Constructor Parameters**

| Parameter | Type                  | Default | Description                              |
| --------- | --------------------- | ------- | ---------------------------------------- |
| `events`  | `DebuggerEventType[]` | —       | List of events to process                |
| `timer`   | `number`              | `1000`  | Interval between processing events in ms |

---

### `isEnvBrowser`

Checks if the code is running in a **browser** or in a NUI/Native environment (FiveM).

#### **Import**

```ts
import { isEnvBrowser } from "os-fivem-fed-modules";
```

#### **Usage**

```ts
if (isEnvBrowser()) {
  console.log("Running in browser");
} else {
  console.log("Running in NUI/Native");
}
```

#### **Return**

| Type      | Description                                     |
| --------- | ----------------------------------------------- |
| `boolean` | `true` if running in browser, `false` otherwise |

---

### `lazyLoad`

Lazy loads multiple React components from a single module using `React.lazy` with a Proxy.

#### **Import**

```ts
import { lazyLoad } from "os-fivem-fed-modules";
```

#### **Usage**

```ts
const components = lazyLoad(() => import("./components"));
const Button = components.Button;
```

---

### `Post`

Utility class for sending POST requests to the FiveM backend, supporting mock data in browser environments.

#### **Import**

```ts
import { Post } from "os-fivem-fed-modules";
```

#### **Usage**

```ts
// NUI/Native backend call
Post.create("savePlayerData", { name: "Mestre", level: 5 }).then((response) =>
  console.log("Backend response:", response)
);

// Browser mock
Post.create(
  "getPlayerData",
  { some: "data" },
  { name: "Enrique", level: 10 }
).then((mockResponse) => console.log("Mock response:", mockResponse));
```

#### **Parameters**

| Parameter   | Type      | Description                                                    |
| ----------- | --------- | -------------------------------------------------------------- |
| `eventName` | `string`  | NUI/Native event name                                          |
| `data`      | `unknown` | Data to send in the POST body                                  |
| `mockData`  | `T`       | Returned in browser environment instead of sending the request |

#### **Return**

- Returns a `Promise<T>` with the backend response or the `mockData` in browser.

---

### `sleep`

Pauses code execution asynchronously for a given delay.

#### **Import**

```ts
import { sleep } from "os-fivem-fed-modules";
```

#### **Usage**

```ts
console.log("Start");
await sleep(2000);
console.log("Executed after 2 seconds");
```

#### **Parameters**

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `delay`   | `number` | Time in milliseconds to wait |

#### **Return**

- Returns a `Promise<boolean>` that resolves `true` after the specified delay.

---

Mestre, se quiser, posso também **adicionar uma seção “Contributing” e “License”** para deixar o README completo e pronto para publicar no GitHub/NPM.

Quer que eu faça isso?
