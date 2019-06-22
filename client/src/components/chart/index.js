/* eslint-disable */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { FlowChart } from '../../lib/d3/components';
import { loadServiceDescriptionSuccess } from '../../actions/serviceDescription.action'
import { validId } from '../../lib/d3/utils/string.utils';
import { getNodes, updateNodes } from '../../lib/d3/types/node.types';
import { getLinks } from '../../lib/d3/types/link.types';
import { EventManager, EventNames } from '../../lib/d3/types/event.types';
import serviceDescriptions from '../../serviceDescriptions.json';
// import serviceDescriptions from '../../serviceDescriptions.json';
class ChartContainer extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			updatedNode: undefined,
			nodes: [],
		};
	}

	componentDidMount() {
		EventManager.dispatch.on(EventNames.Collapsable, (updatedNode) => {
			this.setState({ updatedNode });
		});
	}

	componentWillUnmount() {
		EventManager.dispatch.on(EventNames.Collapsable, null );
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (this.props.selectedServiceDescriptions !== nextProps.selectedServiceDescriptions) {
			const nodes = getNodes(nextProps.selectedServiceDescriptions);
			this.setState({ nodes, updatedNode: undefined });
		}
	}



	render(props, state) {
		let nodes = updateNodes(this.state.nodes, this.state.updatedNode);
		let links = getLinks(nodes);

		let selectedService = props.selectedServiceDescriptions[props.selectedServiceDescriptionIndex];

		if (nodes.length === 0) {
			return null;
		}

		return (
			<div class="break-page full-width">
				<h2 class="ui header">Visualization</h2>
				<FlowChart
					id={`flow-chart`}
					width="auto"
					height={900}
					margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
					links={links}
					nodes={nodes}
					selectedServiceId={selectedService ? validId(selectedService.name) : undefined}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	selectedServiceDescriptions: state.serviceDescription.selectedServiceDescriptions,
	selectedServiceDescriptionIndex: state.serviceDescription.selectedServiceDescriptionIndex,
});

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChartContainer);