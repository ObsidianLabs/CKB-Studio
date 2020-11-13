import React, { Component } from 'react'

import { Screen, Button } from '@obsidians/ui-components'

import CkbAccount from '@obsidians/ckb-account'

import { withRouter } from 'react-router-dom'

import redux, { connect } from '@obsidians/redux'

class Explorer extends Component {
  constructor (props) {
    super(props)
    this.page = React.createRef()
    props.cacheLifecycles.didRecover(this.checkLocation)
  }

  shouldComponentUpdate (props, state) {
    return (
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

  getSelected = (props = this.props) => props.accounts.getIn([props.network, 'selected']);

  getTabs = () => {
    const tabs = this.props.accounts.getIn([this.props.network, 'tabs'])
    return tabs ? tabs.toArray() : []
  }

  getStarred = () => {
    const starred = this.props.accounts.getIn([this.props.network, 'accounts'])
    return starred ? starred.toArray() : []
  }

  onValueChanged = value => {
    redux.dispatch('SELECT_ACCOUNT', {
      network: this.props.network,
      account: value
    })
    this.props.history.push(`/account/${value}`)
  }

  onChangeStarred = starred => {
    redux.dispatch('SET_STARRED', {
      network: this.props.network,
      starred
    })
  }

  onTabsUpdated = tabs => {
    redux.dispatch('SET_ACCOUNT_TABS', {
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
      <CkbAccount
        ref={this.page}
        network={network}
        address={this.getSelected()}
        tabs={this.getTabs()}
        starred={this.getStarred()}
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
  'accounts',
])(withRouter(Explorer))
