import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { connect } from 'preact-redux'
import { fetchServiceDescriptionRequest } from '../../actions/serviceDescription.action'

class ServiceDescriptionLoader extends Component {
  constructor (props) {
    super(props)
    this.state = this.getState()
  }

  getState () {
    return {
      url: null,
      enable: false
    }
  }

handleChangeUrl = (event) => {
  this.setState({ url: event.target.value })
}

handleLoadServiceDescription = () => {
  if (this.state.url) {
    this.props.fetchServiceDescriptionRequest({ url: this.state.url, token: this.props.token })
  }
}

handleToggle = (event) => {
  this.setState({ enable: event.target.checked })
}

render (props, state) {
  return (
    <div className="ui form full-width">
      <div className="inline field">
        <div className={`ui toggle checkbox ${state.enable ? 'checked' : ''}`}>
          <input type="checkbox" onInput={this.handleToggle} />
          <label>Enable load url</label>
        </div>
      </div>
      {state.enable && (
        <div className="field">
          <div className="ui action input full-width">
            <input
              type="text"
              value={state.url}
              onInput={this.handleChangeUrl}
              placeholder="Input json url"
            />
            <button
              className="ui right primary labeled icon button"
              onClick={this.handleLoadServiceDescription}
            >
              <i className="sync alternate icon" />
              Load
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
}

const mapStateToProps = (state, ownProps) => ({
  token: state.serviceDescription.token
})

const mapDispatchToProps = {
  fetchServiceDescriptionRequest
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceDescriptionLoader)
