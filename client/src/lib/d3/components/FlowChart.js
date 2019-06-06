/* eslint-disable */
import { h, Component } from 'preact';
import * as d3 from 'd3';
import { buildFlowChart } from '../charts/flow.charts';
import { createConfigurationBuilder } from '../charts/base.charts';
import { buildNodes } from '../charts/node.charts';
import { buildLinks } from '../charts/link.charts';
import { buildDefs, getPattern } from '../charts/defs.charts';

class FlowChart extends Component {
    containerEl = null;
    constructor(props) {
        super(props);
        this.state = { reload: false };
    }

    componentDidMount() {
        this.containerEl = document.getElementById(this.props.id);
        this.setState({ reload: true });
    }

    componentDidUpdate() {
        this.redraw();
    }

    redraw() {
        if (!this.containerEl) {
            this.containerEl = document.getElementById(this.props.id);
        }

        const dimension = this.getContainerDimension();
        const svg = d3.select(this.containerEl).select('svg');

        const nodesBuilder = buildNodes();
        const nodes = createConfigurationBuilder(
            nodesBuilder, 
            builder => builder.selectedServiceId(this.props.selectedServiceId))
        ('nodes-root-group');

        const linksBuilder = buildLinks();
        const links = createConfigurationBuilder(
            linksBuilder, 
            builder => builder
                .selectedServiceId(this.props.selectedServiceId)
        )('links-root-group');

        const chart = buildFlowChart();

        chart
            .width(dimension.containerWidth)
            .height(dimension.containerHeight)
            .margin(this.props.margin)
            .childComponents([nodes, links])
            .nodes(this.props.nodes)
            .links(this.props.links);
        
        svg.call(chart);

    }

    getContainerDimension() {
        const { width, height } = this.props;
        const clientRect = this.containerEl.getBoundingClientRect();
        const containerWidth = (width === 'auto') ? clientRect.width : width;
        const containerHeight = (height === 'auto') ? clientRect.height : height;
        return { containerWidth, containerHeight };
    }

    render(props, state) {
        return (
            <div 
                id={props.id}
                className="chart chart-flow"
            >
                <svg className="svg-container" />
            </div>
        )
    }
}

export default FlowChart;
