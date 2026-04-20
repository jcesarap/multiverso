# WSL
---
* `cd /mnt/c/Users/blue/Documents`

# NIX
---
```bash
# INSTALL NIX (SINGLE USER)
# === WINDOWS
# sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install) --no-daemon
# === Linux
sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install) --no-daemon
# ENABLE FLAKES
mkdir -p ~/.config/nix
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
nix flake --help > /dev/null && echo "✅ Flakes are now enabled!" || echo "❌ Setup failed."
# Download
nix flake update --refresh # If it says the git tree is dirty, it just means that there are uncommitted changes
# Run: nix develop
```