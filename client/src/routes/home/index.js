/* eslint-disable */
import { h, Component } from 'preact';
import style from './style';
import ChartContainer from '../../components/chart';
import EditorContainer from '../../components/editor';
import ServiceDescriptionSearchContainer from '../../components/searchServiceDescription';
import ServiceDescriptionTableContainer from '../../components/serviceDescriptionTable';
import ServiceDescriptionLoader from '../../components/loadServiceDescription';
import PDFExporter from '../../components/pdfExporter';
import ENVTable from '../../components/envTable';
import Printer from '../../components/printer';

export default class Home extends Component {
	render(props, state) {
		return (
			<div class="ui container entry">
				<div class="ui grid">
					<div class="four column row mg mg-top no-print" style={{alignItems: 'baseline'}}>
						<div class="left floated column">
							<ServiceDescriptionLoader />
						</div>
						<div class="right floated column">
							<ServiceDescriptionSearchContainer />
						</div>
					</div>
					<div class="row no-print">
						<div class="column">
							<EditorContainer />
						</div>
					</div>
					<div class="row">
						<div class="column">
							<ServiceDescriptionTableContainer />
						</div>
					</div>
					<div class="row no-print">
						<div class="column">
							<Printer />
							<PDFExporter />
						</div>
					</div>
					<div class="row">
						<div class="column">
							<ChartContainer />
						</div>
					</div>
					<div class="row">
						<div class="column">
							<ENVTable />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
