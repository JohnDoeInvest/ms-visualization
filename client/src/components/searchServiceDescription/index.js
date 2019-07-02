import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { searchServiceDescriptionRequest, loadAllCodeContentRequest, setToken } from '../../actions/serviceDescription.action';
import * as arrayHelpers from '../../helpers/array.helper';

class SearchServiceDescription extends Component {
    constructor(props) {
        super(props);
        this.state = this.getState();
        this.handleSearch = arrayHelpers.debounce(this.handleSearch, 500);
    }

    getState() {
        return {
            isSearching: false,
            value: null,
            checkboxes: {},
            checkAll: false,
            token: undefined
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchedServiceDescriptions !== this.props.searchedServiceDescriptions) {
            this.setState({ checkboxes: {} });
        }
    }

    handleChangeToken = (event) => {
        const token = event.target.value;
        // this.setState({ token });
        this.props.setToken(token)
    }

    handleChangeCheckbox = (item) => (event) => {
        const checkboxes = {...this.state.checkboxes};
        checkboxes[item.path] = {
            value: item,
            checked: event.target.checked,
        }
        this.setState({ checkboxes });
    }

    handleSearch = (event) => {
        const { target: { value } } = event;
        this.props.searchServiceDescriptionRequest({ repo: value, token: this.props.token });
    }

    handleLoadServiceDescriptions = () => {
        const selectedCodes = [];

        for (const [key, checkbox] of Object.entries(this.state.checkboxes)) {
            if (checkbox.checked) {
                selectedCodes.push(checkbox.value);
            }
        }
        this.props.loadAllCodeContentRequest({ codes: selectedCodes, token: this.props.token });
    }

    handleCheckAllServiceDescriptions = () => {
        const checkboxes = {};
        const checked = !this.state.checkAll;
        for (const serviceDescription of this.props.searchedServiceDescriptions) {
            checkboxes[serviceDescription.path] = {
                value: serviceDescription,
                checked
            }
        }
        this.setState({ checkboxes, checkAll: checked });
    }

    render(props, state) {
        return (
            <div class="search-container full-width">
                <form class="ui fluid form">
                    <div class="field">
                        <input type="text" placeholder="Github personal token" value={props.token} onInput={this.handleChangeToken} />
                        {!props.token && (
                            <div class="ui pointing red basic label">
                                Please enter your Github personal token
                            </div>
                        )}
                    </div>
                    {props.token && (
                        <div class={`ui search right aligned  ${props.isSearching ? 'loading': ''}`}>
                            <div class="ui icon input fluid">
                                <input
                                    type="text"
                                    class="prompt"
                                    placeholder="Enter service description repo"
                                    onInput={this.handleSearch}
                                />
                                <i class="search icon" />
                            </div>
                            <div class={`results transition full-width ${props.searchedServiceDescriptions && props.searchedServiceDescriptions.length > 0 ? 'visible': ''}`} style={{padding: '8px', width: '100%'}}>
                                {props.searchedServiceDescriptions && (
                                    <div class="ui selection list" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        {props.searchedServiceDescriptions.map((serviceDescription) => (
                                            <div class="item">
                                                <div class="right floated content">
                                                    <div class="ui checkbox">
                                                        <input
                                                            type="checkbox"
                                                            onInput={this.handleChangeCheckbox(serviceDescription)}
                                                            checked={state.checkboxes[serviceDescription.path] ? state.checkboxes[serviceDescription.path].checked : false}
                                                        />
                                                        <label />
                                                    </div>
                                                </div>
                                                <i class="large github middle aligned icon" />
                                                <div class="content">
                                                    <a class="header">{serviceDescription.path}</a>
                                                    <div class="description">{serviceDescription.name}</div>
                                                </div>
                                            </div>))}
                                    </div>)}
                                    <div style={{margin: '8px', float: 'right'}}>
                                        <button
                                            type="button"
                                            class="ui button primary"
                                            onClick={this.handleLoadServiceDescriptions}
                                        >
                                            Load
                                        </button>
                                        <button
                                            type="button"
                                            class="ui button primary"
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
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    searchedServiceDescriptions: state.serviceDescription.searchedServiceDescriptions,
    isSearching: state.ui.isSearching,
    token: state.serviceDescription.token
});

const mapDispatchToProps = {
    searchServiceDescriptionRequest,
    loadAllCodeContentRequest,
    setToken
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchServiceDescription);

