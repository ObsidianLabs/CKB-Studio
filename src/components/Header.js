import React, { PureComponent } from 'react'

import { connect } from '@obsidians/redux'
import { IpcChannel } from '@obsidians/ipc'

import headerActions, { Header, NavGuard, AuthModal } from '@obsidians/header'
import { networkManager, networks } from '@obsidians/network'
import { actions } from '@obsidians/workspace'

import { List } from 'immutable'

class HeaderWithRedux extends PureComponent {
  state = {
    networkList: List(),
    interval: null
  }

  componentDidMount () {
    actions.history = this.props.history
    headerActions.history = this.props.history
    this.refresh()
    this.navGuard = new NavGuard(this.props.history)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.network && prevProps.network !== this.props.network) {
      this.refresh()
    }
  }

  async refresh () {
    if (process.env.DEPLOY === 'bsn') {
      this.getNetworks()
      clearInterval(this.state.interval)
      const interval = setInterval(() => this.getNetworks(), 30 * 1000)
      this.setState({ interval })
    } else {
      this.setState({ networkList: List(networks) }, this.setNetwork)
    }
  }

  async getNetworks () {
    try {
      const ipc = new IpcChannel('bsn')
      const projects = await ipc.invoke('projects', { chain: 'ckb' })
      this.setState({
        networkList: List(projects.map(project => {
          const url = project.endpoints?.find(endpoint => endpoint.startsWith('http'))
          return {
            id: `bsn${project.network.id}`,
            group: 'BSN',
            name: `${project.network.name}`,
            fullName: `${project.network.name} - ${project.name}`,
            icon: 'fas fa-globe',
            notification: `Switched to <b>${project.network.name}</b>.`,
            url,
            indexer: `${url}/indexer`,
            explorer: project.network.name.includes('Mainnet') ? 'https://ckb.obsidians.io/explorer/lina' : 'https://ckb.obsidians.io/explorer/aggron',
            chainId: project.id
          }
        }))
      }, this.setNetwork)
    } catch (error) {
      this.setState({ networkList: List() })
    }
  }

  setNetwork () {
    if (!networkManager.network) {
      networkManager.setNetwork(this.state.networkList.get(0))
    }
  }

  networkList = networksByGroup => {
    const networkList = []
    const groups = networksByGroup.toJS()
    const keys = Object.keys(groups)
    keys.forEach((key, index) => {
      if (key !== 'default') {
        networkList.push({ header: key })
      }
      groups[key].forEach(network => networkList.push(network))
      if (index !== keys.length - 1) {
        networkList.push({ divider: true })
      }
    })
    return networkList
  }

  render () {
    console.debug('[render] HeaderWithRedux')
    const { profile, projects, contracts, accounts, network } = this.props
    const [networkId, chain] = network.split(':')

    const selectedProject = projects.get('selected')?.toJS() || {}

    const networkGroups = this.state.networkList.groupBy(n => n.group)
    const networkList = this.networkList(networkGroups)
    const selectedNetwork = this.state.networkList.find(n => n.id === networkId) || {}

    const starred = accounts.getIn([network, 'accounts'])?.toJS() || []
    const selectedContract = contracts.getIn([network, 'selected']) || ''
    const selectedAccount = accounts.getIn([network, 'selected']) || ''

    return (
      <Header
        profile={profile}
        projects={projects.get('local').toJS()}
        selectedProject={selectedProject}
        selectedContract={selectedContract}
        selectedAccount={selectedAccount}
        starred={starred}
        network={selectedNetwork}
        networkList={networkList}
        AuthModal={AuthModal}
      />
    )
  }
}

export default connect([
  'profile',
  'projects',
  'contracts',
  'accounts',
  'network',
])(HeaderWithRedux)
