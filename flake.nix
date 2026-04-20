# Nix will handle System dependencies only
# NPM runs the rest

# Enclosed in {} because it's an attribute set
# Nix is a lazy language (opposed to eager evaluation)
#   Meaning it doesn't calculates expressions until it needs the output
#   It only stores how to calculate it
#   ...Otherwise it would evaluate every package definition on Linux
#   But it instead limits itself to packages you're actually using
{
  # 'inputs' is an attribute (key) containing a nested attribute set.
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  # 'outputs' is a function. Nix calls this function and passes the 
  # resolved inputs as an argument.
  outputs = { self, nixpkgs, utils }:
    # 'utils.lib.eachDefaultSystem' is a helper function that iterates 
    # over x86_64-linux, aarch64-darwin, etc., so you don't have to manualy define them.
    utils.lib.eachDefaultSystem (system:
      # 'let ... in' defines local variables (bindings). 
      # They are immutable and only visible within the 'in' block.
      let
        # 'pkgs' is an object created by calling the nixpkgs function.
        # Basically importing something, as you would in OOP languages
        pkgs = import nixpkgs {
          inherit system; # 'inherit' is shorthand for system = system;
          config.allowUnfree = true;
        };

        # 'electronDeps' imports your external file. 
        # In Nix, 'import' reads a file and immediately evaluates it.
        electronDeps = import ./nix/electron-deps.nix { inherit pkgs; };
        checkScript = import ./nix/project-deps.nix { inherit pkgs; };
      in
      # The 'in' block must return a value. Here, it returns an attribute set.
      {
        # 'devShells' is the standard attribute Nix looks for when you run 'nix develop'.
        # 'default' is the specific shell used when no name is provided.
        devShells.default = pkgs.mkShell {
          # 'mkShell' is a function that returns a special derivation (build instruction).
          
          buildInputs = with pkgs; [
            nodejs_20
            yarn
            git
            checkScript
          ] ++ electronDeps; # '++' is the list concatenation operator.

          # 'shellHook' is a plain string. Bash executes this when the shell starts.
            shellHook = ''
                # Force the local node_modules binaries to the front of the PATH
                # This is the most important line for fixing "vite: command not found"
                export PATH="$PWD/node_modules/.bin:$PATH"

                # Map system libraries for Electron
                export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath electronDeps}:$LD_LIBRARY_PATH
                
                # Execute your automated npm installer
                project-deps-install

                # Standardize the prompt
                export PS1="\n\[\033[1;32m\](nix-shell) \[\033[1;34m\]\w\[\033[0m\]\$ "
                
                echo "⚡ Electron/React Nix Environment Active"
            '';
        };
      });
}