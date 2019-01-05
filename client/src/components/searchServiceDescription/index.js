import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { searchServiceDescriptionRequest, loadAllCodeContentRequest } from '../../actions/serviceDescription.action';
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
            checkboxes: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchedServiceDescriptions !== this.props.searchedServiceDescriptions) {
            this.setState({ checkboxes: {} });
        }
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
        this.props.searchServiceDescriptionRequest(value);
    }

    handleLoadServiceDescriptions = () => {
        const selectedCodes = [];

        for (const [key, checkbox] of Object.entries(this.state.checkboxes)) {
            if (checkbox.checked) {
                selectedCodes.push(checkbox.value);
            }
        }
        this.props.loadAllCodeContentRequest(selectedCodes);
    }

    handleLoadAllServiceDescriptions = () => {
        this.props.loadAllCodeContentRequest(this.props.searchedServiceDescriptions);
    }

    render(props, state) {
        return (
            <div class={`ui category search ${props.isSearching ? 'loading': ''}`}>
                <div class="ui icon input">
                    <input
                        class="prompt"
                        type="text"
                        placeholder="Search service description..."
                        onInput={this.handleSearch}
                    />
                    <i class="search icon" />
                </div>
                <div class={`results transition ${props.searchedServiceDescriptions && props.searchedServiceDescriptions.length > 0 ? 'visible': ''}`}>
                    {props.searchedServiceDescriptions && (
                        <div class="ui middle aligned selection list">
                            {props.searchedServiceDescriptions.map((serviceDescription) => (
                                <div class="item">
                                    <div class="right floated content">
                                        <div class="ui checkbox">
                                            <input
                                                type="checkbox"
                                                onInput={this.handleChangeCheckbox(serviceDescription)}
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
                        <div style={{margin: '16px', float: 'right'}}>
                            <button
                                class="ui button primary"
                                onClick={this.handleLoadServiceDescriptions}
                            >
                                Load
                            </button>
                            <button
                                class="ui button primary"
                                onClick={this.handleLoadAllServiceDescriptions}
                            >
                                Load all
                            </button>
                        </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    searchedServiceDescriptions: state.serviceDescription.searchedServiceDescriptions,
    isSearching: state.ui.isSearching
});

const mapDispatchToProps = {
    searchServiceDescriptionRequest,
    loadAllCodeContentRequest
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchServiceDescription);

