import * as d3 from 'd3';
import { buildDefs, getPattern } from '../types/defs.types';

export function buildFlowChart() {
	let svg = null;
	let width = 0;
	let height = 0;
	let margin = { top: 0, right: 0, bottom: 0, left: 0 };
	let childComponents = [];
	let nodesData = null;
	let highlight = false;

	// eslint-disable-next-line func-style
	const chart = function (selection) {
		const { top, right, bottom, left } = margin;
		const innerWidth = width - left - right;
		const innerHeight = height - top - bottom;

		const treemapLayout = d3.treemap()
			.size([innerWidth, innerHeight])
			.padding(40);

		const root = d3.hierarchy(nodesData);
		root.sum(d => d.size);

		treemapLayout.tile(d3.treemapSliceDice);
		treemapLayout(root);

		// ref to destroy
		svg = selection;
		svg
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('version', '1.1')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${width} ${height}`);

		svg.datum(root.descendants());

		const defsBuilder = buildDefs().patterns(getPattern('arrow')('arrow-marker'));
		svg.call(defsBuilder);

		let rootGroup = svg.select('g.root');
		if (rootGroup.empty()) {
			rootGroup = svg.append('svg:g').attr('class', 'root');
		}
		rootGroup.attr('transform', `translate(${left}, ${top})`);

		const context = getContext();

		for (const component of childComponents) {
			rootGroup.call(component, context);
		}

        
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
	chart.nodesData = function (value) {
		nodesData = value;
		return chart;
	};
	chart.highlight = function (value) {
		highlight = value;
		return chart;
	}
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

	return chart;
}
