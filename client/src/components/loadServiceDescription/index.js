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
			url: null,
			enable: false
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

	handleToggle = (event) => {
		this.setState({ enable: !this.state.enable });
	}

	render(props, state) {
		return (
			<div class="ui form full-width">
				<div class="inline field">
					<div class={`ui toggle checkbox ${state.enable ? 'checked' : ''}`}>
						<input type="checkbox" onInput={this.handleToggle} />
						<label>Enable load url</label>
					</div>
				</div>
				{state.enable && (
					<div class="field">
						<div class="ui action input full-width">
							<input
								type="text"
								value={state.url}
								onInput={this.handleChangeUrl}
								placeholder="Input json url"
							/>
							<button
								class="ui right primary labeled icon button"
								onClick={this.handleLoadServiceDescription}
							>
								<i class="sync alternate icon" />
								Load
							</button>
						</div>
					</div>
				)}
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
