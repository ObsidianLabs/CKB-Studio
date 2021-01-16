const { IpcChannel } = require('@obsidians/ipc')
const KeypairManager = require('@obsidians/keypair')
const { AutoUpdate } = require('@obsidians/global')
const CompilerManager = require('@obsidians/ckb-compiler')
const { CkbInstanceManager } = require('@obsidians/ckb-network')
const ProjectChannel = require('@obsidians/ckb-project')
const AuthChannel = require('@obsidians/auth')

let ipcChannel, keypairManager, autoUpdate, compilerManager, instanceManager, projectChannel, authChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  keypairManager = new KeypairManager(process.env.BUILD)
  autoUpdate = new AutoUpdate('https://app.obsidians.io/api/v1/check-update/ckb/')
  compilerManager = new CompilerManager()
  instanceManager = new CkbInstanceManager()
  projectChannel = new ProjectChannel()
  authChannel = new AuthChannel()
}
