#!/bin/zsh

## Install homebrew

echo "Installing Homebrew...";

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)";

echo "Removing previous Node install...";

brew uninstall --ignore-dependencies node;

echo "Installing NVM...";

brew update;

brew install nvm;

mkdir ~/.nvm;

export NVM_DIR=$HOME/.nvm;

source $NVM_DIR/nvm.sh;

touch ~/.zshrc && echo "export NVM_DIR=~/.nvm \n source $(brew --prefix nvm)/nvm.sh" > ~/.zshrc && source ~/.zshrc;

echo "Installing Node...";

nvm install 20;

nvm use 20;