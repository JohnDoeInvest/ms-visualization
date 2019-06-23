/* eslint-disable */
import { h, Component } from 'preact';
import * as d3 from 'd3';
import { buildFlowChart } from '../charts/flow.charts';
import { createConfigurationBuilder } from '../charts/base.charts';
import { buildNodes, toggleNodes } from '../charts/node.charts';
import { buildLinks, toggleLinks } from '../charts/link.charts';
import { buildDefs, getPattern } from '../charts/defs.charts';
import { EventManager, EventNames } from '../types/event.types';
import { validId } from '../utils/string.utils';
import { buildHighlight } from '../charts/highlight.charts';

class FlowChart extends Component {
    containerEl = null;
    chart;
    svg;
    nodesBuilder;
    linksBuilder;
    collapsedNodesMap = new Map();

    constructor(props) {
        super(props);
        this.chart = buildFlowChart();
        this.nodesBuilder = buildNodes();
        this.linksBuilder = buildLinks();
    }

    componentDidMount() {
        this.initializeChart();
        this.handleEvents();
    }

    componentDidUpdate() {
        this.collapsedNodesMap.clear();
        this.redraw();
    }

    componentWillUnmount() {
        EventManager.dispatch.collapse.on(EventNames.Collapsable, null);
        EventManager.dispatch.collapse.on(EventNames.Highlight, null);
    }

    initializeChart() {
        this.containerEl = document.getElementById(this.props.id);
        this.svg = d3.select(this.containerEl).select('svg');

        const dimension = this.getContainerDimension();
        const nodes = createConfigurationBuilder(
            this.nodesBuilder, 
            builder => builder)
        ('nodes-root-group');

        const links = createConfigurationBuilder(
            this.linksBuilder, 
            builder => builder)
        ('links-root-group');

        this.chart
            .width(dimension.containerWidth)
            .height(dimension.containerHeight)
            .margin(this.props.margin)
            .childComponents([nodes, links]);

        this.redraw();
    }

    handleEvents() {
        EventManager.dispatch.collapse.on(EventNames.Collapsable, (data) => {
            if (data.metadata.isCollapsed) {
                if (this.collapsedNodesMap.has(data.id)) {
                    this.collapsedNodesMap.delete(data.id);
                } else {
                    this.collapsedNodesMap.set(data.id, data);
                }
            }

            toggleNodes('nodes-root-group', this.collapsedNodesMap);
            toggleLinks('links-root-group', this.collapsedNodesMap);
        });

        EventManager.dispatch.highlight.on(EventNames.Highlight, (data) => {
            const microserviceId = data ? validId(data.name) : undefined;
            buildHighlight('links-root-group', microserviceId);
        });
    }

    redraw() {
        if (!this.containerEl) {
            this.containerEl = document.getElementById(this.props.id);
            this.svg = d3.select(this.containerEl).select('svg');
        }

        this.chart
            .nodes(this.props.nodes)
            .links(this.props.links);
        
        this.svg.call(this.chart);
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
