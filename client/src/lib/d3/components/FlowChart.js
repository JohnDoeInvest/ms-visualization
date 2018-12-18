/* eslint-disable */
import { h, Component } from 'preact';
import * as d3 from 'd3';
import { buildFlowChart } from '../charts/flow.charts';
import { createConfigurationBuilder } from '../types/base.types';
import { buildNodes } from '../types/node.types';
import { buildLinks } from '../types/link.types';

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
            builder => builder)
        ('nodes-root-group');

        const linksBuilder = buildLinks();
        const links = createConfigurationBuilder(
            linksBuilder, 
            builder => builder.data(this.props.linksData))
        ('links-root-group');

        const chart = buildFlowChart();
        chart
            .width(dimension.containerWidth)
            .height(dimension.containerHeight)
            .margin(this.props.margin)
            .childComponents([links, nodes])
            .nodesData(this.props.nodesData);
        
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
                <svg />
            </div>
        )
    }
}

export default FlowChart;
