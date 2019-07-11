import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { connect } from 'preact-redux'

class LoaderContainer extends Component {
  render (props, state) {
    if (!props.isFetching) {
      return null
    }

    return (
      <div className="ui page active dimmer">
        <div className="ui text loader">Loading</div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.ui.isFetching
})

export default connect(
  mapStateToProps,
  null
)(LoaderContainer)
