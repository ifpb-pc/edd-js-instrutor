# Modelo de Execução do JavaScript — Material Didático

## 1. Visão Geral: 

* JavaScript não é apenas “um arquivo que roda linha a linha”. Por trás dele, existe um **runtime** (ambiente de execução) — composto por várias partes — que coordenam **memória**, **fluxo de execução**, **tarefas assíncronas**, etc. ([MDN Web Docs][1])
* Esse runtime geralmente é fornecido por duas coisas trabalhando juntas: a “engine de JavaScript” (que interpreta/compila o código JS) + o “host environment” (por exemplo, um navegador, ou no servidor, o Node.js). ([MDN Web Docs][1])
* O modelo de execução do JavaScript define **quando** e **como** o código roda, será finalizado, e como tarefas “assíncronas” interagem com código “sincrono”.

---

## 2. Componentes principais do runtime JS

Dentro de um runtime JS (um “agent” na especificação), existem três estruturas principais (e conceituais) para gerir a execução. ([MDN Web Docs][1])

| Estrutura                                           | Função / Papel                                                                                                                                                                                                                                      |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack (call stack)**                              | Onde são empilhados os contextos de execução (funções chamadas, variáveis locais, etc). Quando uma função é chamada, um “frame” é empilhado; quando retorna, esse frame é removido. ([MDN Web Docs][2])                                             |
| **Heap (memory heap)**                              | Região de memória onde objetos, arrays, funções, closures, etc — dados dinâmicos — são alocados. ([MDN Web Docs][1])                                                                                                                                |
| **Queue (job queue / message queue / event queue)** | Fila de “jobs” ou “tarefas” que aguardam execução — geralmente associadas a eventos assíncronos, timers, callbacks, promessas resolvidas etc. Quando a stack está vazia, o runtime pega a próxima mensagem da fila e a executa. ([MDN Web Docs][3]) |

Além disso, existe o **“event loop” (laço de eventos)** — que coordena essa transferência entre queue e stack: sempre que a stack estiver vazia, o event loop busca a próxima tarefa da fila e a executa. ([MDN Web Docs][2])

---

## 3. Fluxo de Execução: como o JS executa código

### 3.1 Execução síncrona (call stack)

* Quando um código JS é executado (por exemplo, um script principal, ou dentro de uma função), o runtime cria um contexto e empilha na stack. ([MDN Web Docs][1])
* Cada função chamada empilha um novo “frame”. Quando a função retorna, o frame é removido. Isso segue a lógica LIFO (Last In, First Out). ([MDN Web Docs][2])
* Variáveis locais, contexto de execução, “this”, escopo de variáveis — tudo pertence a esse contexto. ([MDN Web Docs][3])

### 3.2 Alocação dinâmica: heap e objetos

* Objetos criados dinamicamente (arrays, objetos literais, funções que retornam objetos, closures, etc.) são alocados no heap. Isso permite que estruturas complexas vivam além da chamada da função. ([MDN Web Docs][1])
* A stack gerencia “quem está executando agora”, a heap gerencia **o que existe em memória** — o estado do programa.

### 3.3 Execução assíncrona — event loop, queue e jobs

* JavaScript opera com um modelo de concorrência baseado em **event loop**. Ou seja: mesmo sendo “single‑threaded” (uma “thread” de execução), ele consegue lidar com operações assíncronas sem bloquear a thread principal. ([MDN Web Docs][2])
* Quando funções assíncronas, callbacks (como de `setTimeout`, eventos DOM, Promises, etc.) são invocados — elas não são executadas imediatamente. Em vez disso, o callback é “agendado”: é colocada uma mensagem/job na **queue**. ([devdoc.net][4])
* O event loop monitora essa queue: quando a stack estiver vazia (ou seja, depois de terminar o código em execução), o loop retira o próximo job da fila e o coloca na stack para execução. ([MDN Web Docs][3])
* Esse modelo é conhecido como **“run‑to‑completion”**: cada job é processado completamente antes que outro job comece. Isso evita interleaving dentro de uma única tarefa e ajuda a garantir previsibilidade. ([MDN Web Docs][2])
* Resultado: mesmo que seu código execute operações demoradas (timer, I/O, eventos, promessas), a interface/vida útil da aplicação (interface, manipulação de eventos) não fica “travada”. ([MDN Web Docs][2])

---

## 4. Exemplo Prático — passo a passo

Considere este trecho de código:

```js
console.log('Início');

setTimeout(function callback() {
  console.log('Callback executado');
}, 0);

console.log('Fim');
```

**Como será executado:**

1. O script principal começa — imprime `"Início"`; esse log é síncrono, empilhado na stack, executado, e desempilha.
2. `setTimeout(...)` é chamado — não agenda imediatamente a execução do callback, mas registra o callback para futuro; internamente, o browser (ou environment) agenda esse callback para ser colocado na fila após pelo menos 0 ms + quando a stack estiver livre.
3. Continua: imprime `"Fim"` — também síncrono.
4. Quando a stack estiver vazia, o event loop verifica a fila de mensagens. O callback do `setTimeout` espera lá; então ele será retirado da fila e empilhado na stack.
5. O callback roda: imprime `"Callback executado"`; então a stack é desempilhada.
6. Fim — não há mais nada a executar.

Mesmo com “delay 0”, o callback não executa “antes” do restante do código síncrono — porque a queue + event loop garantem a ordem. Esse comportamento se repete para Promises, eventos DOM, requisições assíncronas, etc.

---

## 5. Conceitos Importantes — o que entender bem

* **Single-threaded, mas não bloqueante**: embora haja apenas uma “thread de execução” no JS, o modelo de execução + event loop permite que operações assíncronas não travem a execução principal. ([MDN Web Docs][2])
* **Run-to-completion**: cada “job” é executado até o fim antes de outro começar — evita condições de concorrência interna ao JS (por tarefa). ([devdoc.net][4])
* **Heap vs Stack**: stack para controle de execução, heap para armazenar dados dinâmicos (objetos, closures, etc). Entender essa separação ajuda a pensar sobre memória, escopo e closures. ([MDN Web Docs][1])
* **Host & Engine**: JS puro (a linguagem/engine) não sabe sobre DOM, timers, I/O — essas responsabilidades ficam com o “host environment” (navegador, Node, etc). O runtime combina os dois. ([MDN Web Docs][1])

---

## 6. Por que isso importa (para quem programa JS)

* Entender o modelo de execução ajuda a **escrever código assíncrono corretamente** — saber quando algo vai rodar, e como evitar efeitos de “race conditions” ou “bloqueios”.
* Ajuda a **diagnosticar problemas de performance** — por exemplo: loops longos dentro de um job podem congelar a interface (porque o event loop só roda depois de completar o job).
* Ajuda a **estruturar aplicações complexas**, com muitos callbacks, promessas, eventos — evitando “callback hell”, problemas de escopo/closures, vazamentos de memória etc.
* Permite usar corretamente *async/await*, Promises, setTimeout, I/O assíncrono, Web APIs, com consciência de como o JS vai orquestrar tudo “por baixo dos panos”.

---

## 7. Exercícios e Atividades Sugeridas (para fixar a teoria)

1. Escreva um programa com `console.log`, `setTimeout`, e uma função síncrona — e antecipe a ordem de saída no console. Depois execute e verifique.
2. Crie um exemplo que manipule objetos/dados no heap e funções com closures — e analise quando a memória é alocada e liberada (ou quando referências permanecem vivas).
3. Experimente encadear Promises com `.then()` e observar a fila de microtasks / tasks — veja como o event loop lida com isso.
4. Compare um loop “pesado” síncrono com uma versão fragmentada usando timers ou `requestAnimationFrame`, para entender impacto sobre interface / responsividade.
5. Documente, em um diagrama, como stack, heap e queue interagem — visualize um “snapshot” do runtime antes, durante e depois de callbacks.

---

## 8. Conclusão / Recapitulação

O modelo de execução do JavaScript é o **modelo fundamental** que explica por que JS, mesmo sendo “single-threaded”, consegue lidar bem com tarefas assíncronas, I/O, eventos e interatividade — tudo isso sem travar a interface.

Compreender as estruturas de **stack**, **heap**, **queue**, e a lógica do **event loop**, além da distinção entre engine e host, permite que desenvolvedores escrevam código mais previsível, performático, limpo e evitar erros sutis de concorrência ou escopo.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model.com "JavaScript execution model - JavaScript | MDN"
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop?utm_source=chatgpt.com "JavaScript execution model - JavaScript | MDN"
[3]: https://devdoc.net/web/developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop.html?utm_source=chatgpt.com "Concurrency model and Event Loop - JavaScript | MDN"


https://medium.com/reactbrasil/como-o-javascript-funciona-o-event-loop-e-o-surgimento-da-programa%C3%A7%C3%A3o-ass%C3%ADncrona-5-maneiras-de-18d0b8d6849a
