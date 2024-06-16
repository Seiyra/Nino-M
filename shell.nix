{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.typescript
    pkgs.ffmpeg
    pkgs.imagemagick
    pkgs.git
    pkgs.neofetch
    pkgs.libwebp
    pkgs.speedtest-cli
    pkgs.wget
    pkgs.yarn
    pkgs.util-linux
  ];

  shellHook = ''
    export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath [ pkgs.util-linux ]}
  '';
}
