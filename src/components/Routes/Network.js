import React, { PureComponent } from 'react'

import { InstanceList } from '@obsidians/instances'

import { withRouter } from 'react-router-dom'

import redux, { connect } from '@obsidians/redux'

const onLifecycle = ({ lifecycle, runningInstance }) => {
  switch (lifecycle) {
    case 'stopped':
      redux.dispatch('UPDATE_UI_STATE', { localNetwork: '' })
      break
    case 'started':
      redux.dispatch('UPDATE_UI_STATE', { localNetwork: runningInstance })
      break
    default:
  }
}

class Network extends PureComponent {
  state = {
    active: true
  }

  componentDidMount () {
    this.props.cacheLifecycles.didCache(() => this.setState({ active: false }))
    this.props.cacheLifecycles.didRecover(() => this.setState({ active: true }))
  }

  render () {
    return (
      <InstanceList
        network={this.props.network}
        onLifecycle={onLifecycle}
        active={this.state.active}
      />
    )
  }
}


export default connect([
  'network',
])(withRouter(Network))
