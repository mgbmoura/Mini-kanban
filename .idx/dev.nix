# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # MUDANÇA CRÍTICA: Mudar para o canal instável para obter versões de pacotes mais recentes.
  # Isto é necessário porque o Vite e suas dependências exigem uma versão do Node.js > 20.19.0.
  channel = "unstable"; 

  # Pacotes necessários para o seu Mini-Kanban
  packages = [
    pkgs.nodejs_20 # Agora, isto irá instalar uma versão mais recente do Node.js
    pkgs.nodePackages."@nestjs/cli"
    pkgs.docker
    pkgs.docker-compose
    pkgs.postgresql # Mantido para ferramentas de linha de comando do Prisma
    pkgs.tree 
    pkgs.sudo
  ];

  # Habilita o serviço Docker dentro do IDX
  services.docker.enable = true;

  # Variáveis de ambiente
  env = { };

  idx = {
    # Extensões úteis para o seu desenvolvimento
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];

    workspace = {
      # Roda apenas na criação do Workspace
      onCreate = {
        # Instala as dependências na pasta api para garantir o intellisense do VS Code
        api-install = "cd api && npm install";
        # Instala as dependências na pasta web (frontend)
        web-install = "cd web && npm install";
      };

      # A MÁGICA DA AUTOMAÇÃO: Roda toda vez que o IDX inicia
      onStart = {
        # Sobe o Banco e a API dentro do Docker automaticamente
        # O -d (detached) faz rodar em segundo plano
        start-containers = "docker-compose up -d";
        # Inicia o servidor de desenvolvimento do frontend
        start-web = "cd web && npm run dev -- --port $PORT";
      };
    };

    # Configuração de Previews
    previews = {
      enable = false;
      previews = {
        # Visualização da API (Backend)
        # Como o Docker já está rodando a API na porta 3000, 
        # usamos um comando simples para manter o preview ativo no Swagger
        api = {
          command = [ "tail" "-f" "/dev/null" ]; # Comando que não faz nada, apenas mantém a porta 3000 mapeada
          manager = "web";
          env = {
            PORT = "3000"; 
          };
        };
        # Visualização do Frontend
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" ];
          manager = "web";
        };
      };
    };
  };
}
