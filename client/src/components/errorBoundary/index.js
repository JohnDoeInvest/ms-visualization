import { h, Component } from 'preact' // eslint-disable-line no-unused-vars

class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

    getInitialState = () => ({
      errorMessage: null
    })

    componentDidCatch (error) {
      this.setState({ errorMessage: error.message })
    }

    handleReload = () => {
      window.location.reload()
    }

    render (props, state) {
      if (state.errorMessage) {
        return (
          <div class="ui dimmer modals page visible active">
            <div class="active mini modal ui visible">
              <div class="header">System Error</div>
              <div class="content">
                <p>{state.errorMessage}</p>
              </div>
              <div class="actions">
                <div class="ui center negative button" onClick={this.handleReload}>CLOSE</div>
              </div>
            </div>
          </div>
        )
      }
      return props.children
    }
}

export default ErrorBoundary
