import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { connect } from 'preact-redux'
import { fetchSuccess } from '../../actions/fetch.action'

class ErrorContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { active: false }
  }

  handleClose = () => {
    this.props.fetchSuccess()
  }

  render (props, state) {
    if (!props.error) {
      return null
    }

    const errorMessage = (props.error instanceof Error) ? props.error.message : props.error

    return (
      <div class="ui dimmer modals page visible active">
        <div class="active mini modal ui visible">
          <div class="header">Error</div>
          <div class="content">
            <p>{errorMessage}</p>
          </div>
          <div class="actions">
            <div class="ui center negative button" onClick={this.handleClose}>CLOSE</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  error: state.ui.error
})

export default connect(
  mapStateToProps,
  {
    fetchSuccess: fetchSuccess
  }
)(ErrorContainer)
