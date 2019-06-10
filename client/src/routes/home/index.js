/* eslint-disable */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Editor from '../../components/editor';
import style from './style';
import { FlowChart } from '../../lib/d3/components';
import ServiceDescriptionSearchContainer from '../../components/searchServiceDescription';
import ServiceDescriptionTableContainer from '../../components/serviceDescriptionTable';
import { fetchServiceDescriptionRequest, loadServiceDescriptionSuccess } from '../../actions/serviceDescription.action'
import { validId } from '../../lib/d3/utils/string.utils';
import { getNodes } from '../../lib/d3/types/node.types';
import { getLinks } from '../../lib/d3/types/link.types';

/// import serviceDescriptions from '../../serviceDescriptions.json';
import { parseServiceDescriptions } from '../../lib/d3/utils/service.utils';
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = this.getState();
	}

	getState() {
		return {
			url: null
		};
	}

	handleGetEditorData = (serviceDescriptions) => {
		this.props.loadServiceDescriptionSuccess(serviceDescriptions || []);
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
		const editorValue = JSON.stringify(
			props.selectedServiceDescriptions.reduce((acc, serviceDes) => [...acc, serviceDes], []),
			null,
			'\t'
		);

		let nodes = getNodes(props.selectedServiceDescriptions);
		let links = getLinks(nodes);

		let selectedService = props.selectedServiceDescriptions[props.selectedServiceDescriptionIndex];

		return (
			<div class="ui container">
				<div class="ui grid">
					<div class="four column row mg mg-top" style={{alignItems: 'baseline'}}>
						<div class="left floated column ">
							<div class="ui action input">
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
						</div>
						<div class="right floated column">
							<ServiceDescriptionSearchContainer />
						</div>
					</div>
					<div class="row">
						<div class="column">
							<Editor
								onData={this.handleGetEditorData}
								value={editorValue}
							/>
						</div>
					</div>
					<div class="row">
						<div class="column">
							<ServiceDescriptionTableContainer />
						</div>
					</div>
				</div>
				<div class="ui orange tall stacked segment">
					<FlowChart
						id={`flow-chart`}
						width="auto"
						height={1200}
						margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
						links={links}
						nodes={nodes}
						selectedServiceId={selectedService ? validId(selectedService.name) : undefined}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	selectedServiceDescriptions: state.serviceDescription.selectedServiceDescriptions,
	selectedServiceDescriptionIndex: state.serviceDescription.selectedServiceDescriptionIndex,
});

const mapDispatchToProps = {
	fetchServiceDescriptionRequest,
	loadServiceDescriptionSuccess
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
