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
import { getContainerDimension } from '../utils/base.utils'

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
        this.initializeCollapsedMap();
    }

    componentDidUpdate() {
        this.redraw();
        this.initializeCollapsedMap();
    }

    componentWillUnmount() {
        try {
            EventManager.dispatch.collapse.on(EventNames.Collapsable, null);
            EventManager.dispatch.collapse.on(EventNames.Highlight, null);
        } catch (err) {
            // no need to handle
        }
    }

    initializeChart = () => {
        this.containerEl = document.getElementById(this.props.id);
        this.svg = d3.select(this.containerEl).select('svg');

        const dimension = getContainerDimension(this.containerEl, {width: this.props.width, height: this.props.height})
        const nodes = createConfigurationBuilder(this.nodesBuilder, builder => builder)('nodes-root-group');
        const links = createConfigurationBuilder(this.linksBuilder,  builder => builder)('links-root-group');

        this.chart
            .width(dimension.containerWidth)
            .height(dimension.containerHeight)
            .margin(this.props.margin)
            .childComponents([nodes, links]);

        this.redraw();
    }

    initializeCollapsedMap = () => {
        this.collapsedNodesMap.clear();
        if (this.props.nodes && Array.isArray(this.props.nodes)) {
            for (const node of this.props.nodes) {
                if (node.metadata.isCollapsed) {
                    this.collapsedNodesMap.set(node.id, node);
                }
            }
        }
        toggleNodes('nodes-root-group', this.collapsedNodesMap);
        toggleLinks('links-root-group', this.collapsedNodesMap);
    }

    redraw = () => {
        if (!this.containerEl) {
            this.containerEl = document.getElementById(this.props.id);
            this.svg = d3.select(this.containerEl).select('svg');
        }

        this.chart
            .nodes(this.props.nodes)
            .links(this.props.links);
        
        this.svg.call(this.chart);
    }

    handleEvents = () => {
        EventManager.dispatch.collapse.on(EventNames.Collapsable, (data) => {
            if (data.metadata.canClickable) {
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

    render(props) {
        return (
            <div id={props.id} className={`chart chart-flow ${this.props.className || ''}`}>
                <svg className="svg-container" />
            </div>
        )
    }
}

export default FlowChart;
