import * as d3 from 'd3';
import { buildDefs, getPattern } from './defs.charts';
import { NODE_SIZE } from '../types/node.types';
import { getLinkDistance } from '../types/link.types';

export function buildFlowChart() {
	let svg = null;
	let rootGroup = null;
	let context = null;
	let width = 0;
	let height = 0;
	let margin = { top: 0, right: 0, bottom: 0, left: 0 };
	let childComponents = [];
	let nodes = [];
	let links = [];
	let simulation = d3.forceSimulation(nodes)
		.force('charge', d3.forceManyBody().distanceMax(20).strength(1))
		.force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
		.force('link', d3.forceLink().links(links).id(d => d.id).distance(d => getLinkDistance(d)))
		.force('collision', d3.forceCollide().radius(d => NODE_SIZE))
		// .on('tick', buildGraph);

	// eslint-disable-next-line func-style
	const chart = function (selection) {
		const { top, right, bottom, left } = margin;
		const innerWidth = width - left - right;
		const innerHeight = height - top - bottom;

		// ref to destroy
		svg = selection;
		svg
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('version', '1.1')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width} ${height}`);

		const defsBuilder = buildDefs().patterns(getPattern('arrow')('arrow-marker') + '\n' + getPattern('arrow')('arrow-marker-highlight'));
		svg.call(defsBuilder);

		rootGroup = svg.select('g.root');
		if (rootGroup.empty()) {
			rootGroup = svg.append('svg:g').attr('class', 'root');
		}
		rootGroup.attr('transform', `translate(${left}, ${top})`);
		
		svg.datum({ nodes, links });

		context = getContext();
		
		simulation.nodes(nodes)
			.force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
			.force('link', d3.forceLink().links(links).id(d => d.id).distance(d => getLinkDistance(d)))
			// .on('tick', buildGraph)
			.stop();

		for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
			simulation.tick();
		}

		buildGraph();

	};

	chart.width = function (value) {
		width = value;
		return chart;
	};
	chart.height = function (value) {
		height = value;
		return chart;
	};
	chart.margin = function (value) {
		margin = margin || value;
		return chart;
	};
	chart.childComponents = function (value) {
		childComponents = value;
		return chart;
	};
	chart.nodes = function (value) {
		nodes = value;
		return chart;
	};
	chart.links = function (value) {
		links = value;
		return chart;
	};
	chart.destroy = function () {
		for (const component of childComponents) {
			if (component.destroy) {
				component.destroy();
			}
		}
		return svg && svg.remove();
	};

	function getContext() {
		return { width, height, margin, svg };
	}

	function buildGraph() {
		for (const component of childComponents) {
			rootGroup.call(component, context);
		}
	}

	return chart;
}
