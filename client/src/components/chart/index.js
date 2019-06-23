/* eslint-disable */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { loadServiceDescriptionSuccess } from '../../actions/serviceDescription.action'
import { FlowChart } from '../../lib/d3/components';
import { getNodes } from '../../lib/d3/types/node.types';
import { getLinks } from '../../lib/d3/types/link.types';

class ChartContainer extends Component {
	constructor(props) {
		super(props);
	}

	render(props, state) {
		let nodes = getNodes(this.props.selectedServiceDescriptions);
		let links = getLinks(nodes);

		if (nodes.length === 0) {
			return null;
		}

		return (
			<div class="break-page full-width">
				<h2 class="ui header">Visualization</h2>
				<FlowChart
					id={`flow-chart`}
					width="auto"
					height={1200}
					margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
					links={links}
					nodes={nodes}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	selectedServiceDescriptions: state.serviceDescription.selectedServiceDescriptions,
});

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChartContainer);
