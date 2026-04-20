{ pkgs }:

let
  # Define your choosing of npm dependencies here
  dependencies = [
    "react"
    "react-dom"
    "vite"
    "electron"
    "concurrently"
    "wait-on"
  ];
  
  # Convert the Nix list into a space-separated string for Bash
  depString = pkgs.lib.concatStringsSep " " dependencies;
in
pkgs.writeShellScriptBin "install-npm-deps" ''
  echo "Checking npm dependencies: ${depString}"
  
  # We use --no-save if you don't want to modify package.json, 
  # but usually, you want them synchronized.
  npm install ${depString}
''