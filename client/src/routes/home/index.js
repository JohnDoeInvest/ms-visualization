/* eslint-disable */
import { h, Component } from 'preact';
import style from './style';
import ChartContainer from '../../components/chart';
import EditorContainer from '../../components/editor';
import ServiceDescriptionSearchContainer from '../../components/searchServiceDescription';
import ServiceDescriptionTableContainer from '../../components/serviceDescriptionTable';
import ServiceDescriptionLoader from '../../components/loadServiceDescription';
import ENVTable from '../../components/envTable';
import Printer from '../../components/printer';

export default class Home extends Component {
	render(props, state) {
		return (
			<div class="ui container entry main reset-float">
				<h1 class="ui header mg mg-top no-print">MS-Visualization</h1>
				<section class="content-fluid page-break no-print">
					<ServiceDescriptionSearchContainer />
				</section>
				<section class="content-fluid page-break no-print">
					<ServiceDescriptionLoader />
				</section>
				<section class="content-fluid page-break no-print">
					<Printer />
				</section>
				<section class="content-fluid page-break no-print">
					<EditorContainer />
				</section>
				<section class="content-fluid page-break">
					<ServiceDescriptionTableContainer />
				</section>
				<section class="content-fluid page-break">
					<ChartContainer />
				</section>
				<section class="content-fluid page-break">
					<ENVTable />
				</section>
			</div>
		);
	}
}
