import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import style from './style.css'

class ENVTable extends Component {
  isHighlight (env) {
    const serviceDescription = this.props.selectedServiceDescriptions[this.props.selectedServiceDescriptionIndex]

    if (serviceDescription) {
      return serviceDescription.envVars[env.name]
    }

    return false
  }

  getEnvs () {
    let envs = []
    let envMap = new Map()

    for (const serviceDescription of this.props.selectedServiceDescriptions) {
      const { envVars } = serviceDescription
      for (const key of Object.keys(envVars)) {
        if (!envMap.has(key)) {
          envMap.set(key, envVars[key])
        }
      }
    }

    for (const [key, value] of envMap) {
      envs.push({
        name: key,
        ...value
      })
    }

    return envs
  }

  render (props, state) {
    const envs = this.getEnvs()
    if (envs.length === 0) {
      return null
    }

    return (
      <div class='full-width'>
        <h2 class='ui header'>ENV Vars</h2>
        <table class='ui selectable fixed table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {envs.map((env, i) => (
              <tr class={this.isHighlight(env) ? style.active : style.inactive} key={i}>
                <td>{env.name}</td>
                <td>{env.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  selectedServiceDescriptions: state.serviceDescription.selectedServiceDescriptions,
  selectedServiceDescriptionIndex: state.serviceDescription.selectedServiceDescriptionIndex
})

export default connect(
  mapStateToProps,
  undefined
)(ENVTable)
