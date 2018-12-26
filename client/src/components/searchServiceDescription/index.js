import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { searchServiceDescriptionRequest } from '../../actions/serviceDescription.action';
import * as arrayHelpers from '../../helpers/array.helper';

class SearchServiceDescription extends Component {
    constructor(props) {
        super(props);
        this.state = this.getState();
        this.url = 'http?sd';
        this.handleSearch = arrayHelpers.debounce(this.handleSearch, 1000);
    }

    getState() {
        return {
            isSearching: false,
            value: null
        };
    }

    handleSearch = (event) => {
        const { value } = event.target; 
        this.props.searchServiceDescriptionRequest(value);
        this.setState({ value })
    }

    render(props, state) {
        return (
            <div class="ui category search">
                <div class="ui icon input">
                    <input
                        class="prompt"
                        type="text"
                        placeholder="Search service description..."
                        value={state.value}
                        onInput={this.handleSearch}
                    />
                    <i class="search icon" />
                </div>
                <div 
                    class={`
                        results transition 
                        ${props.searchedServiceDescriptions && props.searchedServiceDescriptions.length > 0 ? 'visible': ''}
                    `}
                >
                    {props.searchedServiceDescriptions && (
                        <div class="ui middle aligned selection list">
                            {props.searchedServiceDescriptions.map((serviceDescription) => (
                                <div class="item">
                                    <div class="right floated content">
                                        <div class="ui button">Add</div>
                                    </div>
                                    <i class="large github middle aligned icon" />
                                    <div class="content">
                                        <a class="header">{serviceDescription.repository.full_name}</a>
                                        <div class="description">{serviceDescription.name}</div>
                                    </div>
                                </div>))}
                        </div>)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    searchedServiceDescriptions: state.serviceDescription.searchedServiceDescriptions,
});

const mapDispatchToProps = {
    searchServiceDescriptionRequest,

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchServiceDescription);

