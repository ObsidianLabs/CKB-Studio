const { IpcChannel } = require('@obsidians/ipc')
const KeypairManager = require('@obsidians/keypair')
const { AutoUpdate } = require('@obsidians/ckb-welcome')
const CkbCompilerManager = require('@obsidians/ckb-compiler')
const { CkbInstanceManager } = require('@obsidians/ckb-instances')
const CkbProjectChannel = require('@obsidians/ckb-project')

let ipcChannel, autoUpdate, ckbCompilerManager, ckbInstanceManager, ckbKeypairManager, ckbProjectChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  autoUpdate = new AutoUpdate('https://app.eosstudio.io/api/v1/check-update-ckb/')
  ckbCompilerManager = new CkbCompilerManager()
  ckbInstanceManager = new CkbInstanceManager()
  // ckbKeypairManager = new CkbKeypairManager()
  ckbKeypairManager = new KeypairManager(process.env.BUILD)
  ckbProjectChannel = new CkbProjectChannel()
}
