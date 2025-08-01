## O que é o Multiverso?

![Multiverso Logo](./assets/design/icon_heading.png)

**Multiverso** é um aplicativo open source desenvolvido com Electron que traz o poder do Git para artistas, designers, músicos, desenvolvedores e qualquer pessoa que queira gerenciar versões de seus projetos de forma simples e visual.

Nosso objetivo é tornar o controle de versões ACESSÍVEL para qualquer pessoal que usa um computador e pode se beneficiar de um controle de versões, criando um ambiente intuitivo para explorar a linha do tempo dos seus projetos — um verdadeiro “tempo para aprender” a trabalhar com Git sem medo.

## Por que usar o Multiverso?
* **Interface simples e visual**: acompanhe suas versões com commits, branches e histórico de forma clara.
* **Feito para criativos**: busca tornar controle de versão ACESSÍVEL para artistas digitais, músicos, escritores e programadores
* **Open Source**: código aberto, colaborativo e transparente. Faça parte da comunidade e contribua para o projeto!

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

#### Prioridade 1
> Para uso mais básico do app.
* [ ] Estudar mais a fundo
    * [ ] Electron IPC
    * [ ] Importação controlada de funções
* [ ] Pacotes
  * [ ] Criar pacote de instalação
    * [ ] Windows
    * [ ] Linux (Flatpak)
  * [ ] Configurar Auto-update
* [ ] Correção de erros encontrados nos primeiros testes (definição pendente)
* [ ] Refatorar (melhorar qualidade do código)
  * [ ] Pegar feedback em como melhorar o código
  * [ ] CSS
    * [ ] Dividir regras CSS em grupos - separados por comentários visualmente fáceis de ver, separar regras baseado em que partes macro da interface estão sendo feitas
    * [ ] Tentar minimizar o número de regras
  * [ ] JS
    * [ ] Como aprimorar facilidade de testar a lógica JS? Abrindo scripts para o terminal (além do Electron(como?))? Usando algo como Swagger?
    * [ ] FAZER TODAS AS FUNÇÔES FUNCIONAREM NO TERMINAL
      * Fazer isso será complexo, mas estimulará a modularidade, já que cada função terá que ser independente da UI (e das outras, já que serão chamadas isoladamente)
        * Fomentará bons hábitos de desenvolvimento - evoluirá mais da refatoração, do quê do desenvolvimento apressado
      * Separe então, funções que demandarão escrita na memória secundária (Projetos abertos recentemente), daquelas que serão lidadas somente com a abertura da interface (gráfica ou não) do programa (variáveis).
  * [ ] React (reescrever nele para aprender sobre)
      * [ ] Criar componentes "toast" (para contextualizar o usuário sobre o necessário de como o app funciona (como avisar ao trocar de branch, de forma não interruptiva), com time-out, e texto como argumento)

#### Prioridade 2
> Conveniências essenciais
* [ ] Mostrar projetos abertos recentemente
* [ ] Automatizando git
  * [ ] Instalar automaticamente, se não for encontrado
  * [ ] Login opcional (ao abrir o app ele automaticamente se cadastra com o nome do usuário do sistema, se já não houver uma conta)
* [ ] Testar hot-reload em apps como Photoshop (e se é possível implementar do nosso lado, caso já não funcione)
    * [ ] Ou aviso (toast) de que nem todos os apps suportam hot reload

#### Prioridade 3
> Funcões importantes
* [ ] Testar se é possível salvar sem descrição - tornar possível, caso não seja
* [ ] Design Responsivo (deve ser implementado apenas após refatoração, certas partes do código precisam de melhorias)

#### Prioridade 4
> Conveniências - ordem a se determinar por feedback
* [ ] Botão para salvar rápido
* [ ] File manager functions - Funções de renomear, ícones de tipo de arquivo, e opção de selecionar e abrir (e escolher com que app abrir os arquivos)
* [ ] Redesign
  * [ ] Mais contextualização (texto) do app
  * [ ] Gifs mostrando como ele funciona
  * [ ] Mais minimalista, menos cores sólidas
  * [ ] Mais temático (remetendo mais à multiverso)

#### Ideias
> Ideias interessantes que só são realistas e viáveis (e portanto, a serem desenvolvidas) dependendo do feedback dos usuários.
* [ ] Cloud backup (Monetizar? Ótimo para praticar server/back-end (notas de estudo em /Dies Novas/Eisenhower))
  * [ ] Sistema de conta
  * [ ] Sistema de pagamento
  * [ ] Cloud service para backup dos projetos importantes (usar NextCloud com implementação própria?)

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