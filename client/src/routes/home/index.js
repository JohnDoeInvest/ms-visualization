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
			<div class="ui container entry main">
				<div class="ui grid">
					<div class="row mg mg-top no-print">
						<h1 class="ui header">MS-Visualization</h1>
					</div>
					<div class="row no-print">
						<ServiceDescriptionSearchContainer />
					</div>
					<div class="row no-print">
						<ServiceDescriptionLoader />
					</div>
					<div class="row no-print">
						<Printer />
						<PDFExporter />
					</div>
					<div class="row no-print">
						<EditorContainer />
					</div>
					<div class="row">
						<ServiceDescriptionTableContainer />
					</div>
					<div class="row">
						<ChartContainer />
					</div>
					<div class="row">
						<ENVTable />
					</div>
				</div>
			</div>
		);
	}
}
