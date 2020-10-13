import React, { Suspense, lazy } from 'react'
import { BrowserRouter, HashRouter, Route } from 'react-router-dom'

import { LoadingScreen } from '@obsidians/ui-components'
import { Auth } from '@obsidians/auth'

const Router = window.require ? HashRouter : BrowserRouter
const ReduxApp = lazy(() => import('./ReduxApp' /* webpackChunkName: "components" */))
const auth = new Auth()

export default function App () {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Route path='/callback' render={(props) => {
          auth.handleCallback(props)
          return null
        }}/>
        <Route component={ReduxApp} />
      </Suspense>
    </Router>
  )
}
