import React, { Component } from 'react'

import { Screen, Button } from '@obsidians/ui-components'

import keypairManager from '@obsidians/keypair'
import fileOps from '@obsidians/file-ops'
import CkbTx from '@obsidians/ckb-tx'
import CkbTxBuilder, { CkbCellCollection } from '@obsidians/ckb-tx-builder'

import { withRouter } from 'react-router-dom'

import redux, { connect } from '@obsidians/redux'

const cellCollection = new CkbCellCollection()
window.txBuilder = new CkbTxBuilder(cellCollection, fileOps.current.fs)

class BlockchainApi extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addressBook: []
    }
    this.page = React.createRef()
    props.cacheLifecycles.didRecover(this.checkLocation)
  }

  componentDidMount () {
    this.refresh()
  }

  shouldComponentUpdate (props, state) {
    return (
      this.state.addressBook !== state.addressBook ||
      this.props.network !== props.network ||
      this.props.match !== props.match
    )
  }

  componentDidUpdate () {
    this.checkLocation()
  }

  checkLocation = () => {
    const match = this.props.match
    if (match && match.params) {
      const name = match.params.name || ''
      this.updateSelected(name)
    }
  }

  updateSelected = name => {
    const pageRef = this.page.current
    if (!pageRef) {
      return
    }
    if (name !== pageRef.currentValue) {
      pageRef.openTab(name)
    }
  }

  refresh = async () => {
    const keypairs = await keypairManager.loadAllKeypairs()
    this.setState({ addressBook: keypairs })
  }

  getSelected = (props = this.props) => props.contracts.getIn([props.network, 'selected']);

  getTabs = () => {
    const tabs = this.props.contracts.getIn([this.props.network, 'tabs'])
    return tabs ? tabs.toArray() : []
  }

  getStarred = () => {
    const starred = this.props.accounts.getIn([this.props.network, 'accounts'])
    return starred ? starred.toArray() : []
  }

  onValueChanged = value => {
    redux.dispatch('SELECT_CONTRACT', {
      network: this.props.network,
      contract: value
    })
    this.props.history.push(`/contract/${value}`)
  }

  onChangeStarred = starred => {
    redux.dispatch('SET_STARRED', {
      network: this.props.network,
      starred
    })
  }

  onTabsUpdated = tabs => {
    redux.dispatch('SET_CONTRACT_TABS', {
      network: this.props.network,
      tabs
    })
  }

  render () {
    const { uiState, network } = this.props

    if (network === 'local' && !uiState.get('localNetwork')) {
      return (
        <Screen>
          <h4 className='display-4'>Disconnected</h4>
          <p className='lead'>Please start a local network.</p>
          <hr />
          <span>
            <Button color='primary' onClick={() => this.props.history.push(`/network/local`)}>Go to Network</Button>
          </span>
        </Screen>
      )
    }

    return (
      <CkbTx
        ref={this.page}
        address={this.getSelected()}
        tabs={this.getTabs()}
        starred={this.getStarred()}
        addressBook={this.state.addressBook}
        cellCollection={cellCollection}
        onValueChanged={this.onValueChanged}
        onChangeStarred={this.onChangeStarred}
        onTabsUpdated={this.onTabsUpdated}
      />
    )
  }
}

export default connect([
  'uiState',
  'network',
  'contracts',
  'accounts'
])(withRouter(BlockchainApi))
