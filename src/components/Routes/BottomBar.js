import React from 'react'

import BottomBar from '@obsidians/bottombar'

import redux, { connect } from '@obsidians/redux'

function BottomBarWithProps (props) {
  const selected = props.projects.get('selected')
  const projectValid = selected && !selected.get('invalid')

  return (
    <BottomBar
      projectValid={projectValid}
      compilerVersion={props.globalConfig.get('compilerVersion')}
      onSelectCompiler={compilerVersion => redux.dispatch('UPDATE_GLOBAL_CONFIG', { compilerVersion })}
    />
  )
}

export default connect(['projects', 'globalConfig'])(BottomBarWithProps)
