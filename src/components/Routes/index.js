import React, { Suspense, lazy } from 'react'
import { Route, Redirect } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

import Auth from '@obsidians/auth'
import { Input, LoadingScreen, CenterScreen } from '@obsidians/ui-components'

import BottomBar from './BottomBar'

Input.defaultProps = {
  type: 'text',
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: 'false'
}

const UserHomepage = lazy(() => import('./UserHomepage' /* webpackChunkName: "tabs" */))
const Project = lazy(() => import('./Project' /* webpackChunkName: "tabs" */))
const NavbarRightPage1 = lazy(() => import('./NavbarRightPage1' /* webpackChunkName: "tabs" */))
const NavbarRightPage2 = lazy(() => import('./NavbarRightPage2' /* webpackChunkName: "tabs" */))
const Network = lazy(() => import('./Network' /* webpackChunkName: "tabs" */))

export default function (props) {
  return (
    <React.Fragment>
      {props.children}
      <Suspense fallback={<LoadingScreen />}>
        <CacheSwitch>
          <Route
            exact
            path='/'
            render={() => <Redirect to={`/${Auth.username || 'local'}`} />}
          />
          <CacheRoute
            exact
            path='/contract/:name?'
            component={NavbarRightPage1}
            className='p-relative w-100 h-100'
          />
          <CacheRoute
            exact
            path='/account/:name?'
            component={NavbarRightPage2}
            className='p-relative w-100 h-100'
          />
          <CacheRoute
            exact
            path='/network/:network?'
            component={Network}
            className='p-relative w-100 h-100'
          />
          <Route
            exact
            path='/:username'
            component={UserHomepage}
            className='p-relative w-100 h-100'
          />
          <CacheRoute
            exact
            path='/:username/:project'
            cacheKey='project-editor'
            component={Project}
            className='p-relative w-100 h-100'
          />
          <Route
            render={() => <CenterScreen>Invalid URL</CenterScreen>}
          />
        </CacheSwitch>
      </Suspense>
      <CacheRoute
        component={BottomBar}
        className='border-top-1 d-flex flex-row'
      />
    </React.Fragment>
  )
}
