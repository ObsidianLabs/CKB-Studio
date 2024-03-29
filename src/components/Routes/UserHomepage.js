import { BaseUserHomepage } from '@obsidians/user'
import redux, { connect } from '@obsidians/redux'
import { networkManager } from '@obsidians/network'

class UserHomepage extends BaseUserHomepage {
  componentDidMount (props) {
    super.componentDidMount(props)
    this.updateNetwork()
  }

  async updateNetwork () {
    const urlParams = new URLSearchParams(this.props.location.search);
    const networkId = `bsn_${urlParams.get('projectId')}`
    this.setNetwork(networkId)
  }

  async setNetwork (networkId, counter = 0) {
    if (networkManager?.networks?.length) {
      const network = networkManager.networks.find(network => network.id === networkId)
      if (network) {
        networkManager.setNetwork(network, { redirect: false, notify: true })
      }
      this.props.history.replace(`/${this.props.match.params.username}`)
    } else if (counter <= 30) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await this.setNetwork(networkId, ++counter)
    }
  }
}

export default connect(['profile', 'projects'])(UserHomepage)
