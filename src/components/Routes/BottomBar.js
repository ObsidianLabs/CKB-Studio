import React from 'react'

import { connect } from '@obsidians/redux'
import BottomBar from '@obsidians/bottombar'

function BottomBarWithProps (props) {
  const selected = props.projects.get('selected')
  const projectValid = selected && !selected.get('invalid')

  return (
    <BottomBar
      profile={props.profile}
      txs={props.queue.getIn([props.network, 'txs'])}
      projectValid={projectValid}
    />
  )
}

export default connect(['profile', 'projects', 'queue', 'network'])(BottomBarWithProps)
