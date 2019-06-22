import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { fetchServiceDescriptionRequest } from '../../actions/serviceDescription.action'

class ServiceDescriptionLoader extends Component {
	constructor(props) {
		super(props);
		this.state = this.getState();
	}

	getState() {
		return {
			url: null
		};
	}

	handleChangeUrl = (event) => {
		this.setState({ url: event.target.value })
	}

	handleLoadServiceDescription = () => {
		if (this.state.url) {
			this.props.fetchServiceDescriptionRequest(this.state.url);
		}
	}

	render(props, state) {
		return (
			<div class="ui action input full-width">
                <input
                    type="text"
                    value={state.url}
                    onInput={this.handleChangeUrl}
                    placeholder="Input json url"
                />
                <button
                    class="ui right labeled icon button"
                    onClick={this.handleLoadServiceDescription}
                >
                    <i class="sync alternate icon" />
                    Load
                </button>
            </div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = {
	fetchServiceDescriptionRequest,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ServiceDescriptionLoader);
