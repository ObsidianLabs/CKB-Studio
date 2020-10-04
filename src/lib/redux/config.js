import Immutable, { List, Map } from 'immutable'

export { redux as projects } from '@obsidians/project'
export { redux as keypairs } from '@obsidians/keypair'
export { redux as queue } from '@obsidians/queue'

export const version = {
  default: Immutable.fromJS({}),
  persist: true,
  actions: {
    SET_VERSION: {
      reducer: (state, { payload }) => state.merge(payload)
    }
  }
}

export const profile = {
  default: Map({}),
  persist: true,
  actions: {
    SET_USER_PROFILE: {
      reducer: (state, { payload }) => state.merge(payload)
    },
    CLEAR_USER_PROFILE: {
      reducer: () => Map({})
    },
  }
}

export const globalConfig = {
  default: Immutable.fromJS({}),
  persist: true,
  actions: {
    UPDATE_GLOBAL_CONFIG: {
      reducer: (state, { payload }) => state.mergeDeep(payload)
    },
  }
}

export const uiState = {
  default: Immutable.fromJS({}),
  persist: false,
  actions: {
    UPDATE_UI_STATE: {
      reducer: (state, { payload }) => state.mergeDeep(payload)
    },
  }
}

export const contracts = {
  default: Immutable.fromJS({
    local: {
      selected: '',
      tabs: [],
    },
  }),
  persist: true,
  actions: {
    CREATE_LOCAL: {
      reducer: state => state.update('local', (local = Immutable.fromJS({ selected: '', data: [] })) => local)
    },
    CREATE_TABS: {
      reducer: state => state
        .updateIn(['local', 'tabs'], (tabs = List([])) => tabs)
    },
    SELECT_CONTRACT: {
      reducer: (state, { payload }) => state.setIn([payload.network, 'selected'], payload.contract)
    },
    SET_CONTRACT_TABS: {
      reducer: (state, { payload }) => state.setIn([payload.network, 'tabs'], Immutable.fromJS(payload.tabs))
    },
  }
}

export const accounts = {
  default: Immutable.fromJS({
    local: {
      loading: false,
      selected: '',
      accounts: [],
      tabs: [],
    }
  }),
  persist: true,
  actions: {
    CREATE_TABS: {
      reducer: state => state
        .updateIn(['local', 'tabs'], (tabs = List([])) => tabs)
    },
    SET_ACCOUNT_TABS: {
      reducer: (state, { payload }) => state.setIn([payload.network, 'tabs'], Immutable.fromJS(payload.tabs))
    },
    SET_STARRED: {
      reducer: (state, { payload }) => state.setIn([payload.network, 'accounts'], List(payload.starred))
    },
    SELECT_ACCOUNT: {
      reducer: (state, { payload }) => state.setIn([payload.network, 'selected'], payload.account)
    },
    REMOVE_ACCOUNT: {
      reducer: (state, { payload }) => {
        let index = state.getIn([payload.network, 'accounts']).indexOf(payload.account)
        if (index === -1) {
          return state
        }
        return state.updateIn([payload.network, 'accounts'], data => data.remove(index))
      }
    },
  }
}

export const network = {
  default: '',
  persist: false,
  actions: {
    SELECT_NETWORK: {
      reducer: (_, { payload }) => payload
    }
  }
}
