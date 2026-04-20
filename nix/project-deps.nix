{ pkgs }:

let
  npmPrograms = [
    "react"
    "react-dom"
    "electron"
    "vite"
    "concurrently"
    "wait-on"
  ];

  programList = pkgs.lib.concatStringsSep " " npmPrograms;
in
# This first string "project-deps-install" is what creates the command name
pkgs.writeShellScriptBin "project-deps-install" ''
  echo "Checking project dependencies: ${programList}"
  npm install ${programList} --no-audit --no-fund
''