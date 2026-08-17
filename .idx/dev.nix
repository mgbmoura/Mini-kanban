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

    previews = {
      enable = true;
      previews.web = {
        command = [
          "pnpm"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        cwd = "web";
        manager = "web";
      };
    };
  };
}
