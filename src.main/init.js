const { IpcChannel } = require('@obsidians/ipc')
const { AutoUpdate } = require('@obsidians/ckb-welcome')
const CkbCompilerManager = require('@obsidians/ckb-compiler')
const { CkbInstanceManager } = require('@obsidians/ckb-instances')
const CkbKeypairManager = require('@obsidians/ckb-keypair')
const CkbProjectChannel = require('@obsidians/ckb-project')

let ipcChannel, autoUpdate, ckbCompilerManager, ckbInstanceManager, ckbKeypairManager, ckbProjectChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  autoUpdate = new AutoUpdate('https://app.eosstudio.io/api/v1/check-update-ckb/')
  ckbCompilerManager = new CkbCompilerManager()
  ckbInstanceManager = new CkbInstanceManager()
  ckbKeypairManager = new CkbKeypairManager()
  ckbProjectChannel = new CkbProjectChannel()
}
