/* eslint-disable */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import Editor from './components/Editor';
import { loadServiceDescriptionSuccess } from '../../actions/serviceDescription.action'

class EditorContainer extends Component {
	constructor(props) {
		super(props);
	}

	handleGetEditorData = (serviceDescriptions) => {
		this.props.loadServiceDescriptionSuccess(serviceDescriptions || []);
	}

	render(props, state) {
		const editorValue = JSON.stringify(
			props.selectedServiceDescriptions.reduce((acc, serviceDes) => [...acc, serviceDes], []),
			null,
			'\t'
		);

		return (
			<Editor onData={this.handleGetEditorData} value={editorValue} />
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	selectedServiceDescriptions: state.serviceDescription.selectedServiceDescriptions,
});

const mapDispatchToProps = {
	loadServiceDescriptionSuccess
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorContainer);
