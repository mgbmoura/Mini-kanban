{ pkgs, ... }: {
  channel = "unstable"; 

  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.docker
    pkgs.docker-compose
    pkgs.postgresql
    pkgs.tree 
    pkgs.sudo
  ];

  services.docker.enable = true;

  env = { };

  idx = {
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];

    # workspace = {
    #   onCreate = {
    #     api-install = "cd api && pnpm install";
    #     web-install = "cd web && pnpm install";
    #   };

    #   onStart = {
    #     # Apenas sobe os contentores existentes de forma leve, sem conflitos
    #     start-containers = "docker-compose up -d"; 
    #   };
    # };

    previews = {
      # Desligamos as previews complexas do IDX para deixar o Docker controlar tudo
      enable = true;
    };
  };
}