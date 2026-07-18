
# Screenshots

| ![[Screenshot from 2026-07-18 08-53-07.png]] | ![[Screenshot from 2026-07-18 08-53-30.png]] |
| -------------------------------------------- | -------------------------------------------- |

## O que é o Multiverso?

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

# MACROS
Include: home.html main.js new-branch.html README.md save.html oopPractise.js delete.html edit.html index.html preload.js src/js/renderer.js src/js/ui.js src/js/git.js src/css/new-version.css src/css/history.css src/css/edit.css src/css/index.css src/css/home.css src/css/save.css src/css/delete.css history.html create-installer.js 
