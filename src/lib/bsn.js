import decode from 'jwt-decode'

async function handleBsnCallback ({ location, history }) {
  const query = new URLSearchParams(location.search)
  const code = query.get('code')
  const state = query.get('state')

  const tokens = await this.fetchTokens(code, 'bsn')
  if (!tokens) {
    history.replace('/')
    return
  }

  const { token, awsToken } = tokens

  const awsCredential = await this.fetchAwsCredential(awsToken)
  if (!awsCredential) {
    history.replace('/')
    return
  }

  const { username, avatar } = decode(token)
  this.profile = { username, avatar }
  this.credentials = { token, awsCredential }

  try {
    // const {
    //   urlCode,
    //   projectId,
    //   orgCode,
    //   appTypeId,
    //   appTypeFrameName,
    // } = JSON.parse(atob(decodeURIComponent(state)))
    // bsnParams = {
    //   urlCode,
    //   projectId,
    //   orgCode,
    //   appTypeId,
    //   appTypeFrameName,
    // }
    history.replace(`${username}`)
  } catch (error) {
    history.replace('/')
  }
}

async function createProject ({ networkManager, projectChannel }, { projectRoot, name, template, notify }) {
  let created
  try {
    created = await projectChannel.invoke('post', '', {
      projectRoot,
      name,
      template,
      notify,
      meta: {
        build: 'bsn',
        bsnProjectId: networkManager.network.raw.id,
        organizationId: networkManager.network.raw.organization.id,
        chaincodeName: name,
      }
    })
  } catch (error) {
  }

  return created
}

export {
  handleBsnCallback,
  createProject,
}