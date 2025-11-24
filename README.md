## O que é o Multiverso?
> ...

![Multiverso Logo](./assets/design/icon_heading.png)

**Multiverso** é um aplicativo open source desenvolvido com Electron que traz o poder do Git para artistas, designers, músicos, desenvolvedores e qualquer pessoa que queira gerenciar versões de seus projetos de forma simples e visual.

Nosso objetivo é tornar o controle de versões ACESSÍVEL para qualquer pessoal que usa um computador e pode se beneficiar de um controle de versões, criando um ambiente intuitivo para explorar a linha do tempo dos seus projetos — um verdadeiro “tempo para aprender” a trabalhar com Git sem medo.

## Por que usar o Multiverso?
* **Interface simples e visual**: acompanhe suas versões com commits, branches e histórico de forma clara.
* **Feito para criativos**: busca tornar controle de versão ACESSÍVEL para artistas digitais, músicos, escritores e programadores
* **Open Source**: código aberto, colaborativo e transparente. Faça parte da comunidade e contribua para o projeto!

## Suporte
* Atualmente o foco / suporte oficial é para Windows 10/11 e Linux (Fedora).

## Como usar

1. Baixe um release ou compile
2. Abra o programa
3. O resto é auto explicatório (espero)
    * Se não for... basicamente ele vai abrir a pasta que você selecionar, criar um repositório git, e você vai poder manejar diferentes versões sem ter que aprender nada sobre git (a ideia é abstrair)
4. Crie e troque branches, reverta commits... quebre a linha do tempo do seus arquivos/designs/vídeos...rs viaje pelo multiverso...

## Instalação

Você pode compilar e rodar localmente, ou aguardar pelas futuras releases no GitHub.

```bash
git clone https://github.com/jcesarap/multiverso.git
cd multiverso
npm install
npx electron-forge import
npm start                   # Ou       npm run make       para compilar instalador
```

## Backlog
> Estamos no MVP, ainda pesquisando e testando para mais estabilidade. Falando em pesquisa, as próximas funções serão escolhidas baseadas em feedback, mas aqui estão algumas que pensamos:

#### REFATORAÇÃO
* DYNAMIC CODE              From Linux scripts
    1. ANTI-STATIC          - DON'T USE STRINGS.
    2. DYNAMIC VARIABLES    - USE VARIABLES THAT CALCULATE THEIR OWN VALUES, WHEN THEY'RE DYNAMIC OR SYSTEM/CONTEXT/INPUT SPECIFIC.
    3. WUF                  - WHOLLY UNI-SEMANTIC FUNCTIONS. FUNCTIONS DO SOMETHING, AND NOTHING ELSE BESIDES THAT.
    4. COMMON               - Certain modules (variables also, not just functions) should be common to all others, other files and functions.

#### Prioridade 1
> Para uso mais básico do app     (**Use Sküþratt durante toda a refatoração**)
* [ ] Refatoração
    * [ ] Pegue feedback DO CÓDIGO (e inclua aqui sugestões do que pode/deve melhorar)
    * [ ] Regras CSS podem ser "sourced" - se não diretamente, através de JS?
    * [ ] Re-design
      * [ ] Para mais minimalismo e clareza
      * [ ] Incluindo componentes reutilizáveis
    * [ ] State-management Centralizado (crie um único objeto ou módulo JS para guardar todos os estados da aplicação)
        * [ ] Aqui você maneja elementos selecionados - assim como sua deseleção ao sair de certas páginas
    * [ ] Event-driven (`event-handlers.js`)
        * [ ] Single file for managing all component-to-action bindings, which is imported to every page
    * [ ] DOM Utilities module
    * [ ] UI components (crie elementos reutilizáveis)
        * [ ] Tips, Warnings and errors Component (custom component, at an absolute position, stacking with others as they're generated)
        * [ ] Guides (components with media, title, description, skip, next and previous... *WOULD THESE BE OBJECTS???*)
    * [ ] Error-handling
        * [ ] Crie um logfile dedicado para isso (que comunica erros para o usuário, assim como para você) (centralizando erros de js da página, assim como do nodejs)
    * [ ] Constantes (`constants.js`)
        * [ ] Importe esses objetos
        * [ ] Objeto que relaciona páginas com seus endereços, permitindo mudar o nome delas num único lugar, para todo o código
    * [ ] Estruturação
        * [ ] Melhor separação de preocupações,, render_xxx functions and helper-functions
        * E.g., fetch_xxx, parse_xxx, render_xxx
    * [ ] CSS
        * [ ] Dividir regras CSS em grupos (e regras em WHERE e STYLE) - separados por comentários visualmente fáceis de ver, separar regras baseado em que partes macro da interface estão sendo feitas
        * [ ] Tentar minimizar o número de regras - sem forçar (código que fica em partes diferentes da tela, precisa de regras diferentes)
    * [ ] JS
        * [ ] Como aprimorar facilidade de testar a lógica JS? Abrindo scripts para o terminal (além do Electron(como?))? Usando algo como Swagger?
        * [ ] FAZER TODAS AS FUNÇÔES FUNCIONAREM NO TERMINAL
          * Fazer isso será complexo, mas estimulará a modularidade, já que cada função terá que ser independente da UI (e das outras, já que serão chamadas isoladamente)
            * Fomentará bons hábitos de desenvolvimento - evoluirá mais da refatoração, do quê do desenvolvimento apressado
          * Separe então, funções que demandarão escrita na memória secundária (Projetos abertos recentemente), daquelas que serão lidadas somente com a abertura da interface (gráfica ou não) do programa (variáveis).
    * [ ] Ajustes
        * [ ] Caminho de imagens transformados em constantes
          * [ ] Atualize eles de `/src/design/` para `/src/images/`
* [ ] Documentar: Parameter can be made optional by giving it a default value
* [ ] Documentar feedback do vídeo - aqui
* [ ] Estudar mais a fundo
    * [ ] Electron IPC
    * [ ] Importação controlada de funções
* [ ] Pacotes
  * [ ] Criar pacote de instalação
    * [ ] Windows
    * [ ] Linux (Flatpak)
  * [ ] Configurar Auto-update
* [ ] Refatorar para React (reescrever nele para aprender sobre)

#### Prioridade 2
> Conveniências essenciais
* [x] Mostrar projetos abertos recentemente
    * [ ] Adição posterior: Remover caminho selecionado, quando não encontrado
* [x] Automatizando git
  * [x] Instalar automaticamente, se não for encontrado
  * [x] Login opcional (ao abrir o app ele automaticamente se cadastra com o nome do usuário do sistema, se já não houver uma conta)
* [ ] Testar hot-reload em apps como Photoshop (e se é possível implementar do nosso lado, caso já não funcione)
    * [ ] Ou aviso (toast) de que nem todos os apps suportam hot reload

#### Prioridade 3
> Funcões importantes
* [ ] Testar se é possível salvar sem descrição - tornar possível, caso não seja
* [ ] Design Responsivo (deve ser implementado apenas após refatoração, certas partes do código precisam de melhorias)
* [ ] Button to open file manager in that directory

#### Prioridade 4
> Conveniências - ordem a se determinar por feedback
* [ ] Botão para salvar rápido
* [ ] File manager functions - Funções de renomear, ícones de tipo de arquivo, e opção de selecionar e abrir (e escolher com que app abrir os arquivos)
* [ ] Redesign
  * [ ] Mais contextualização (texto) do app
  * [ ] Gifs mostrando como ele funciona
  * [ ] Mais minimalista, menos cores sólidas
  * [ ] Mais temático (remetendo mais à multiverso)
* [ ] ***COLABORATION VIA P2P - TO PAVE THE WAY FOR P2P SOCIAL NETWORK***

#### Ideias
> Ideias interessantes que só são realistas e viáveis (e portanto, a serem desenvolvidas) dependendo do feedback dos usuários.
* [ ] Colaboration (What tools can be used? Just Git fetch?)
* [ ] Cloud backup (Monetizar? Ótimo para praticar server/back-end (notas de estudo em /Dies Novas/Eisenhower))
  * [ ] Sistema de conta
  * [ ] Sistema de pagamento
  * [ ] Cloud service para backup dos projetos importantes (usar NextCloud com implementação própria?)
* [ ] Empactar instalador git junto com app (para suporte em múltiplos sistemas)?

---

## Contribuindo
Contribuições são muito bem-vindas!
* Relate bugs e problemas
* Proponha melhorias via pull requests
* Ajude na documentação ou traduções
* Compartilhe feedbacks para melhorar a usabilidade
* Pode enviar e-mails para: cesar.amoraes05@aluno.ifce.edu.br

## Licença

* O Multiverso é um software livre licenciado sob a **GNU General Public License (GPL) versão 3**.
* Isso significa que você pode usar, modificar e distribuir o software livremente, desde que quaisquer versões modificadas também sejam distribuídas sob a mesma licença, garantindo que o código permaneça aberto para toda a comunidade.
* Para mais detalhes, consulte: [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

## Comunidade
* ...Pendente
