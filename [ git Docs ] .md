# Introdução
> Não vou ser técnico e preciso na linguagem ou nomemclatura - tem muita gente que ensina git explicando o funcionamento dele e com a nomemclatura dele, mas acho que dificulta no começo. Como muita gente joga vou explicar assim.
- Git é uma ferramenta para você criar checkpoints, saves, diferentes versões do seu código e lógica.
- GitHub é um site - entre vários - "baseado" no git para armazenar e compartilhar código - o modo multi-jogador/online do git.
- Com os dois juntos, cada "jogador"/programador pode pode tentar finalizar o jogo (terminar o código) lutando contra chefes diferentes ao mesmo tempo (funções que compõem o que precisa pro código).
- Cada chefe que você for enfrentar, você cria um galho, uma ramificação, uma `branch` - que significa exatamente isso em inglês.
- Onde houver `<nome>`, digite o dado que quer, sem colocar `<>`.
- Você vai precisar instalar Git and GitHub para que tudo isso funcione, para isso, no Fedora Linux os comandos é `sudo dnf install 'dnf-command(config-manager)' -y && sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo && sudo dnf install -y gh git`

# Comandos de "Novo Jogo"
- Para iniciar o git, ele precisa saber que pasta você quer que ele faça os diferentes saves e ramificações. Para isso, abra o terminal, vá até a pasta que tiver seu código e digite `git init`
- Antes de criar seu primeiro save, você precisa "colocar os arquivos no seu inventário". `git add .` Por enquanto, sempre use esse comando, que irá selecionar tudo que você modificou desde a última vez que salvou - que não aconteceu ainda.
- Assim como num jogo, você não vai salvar a todo momento... somente quando terminar algo importante. Digite `git commit -am ""` para salvar, e dentro das aspas *SEMPRE* coloque uma curta descrição do quê você fez.

# Comandos para "Carregar um jogo"
> Comandos que envolvem ramificações é interessante deixar para entender somente depois de mexer com os outros - e talvez não sejam necessários agora.
- Se quiser pegar a pasta com código de alguém que estiver trabalhando, ou o seu próprio, se tiver em outro computador, digite `git clone <link>` e depois de `clone` dê um espaço e digite o link do projeto no GitHub. Isso vai baixar na pasta que o terminal tiver, a pasta com o código.
- Se quiser criar uma nova ramificação, digite `git branch <nome>` e o nome que vai dar para a ramificação - que tem que ser algo que descreve o que vai fazer.
- Para mover entre ramificações, digite `git checkout <nome>` e o nome da ramificação para qual deseja ir. Também é possível listar o nome das que existem... só procurar no Google, é um bom hábito (eu esqueci).
> Toda modificação que fizer em ramificações diferentes, fica nela. Quando trocar a ramificação, todos seus arquivos na pasta vão mudar, como se tivesse viajado no tempo ou trocado a pasta - isso, claro, depois de selecionar o inventário do que quer mudar, e fazer um save naquela ramificação.

# GitHub
## Login
#### Gere um Token de Login
#### Vá no terminal para colar seu token
gh auth login
GitHub.com Enter
HTTPS Enter
Paste an authentication token (ou "Cole token de autenticação", não sei se traduziram - é o token que você gerou)
## Comandos
- Para usar o GitHub, além de fazer uma conta, você precisa criar um projeto lá, que pode ser o mesmo nome da pasta (pra que você possa encontrar essa pasta lá no site). Pra fazer isso, o comando `gh repo create <nome> --public --push --source=`.
- Se você quiser não só baixar o código do GitHub, mas também conseguir enviar o código pra lá - e quem tiver trabalhando contigo poder usar seu código -, digite `git remote add origin <link>`. Isso vai baixar o código de lá, sabendo que é de lá, o que vai facilitar alguns comandos.
- Depois de selecionar os arquivos que quer salvar, fazer o save/checkpoint, você tem que enviar isso para o servidor, para que outras pessoas possam usar/testar... para isso digite `git push -u origin main` - e sempre observe se o terminal está na pasta que iniciou o projeto no git, ou baixou usando esses comandos, caso contrário o git não vai reconhecer a pasta, e vai dá erro.
- Fez várias merdas e não sabe mais onde errou??? Digite `git pull origin main` para baixar o código do servidor de novo, apagando o que tiver feito, voltando para o checkpoint.

# Voltando para saves antigos
- Digite `git log` e pegue o código da versão que quer ver.
- Digite `git checkout <código>` e toda a pasta voltará para como estava.
- Digite `git branch master` para voltar para onde estava antes... ou...

# 1. Check out the commit you want to replicate
git checkout <old-commit-hash>

# 2. Create a new branch to hold this state
git switch -c temp-restore

# 3. (Optional) Edit files if needed, then commit
# If nothing changed yet, make a no-op commit to preserve the snapshot
git commit --allow-empty -m "Restore full state of <old-commit>"

# 4. Switch to the branch where you want the changes applied (e.g. master)
git checkout master

# 5. Merge the restored state
git merge --strategy=ours temp-restore

# 6. Push
git push

# Interface
- Existem programas que cuidam da interface gráfica do Git, mas é preciso aprender a lógica, porque é muito fácil fazer merda quando consegue tomar decisão sem tempo pra pensar, e os comandos dão esse tempo, e te impedem de fazer algo completamente alheio à lógica.