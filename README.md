# address-parser

A pretty bad and basic parser for excel spreadsheets with names and addresses

## Installation

First, clone or download this repo. Next, navigate to the repo in terminal. Next, run the install script by doing `./install.sh` from termnal. This will install homebrew, nvm, and the correct version of Node.

Next, run `npm install` from the terminal. This will download all necessary Node packages

## Usage

Place all excel spreadsheets in the root of the project and make sure they all have a sheet named `Sheet1` and the data is structured like so:

| Names          | Address                                        |
| -------------- | ---------------------------------------------- |
| Rizzo, Anthony | 1060 W Addison St, Unit 1, Chicago, IL 60613   |
| Cline, Ryan    | 900 John R Wooden Dr, West Lafayette, IN 47906 |

Next, run the script with the following command: `npm run start`

This will attempt to parse the excel spreadhseets in the folder and create new spreadsheets with the parsed data. The new spreadsheets will look like so:

| firstName | lastName | addressLine1         | addressLine2 | city           | state | zip   |
| --------- | -------- | -------------------- | ------------ | -------------- | ----- | ----- |
| Anthony   | Rizzo    | 1060 W Addison St    | Unit1        | Chicago        | IL    | 60613 |
| Ryan      | Cline    | 900 John R Wooden Dr |              | West Lafayette | IN    | 47906 |
