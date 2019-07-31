import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { connect } from 'preact-redux'
import { searchServiceDescriptionRequest, loadAllCodeContentRequest, setToken } from '../../actions/serviceDescription.action'
import * as arrayHelpers from '../../helpers/array.helper'

class SearchServiceDescription extends Component {
  constructor (props) {
    super(props)
    this.state = this.getState()
    this.handleSearch = arrayHelpers.debounce(this.handleSearch, 500)
  }

  getState () {
    return {
      isSearching: false,
      value: null,
      checkboxes: {},
      checkAll: false,
      token: undefined,
      openDropdown: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.searchedServiceDescriptions !== this.props.searchedServiceDescriptions) {
      this.setState({ checkboxes: {} })
    }
  }

  handleChangeToken = (event) => {
    const token = event.target.value
    // this.setState({ token });
    this.props.setToken(token)
  }

  handleChangeCheckbox = item => (event) => {
    const checkboxes = { ...this.state.checkboxes }
    checkboxes[item.path] = {
      value: item,
      checked: event.target.checked
    }
    this.setState({ checkboxes })
  }

  handleSearch = (event) => {
    const { target: { value } } = event
    this.props.searchServiceDescriptionRequest({ repo: value, token: this.props.token })
  }

  handleLoadServiceDescriptions = () => {
    const selectedCodes = []

    for (const checkbox of Object.values(this.state.checkboxes)) {
      if (checkbox.checked) {
        selectedCodes.push(checkbox.value)
      }
    }
    this.props.loadAllCodeContentRequest({ codes: selectedCodes, token: this.props.token })
  }

  handleCheckAllServiceDescriptions = () => {
    const checkboxes = {}
    const checked = !this.state.checkAll
    for (const serviceDescription of this.props.searchedServiceDescriptions) {
      checkboxes[serviceDescription.path] = {
        value: serviceDescription,
        checked
      }
    }
    this.setState({ checkboxes, checkAll: checked })
  }

  handleOpenDropdown = () => {
    this.setState({ openDropdown: true })
  }

  handleCloseDropdown = () => {
    this.setState({ openDropdown: false })
  }

  render (props, state) {
    const isDropdownActive = !arrayHelpers.isEmptyArray(props.searchedServiceDescriptions) && state.openDropdown

    return (
      <div className="search-container full-width">
        <form className="ui fluid form">
          <div className="field">
            <input type="text" placeholder="Github personal token" value={props.token} onInput={this.handleChangeToken} />
            {!props.token && (
              <div className="ui pointing red basic label">
                Please enter your Github personal token
              </div>
            )}
          </div>
          {props.token && (
            <div className={`ui search right aligned  ${props.isSearching ? 'loading' : ''}`}>
              <div className="ui icon input fluid">
                <input
                  type="text"
                  className="prompt"
                  placeholder="Enter service description repo"
                  onInput={this.handleSearch}
                  onClick={this.handleOpenDropdown}
                />
                <i className="search icon" />
              </div>
              <div className={`results transition full-width ${isDropdownActive ? 'visible' : ''}`} style={{ padding: '8px', width: '100%' }}>
                <i class="icon close link close-button" onClick={this.handleCloseDropdown} />
                {props.searchedServiceDescriptions && (
                  <div className="ui selection list dropdown-container">
                    {props.searchedServiceDescriptions.map(serviceDescription => (
                      <div className="item">
                        <div className="right floated content">
                          <div className="ui checkbox">
                            <input
                              type="checkbox"
                              onInput={this.handleChangeCheckbox(serviceDescription)}
                              checked={state.checkboxes[serviceDescription.path] ? state.checkboxes[serviceDescription.path].checked : false}
                            />
                            <label />
                          </div>
                        </div>
                        <i className="large github middle aligned icon" />
                        <div className="content">
                          <a className="header">{serviceDescription.path}</a>
                          <div className="description">{serviceDescription.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ margin: '8px', float: 'right' }}>
                  <button
                    type="button"
                    className="ui button primary"
                    onClick={this.handleLoadServiceDescriptions}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className="ui button primary"
                    onClick={this.handleCheckAllServiceDescriptions}
                  >
                    Check all
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  searchedServiceDescriptions: state.serviceDescription.searchedServiceDescriptions,
  isSearching: state.ui.isSearching,
  token: state.serviceDescription.token
})

const mapDispatchToProps = {
  searchServiceDescriptionRequest,
  loadAllCodeContentRequest,
  setToken
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchServiceDescription)
