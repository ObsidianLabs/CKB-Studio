# CKB-Studio

CKB Studio is an IDE to develop CKB scripts for [Nervos](http://nervos.io/) blockchain. It includes CKB compiler, block explorer, node and miner for local dev chain, Aggron testnet and the CKB mainnet. The TX Constructor provides a convenient tool to generate from regular transfer to UDT and anyone-can-pay transactions.

![](assets/screenshots/main.png)


## Installation

### Download
Installation packages are provided in [releases](https://github.com/ObsidianLabs/CKB-Studio/releases). Please select the appropriate format according to your operating system (.dmg or .zip for Mac OS, .AppImage for Linux).

### Install

- **MacOS**: Double-click to open `CKBStudio-x.x.x.dmg` and drag *CKB Studio* into the *Applications* folder.
- **Linux**: Right-click `CKBStudio-x.x.x.AppImage`, select *Properties* => *Permissions* => *Execute*, and check the option *Allow executing file as progrom*. Close the property window and double-click the application to open it (different Linux systems may have slightly different installation procedures).

## Feature Walkthrough

### Install Dependencies for CKB Development

When CKB Studio is properly installed and started for the first time, it will display a welcome page to help you install the dependencies for CKB development - *Docker*, *CKB Node* and *CKB Compiler*.

<p align="center">
  <img src="./assets/screenshots/welcome.png" width="800px">
</p>

- CKB Studio uses [Docker](https://www.docker.com/) to run CKB node and the compiler. If you don't have Docker installed before, click the Install Docker button to open the Docker official website and follow the instructions to download and install.
- CKB Node is a [docker image](https://hub.docker.com/r/nervos/ckb-riscv-gnu-toolchain) that contains all the necessary softwares and dependencies to start a CKB node. You can install different node versions in the dropdown menu.
- CKB Compiler is a [docker image](https://hub.docker.com/r/nervos/ckb) that contains all the necessary softwares and dependencies to compiel a CKB project. You can install different compiler versions in the dropdown menu.

### CKB Project Editor

#### Create a Project

The main interface will show a list of CKB projects. If you open CKB Studio for the first time, this list will be empty. You can click the *New* button to create a new CKB project. CKB Studio has provided a list of templates to help you get started:

- **[Javascript] moleculec-es**
- **[Javascript] molecule-javascript**
- **[Javascript] minimal**
- **[Javascript] HTLC**
- **[C] carrot**
- **[C] Simple UDT**
- **Duktape**

<p align="center">
  <img src="./assets/screenshots/create_project.png" width="800px">
</p>

After a project is created, CKB Studio will automatically navigate to the project editor.

#### Compiler

Click the *Build* button (with the hammer icon) in the project toolbar (above the file tree) to compile the current CKB project.

<p align="center">
  <img src="./assets/screenshots/build_button.png" width="200px">
</p>

There is an extra step before building a JavaScript project. You will need to type the command `npm install` or `yarn` manually in the terminal to install the project dependecies.

<p align="center">
  <img src="./assets/screenshots/yarn.png" width="800px">
</p>

The compiled files will be at different locations based on the project language:
- `build/*` for JavaScript project
- `{script_name}.o` for C project

#### Debugger

CKB Studio has integrated the [CKB debugger](https://github.com/xxuejie/ckb-standalone-debugger). Click the *Debug* button (with the bug icon) in the project toolbar to debug the current CKB project.

<p align="center">
  <img src="./assets/screenshots/debug_button.png" width="200px">
</p>

The debugger will run the mocked transaction defined in `mock/tx.json` (or other file defined in the project settings). It will help you to execute the script and check the execution result very easily.

<p align="center">
  <img src="./assets/screenshots/debug_failed.png" width="800px">
</p>

### CKB Keypair Manager

Click the green button (with the key icon) in the bottom left corner to open the keypair manager. In the keypair manager, you can create, import, and delete CKB keys. Make sure that you created some keypairs before creating a CKB node. To initialize a CKB node, you will need a miner address to receive the mining rewards.

<p align="center">
  <img src="./assets/screenshots/keypair_manager.png" width="800px">
</p>

Please note that all keys in the keypair manager are for development purpose only. The private keys are saved unencrypted so **DO NOT** use them on mainnet.

### CKB Nodes

#### Create a Node Instance

Click the *Network* tab in the header to open the CKB network manager, where you can manage instances for CKB nodes and start a CKB network. If you open CKB Studio for the first time, the instance list will be empty.

<p align="center">
  <img src="./assets/screenshots/node_list_empty.png" width="800px">
</p>

Click the *New Instance* button to open the *New Instance* window. You will need to select a *block assembler* as the miner to receive mining rewards, so make sure you have created one in the [Keypair Manager](#ckb-keypair-manager).

<p align="center">
  <img src="./assets/screenshots/create_node_instance.png" width="800px">
</p>

#### Start a CKB Node

Click the *Start* button of the newly created node instance to start a CKB node. Once the node is started, you can explore the node log and miner log in the terminals below.

<p align="center">
  <img src="./assets/screenshots/start_node_instance.png" width="800px">
</p>

#### Switch Networks

In the `Network` dropdown menu, you can switch to other network such as the Aggron testnet or the CKB mainnet. Switching a network will stop your curretnly running instance.

<p align="center">
  <img src="./assets/screenshots/switch_network.png" width="300px">
</p>

### CKB Explorer

The *Explorer* tab will explore account information.

You can type a CKB address in the search bar the Explorer will reload the page and show the account information including account balance, live cells, account addresses, public keys, lock hash and transactions. You can click the refresh button to update the account information.

<p align="center">
  <img src="./assets/screenshots/explorer.png" width="800px">
</p>

### CKB Transaction Constructor

Click the *TX Constructor* tab in the header to open the transaction constructor, where you can construct a CKB transaction.

<p align="center">
  <img src="./assets/screenshots/tx_constructor.png" width="800px">
</p>

#### Cell Explorer
Cell explorer is the place where you can explore you cells.

<p align="center">
  <img src="./assets/screenshots/cell_explorer.png" width="800px">
</p>

There are some features to help with the transaction constructor:
- Cells information including total number and usage
- *Show empty cells* option helps you to find the empty cells
- Drag the cells to the *Input* field to construct inputs
- *New Cell* helps to construct a new cell with custom data
- *Transfer* (next to the address bar) helps to construct a transfer transaction
- *Mint UDT* helps to mint UDT 

#### Construct a Transaction Manually
You can generate a CKB transaction manually using Transaction Constructor.

You will need some empty cells before making transactions. Turn on the *Show empty cells* option and you will find the empty cells in the Cell Explorer, drag some of them to the *Inputs* field, you will find the total capacity (a orange block) in the upper right corner of *Inputs* field.

Once you have inputs, you can create outputs in the *Outputs* field. Click the *New* button next to the *Outputs* to open the output constructor window. Type the capacity, address, type scripts and data to create a output.

<p align="center">
  <img src="./assets/screenshots/tx_constructor.png" width="800px">
</p>

If you want to clear all the inputs and outpus field and reset them to empty, you can click the *Clear* button in the upper right.

Once the inputs and outputs are set properly, click the *Push Transaction* button to open transaction detail window, it will show the raw data of the transaction. Check the checkout next to your public key and click the *Sign transaction* button, Transaction Constructor will help you to sign the transaction with your key and the *Sign transaction* button will change to *Push transaction* button. Click the *Push transaction* button and the transaction will be submitted.

<p align="center">
  <img src="./assets/screenshots/sign_transaction.png" width="800px">
</p>

#### Generate a Transcation
You can generate a transaction rather than constructing manually. Click the *Transfer* button next to adress bar in Cell Explorer to open the *Transfer* window. Select the token, type the amount and paste the receiver public key, then click the *Preview* button, transaction constructor will help you to fill all the inputs and outpus.

<p align="center">
  <img src="./assets/screenshots/transfer_transaction.png" width="800px">
</p>

#### User Defined Token
You can create a user defined token using *Mint UDT*. Click the *Mint UDT* button next to the *Transfer* button to open *Mint UDT* window. Edit the UDT symbol and name, type the amount and receiver, click *Preview* button, transaction constructor will help you to fill all the inputs and outpus.

<p align="center">
  <img src="./assets/screenshots/mint_udt.png" width="800px">
</p>