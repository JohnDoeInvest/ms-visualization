import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class ErrorContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { active: false }
  }

  render (props, state) {
    if (!props.error) {
      return null
    }

    return (
      <div class='ui page active dimmer'>
        <div class='content'>
          <div class='center'>
            <h2 class='ui inverted header'>
                            Error
              <div class='sub header'>{props.error}</div>
            </h2>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  error: state.ui.error
})

export default connect(
  mapStateToProps,
  null
)(ErrorContainer)
