/* eslint-disable */
import { h, Component } from 'preact';
import Editor from '../../components/editor';
import style from './style';
import { FlowChart } from '../../lib/d3/components';
import { getPercentOfNodeValue, getNodeDataOnEditor } from '../../lib/d3/utils/node.utils';
import { getLinksDataOnNodeData } from '../../lib/d3/utils/link.utils';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = this.getState();
	}

	getState() {
		return {
			editorData: undefined,
		};
	}

	handleGetEditorData = (editorData) => {
		this.setState({ editorData });
	} 

	render(props, state) {
		const nodesData = getNodeDataOnEditor(state.editorData);
		const linksData = getLinksDataOnNodeData(nodesData);

		return (
			<div class={style.home}>
				<div class={style.editorContainer}>
					<Editor onData={this.handleGetEditorData} />
				</div>
				{nodesData && 
					(<div class={style.flowContainer}>
						<FlowChart
							id="flow-chart"
							width="auto"
							height={800}
							margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
							linksData={linksData}
							nodesData={nodesData}
						/>
					</div>)}
			</div>
		);
	}
}

export default Home;
