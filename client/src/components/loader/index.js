import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class LoaderContainer extends Component {
  render (props, state) {
    if (!props.isFetching) {
      return null
    }

    return (
      <div class='ui page active dimmer'>
        <div class='ui text loader'>Loading</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.ui.isFetching
})

export default connect(
  mapStateToProps,
  null
)(LoaderContainer)
