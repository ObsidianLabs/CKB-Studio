import React from 'react'

import { connect } from '@obsidians/redux'
import BottomBar from '@obsidians/bottombar'

function BottomBarWithProps (props) {
  const selected = props.projects.get('selected')
  const projectValid = selected && !selected.get('invalid')

  return (
    <BottomBar
      txs={props.queue.getIn([props.network, 'txs'])}
      projectValid={projectValid}
    />
  )
}

export default connect(['projects', 'queue', 'network'])(BottomBarWithProps)
