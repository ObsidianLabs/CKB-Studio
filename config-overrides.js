const os = require('os')
const path = require('path')
const {
  override,
  addWebpackExternals,
  addWebpackAlias,
  addWebpackPlugin
} = require('customize-cra')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

function findWebpackPlugin (plugins, pluginName) {
  return plugins.find(plugin => plugin.constructor.name === pluginName)
}

function overrideProcessEnv (value) {
  return config => {
    const plugin = findWebpackPlugin(config.plugins, 'DefinePlugin')
    const processEnv = plugin.definitions['process.env'] || {}
    plugin.definitions['process.env'] = {
      ...processEnv,
      ...value
    }
    return config
  }
}

function addWasmLoader (options) {
  return config => {
    config.resolve.extensions.push('.wasm')
    config.module.rules.forEach(rule => {
      (rule.oneOf || []).forEach(oneOf => {
        if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
          oneOf.exclude.push(/\.wasm$/);
        }
      })
    })
    return config
  }
}

const overrides = [
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src/lib'),
    util: path.resolve(__dirname, 'src/lib/util'),
    xxhash: path.resolve(__dirname, 'src/lib/xxhash'),
    '@obsidians/bottombar': `@obsidians/${process.env.BUILD}-bottombar`,
    '@obsidians/header': `@obsidians/${process.env.BUILD}-header`,
    '@obsidians/network': `@obsidians/${process.env.BUILD}-network`,
    '@obsidians/project': `@obsidians/${process.env.BUILD}-project`,
    '@obsidians/sdk': `@obsidians/${process.env.BUILD}-sdk`,
    '@obsidians/welcome': `@obsidians/${process.env.BUILD}-welcome`,
    '@obsidians/premium-editor': path.resolve(__dirname, process.env.PREMIUM_EDITOR || 'empty.js'),
  }),
  overrideProcessEnv({
    CDN: JSON.stringify(!!process.env.CDN),
    BUILD: JSON.stringify(process.env.BUILD),
    PROJECT: JSON.stringify(process.env.PROJECT || process.env.BUILD),
    DEPLOY: JSON.stringify(process.env.DEPLOY),
    PROJECT_NAME: JSON.stringify(process.env.PROJECT_NAME),
    LOGIN_PROVIDERS: JSON.stringify(process.env.LOGIN_PROVIDERS),
    OS_IS_LINUX: JSON.stringify(os.type() === 'Linux'),
    OS_IS_WINDOWS: JSON.stringify(os.type() === 'Windows_NT'),
    OS_IS_MAC: JSON.stringify(os.type() === 'Darwin'),
    ENABLE_AUTH: JSON.stringify(!!process.env.ENABLE_AUTH),
  }),
  addWasmLoader(),
]

if (process.env.CDN) {
  overrides.unshift(addWebpackExternals({
    react: 'React',
    'react-dom': 'ReactDOM',
    'monaco-editor': 'monaco'
  }))
} else {
  overrides.push(addWebpackPlugin(
    new MonacoWebpackPlugin({
      languages: ['json', 'javascript', 'typescript', 'css', 'html', 'markdown', 'c', 'cpp', 'shell']
    })
  ))
}

module.exports = {
  webpack: override(...overrides)
}
