# Aula: criando agentes de IA com OpenCode

Para acompanhar a aula passo a passo, abra [`index.html`](index.html) no navegador. O guia interativo inclui comandos copiáveis, explicações da estrutura e checklist de progresso.

Cada grupo vai instalar o OpenCode, configurar a chave do grupo e criar seus próprios agentes em arquivos `.md`.
Modelo usado por todos: **GPT-6 Luna** (`openai/gpt-6-luna`), escolhido por ser barato e dar para fazer muitas interações.

## 1. Pré-requisitos

- Node.js 18 ou mais novo (`node -v` para conferir). Baixe em https://nodejs.org se não tiver.
- Java 17+ e Maven, se o grupo for rodar o back-end.
- A **chave de API do grupo** (o professor entrega uma por grupo).

## 2. Instalar o OpenCode

Escolha **uma** opção:

```bash
# Qualquer sistema, com Node
npm install -g opencode-ai

# macOS / Linux
curl -fsSL https://opencode.ai/install | bash
```

Confira com `opencode --version`.

## 3. Copiar o kit para o projeto do grupo

Copie para a **raiz do projeto** do grupo estes itens:

```
opencode.json
.opencode/oh-my-opencode-slim.json
agentes/
.gitignore         (junte com o que já existe)
.env.example
```

- `opencode.json` fixa o modelo Luna em tudo e registra o agente `agent_front`.
- `.opencode/oh-my-opencode-slim.json` faz os subagentes da biblioteca também usarem o Luna.
- `agentes/` guarda os `.md` dos agentes.

## 4. Instalar a biblioteca de agentes (oh-my-opencode-slim)

Dentro da pasta do projeto:

```bash
npx oh-my-opencode-slim@latest install
```

Se o instalador perguntar sobre provedores, escolha **OpenAI**. As escolhas dele não importam: o arquivo `.opencode/oh-my-opencode-slim.json` do projeto tem prioridade e deixa tudo no Luna.

## 5. Colocar a chave do grupo

```bash
opencode auth login
```

Escolha **OpenAI** e cole a chave do grupo (a que começa com `sk-`).

Regras da chave:

- É do **grupo**. Não passe para outros grupos nem poste em chat.
- Se usar o arquivo `.env`, ele já está no `.gitignore`. Confira com `git status` antes de enviar qualquer coisa.
- Ela tem limite de gasto. Se acabar, avise o professor.

## 6. Abrir e testar

```bash
opencode
```

No rodapé deve aparecer **GPT-6 Luna**. Se aparecer outro modelo, digite `/models` e escolha `GPT-6 Luna`.

Teste com: `analise a stack do projeto`. Não pode dar erro de "does not have access to model".

## 7. Criar o seu agente

1. Copie `agentes/_modelo_agente.md` para `agentes/agent_<nome>.md`, por exemplo `agentes/agent_java.md`.
2. Preencha as seções: quem é o agente, objetivo, regras e como trabalhar.
3. Reabra o OpenCode. **Não precisa registrar nada.**

O `opencode.json` tem a linha `"instructions": ["agentes/agent_*.md"]`. Ela faz o OpenCode carregar todo arquivo `agentes/agent_*.md` no início de cada conversa, e os subagentes também recebem esse conteúdo. Ou seja, as regras que você escreveu são sempre consultadas, sem você chamar o agente.

Para conferir: pergunte `quais regras do agent_front você está seguindo?`. Ele deve repetir o que está no seu `.md`.

Cuidados:
- Os arquivos são texto puro, **sem** cabeçalho `---`.
- O conteúdo é enviado a cada mensagem. Mantenha cada arquivo curto (até uns 30 linhas) para gastar pouco.
- O nome do arquivo precisa começar com `agent_`. O `_modelo_agente.md` é ignorado de propósito.
- Se duas regras se contradizem, o modelo escolhe uma. Revise para não haver conflito.

## 8. Dicas para gastar pouco

- Peça tarefas pequenas e específicas. "Crie o formulário de cadastro" gasta menos que "faça o sistema todo".
- Diga no `.md` do agente quais pastas ele pode ler.
- Continue a mesma conversa em vez de abrir várias novas: o contexto repetido sai mais barato.
- Não mude o `variant` para `high`, `xhigh` ou `max` sem falar com o professor.

## 9. Problemas comuns

| Erro | Solução |
|---|---|
| `does not have access to model gpt-5.5` | O OpenCode está usando um modelo padrão. Confira se `opencode.json` está na raiz do projeto, e use `/models` para escolher o Luna. |
| `does not have access to model gpt-6-luna` | Avise o professor: o projeto da chave precisa liberar esse modelo. |
| O OpenCode ignora as regras do agente | Confira se o arquivo está em `agentes/`, se o nome começa com `agent_` e se o `opencode.json` está na raiz do projeto. |
| `command not found: opencode` | Feche e abra o terminal. Se continuar, reinstale. |
