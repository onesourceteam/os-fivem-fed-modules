# os-fivem-fed-modules

Biblioteca compartilhada para desenvolvimento Front-End em projetos FiveM . Ela fornece hooks e utilitários para:

- Observar mensagens NUI (window.postMessage) com tipagem e segurança de handler
- Enviar eventos para o backend (Lua/JS) com fallback para ambiente de navegador
- Simular eventos NUI no navegador durante o desenvolvimento (Debugger)
- Utilidades úteis como lazy load de componentes, detecção de ambiente, sleep e manipulação de áudio

## Instalação

```bash
# npm
npm install os-fivem-fed-modules

# yarn
yarn add os-fivem-fed-modules

# bun
bun add os-fivem-fed-modyles
```

## Importação

```ts
import { 
    useObserve, 
    Post, 
    Debugger, 
    useListen, 
    useImageValidation, 
    useSound, 
    isEnvBrowser, 
    lazyLoad, 
    sleep 
} from "os-fivem-fed-modules";
```

## Visão geral da API

- Hooks
	- `useObserve<T>(action, handler)` — Observa mensagens NUI (window "message") filtradas por `action`
	- `useListen<T extends Event>(event, handler, target?)` — Observa eventos DOM (ex.: `keydown`, `resize`)
	- `useImageValidation(imageUrl)` — Valida se uma imagem remota pode ser carregada
	- `useSound(src, { volume, loop })` — Controle simples de áudio (play/pause)
- Utilitários
	- `Post.create<T>(eventName, data?, mockData?)` — Faz POST para o backend FiveM, com mock opcional no navegador
	- `Debugger` — Simula eventos NUI no navegador (útil para desenvolvimento local)
	- `isEnvBrowser()` — Detecta se está rodando no navegador (fora do runtime do FiveM)
	- `lazyLoad(loader)` — Lazy load de componentes por nome, usando `React.lazy`
	- `sleep(ms)` — Promise que resolve após um atraso
- Tipos
	- `ObservedMessageType<T> = { action: string; data: T }`
	- `DebuggerEventType = { action: string; data: any }`


## Exemplos rápidos

### 1) Observando mensagens NUI com `useObserve`

```tsx
import { useState } from "react";
import { useObserve } from "os-fivem-fed-modules";

type Data = { open: boolean; userId?: number };

export function App() {
	const [open, setOpen] = useState(false);
	const [userId, setUserId] = useState<number>(0);

	useObserve<Data>("setVisible", (response) => {
		setOpen(response.open);
		if (response.userId) setUserId(response.userId);
	});

    return (
        open && <div>{userId}</div>
    )
}
```

No backend (Lua), um envio típico para a NUI seria algo como:

```lua
SendNUIMessage({ 
    action = 'setVisible', 
    data = { 
        open = true, 
        title = 123 
    } 
})
```


### 2) Enviando eventos para o backend com `Post`

```ts
import { Post } from "os-fivem-fed-modules";

await Post.create("useItem", { id: "water" });

// Durante o desenvolvimento no navegador, você pode passar mockData

type ItemsData = { id: string; amount: number }[]

const result = await Post.create<{ ok: boolean }>(
	"getItems",
	{ filter: "drinks" },
	[
        { id: "water", amount: 10 },
        { id: "juice", amount: 2 }
    ]
);
// Em runtime FiveM: faz fetch para https://<resourceName>/inventory:getItems
// Em navegador: retorna imediatamente mockData (se fornecido)
```

Notas importantes:

- O nome do resource é obtido via `GetParentResourceName()` quando disponível; caso contrário, assume `nui-frame-app`.
- Em caso de erro na requisição, a função lança o erro (catch/try se necessário).


### 3) Simulando mensagens no navegador com `Debugger`

```ts
import { Debugger } from "os-fivem-fed-modules";

new Debugger(
	[
		{ 
            action: "setVisible", 
            data: { 
                open: true, 
                userId: 123     
            } 
        },
		{ 
            action: "addNotify", 
            data: { 
                type: "success", 
                message: "Bem-vindo!" 
            } 
        },
	],
	500
);
```

Em ambiente browser (`isEnvBrowser() === true`) os eventos serão despachados como mensagens `window.postMessage`.


### 4) Ouvindo eventos DOM com `useListen`

```tsx
import { useListen } from "os-fivem-fed-modules";

export function EscToClose({ onClose }: { onClose: () => void }) {
	useListen<KeyboardEvent>("keydown", (event) => {
		if (event.key === "Escape") onClose();
	});

	return null;
}
```


### 5) Validando imagens com `useImageValidation`

```tsx
import { useImageValidation } from "os-fivem-fed-modules";

export function Avatar({ url }: { url: string }) {
	const { isImageValid, imageUrl } = useImageValidation(url);
	
    return isImageValid ? (
		<img 
            src={imageUrl} 
            alt="avatar" 
        />
	) : (
		<div>Imagem inválida</div>
	);
}
```


### 6) Áudio simples com `useSound`

```tsx
import { useSound } from "os-fivem-fed-modules";

export function ClickSound() {
	const { play, pause, isPlaying } = useSound("/sounds/click.ogg", {
		volume: 0.5,
		loop: false,
	});

	return (
		<div>
			<button onClick={play}>Play</button>
			<button onClick={pause} disabled={!isPlaying}>Pause</button>
		</div>
	);
}
```


### 7) Outros utilitários

```ts
import { isEnvBrowser, lazyLoad, sleep, noop } from "os-fivem-fed-modules";

// 1) Ambiente
if (isEnvBrowser()) {
	console.log("Desenvolvendo no navegador");
}

// 2) Lazy load por nome de export
const Components = lazyLoad(() => import("./components"));
// Uso: <Components.MyModal /> irá carregar dinamicamente o export nomeado "MyModal" do módulo

// 3) Sleep
await sleep(300);
```

## Contribuindo

- Faça um fork do repositório
- Crie uma branch: `feat/minha-feature`
- Rode o build localmente e valide os exemplos
- Abra um Pull Request descrevendo a motivação e o escopo

Issues e discussões em: https://github.com/onesourceteam/os-fivem-fed-modules/issues


## Licença

MIT © OneSource — Veja o arquivo `LICENSE` para mais detalhes.

