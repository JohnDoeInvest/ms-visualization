import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
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
      <div className="ui page active dimmer">
        <div className="content">
          <div className="center">
            <h2 className="ui inverted header">
                            Error
              <div className="sub header">{props.error}</div>
            </h2>
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
  null
)(ErrorContainer)
