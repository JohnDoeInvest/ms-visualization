
import * as d3 from 'd3';
import { limitCharacters } from '../utils/string.utils';
import { buildTooltip } from './tooltip.types';

export function buildNodes() {
	let context = null;
	let tooltip = buildTooltip();
	let selectionRef = null
	// eslint-disable-next-line func-style
	const builder = function (selection) {
		selectionRef = selection;
		selection.call(tooltip);

		const rootData = context.svg.datum();
		const nodes = selection.selectAll('g.node').data(rootData);
		const nodesEnter = nodes.enter().append('g');

		nodesEnter.append('svg:image').attr('class', 'node-img');
		nodesEnter.append('svg:text').attr('class', 'node-description');

		const nodesMerge = nodes.merge(nodesEnter);
		const image = nodesMerge.select('image.node-img');
		const descriptionTxt = nodesMerge.select('text.node-description');

		nodesMerge
			.attr('class', 'node')
			.attr('transform', (d) => 'translate(' + [d.x0, d.y0] + ')');

		image
			.attr('class', 'node-img')
			.attr('xlink:href', d => d.data.icon)
			.attr('width', d => d.x1 - d.x0)
			.attr('height', d => d.y1 - d.y0)
			.attr('viewBox', d => `0 0 ${d.x1 - d.x0} ${d.y1 - d.y0}`);

		descriptionTxt
			.attr('class', 'node-description')
			.attr('x', d => alignText(d))
			.attr('y', d => (d.y1 - d.y0) / 2)
			// .attr('dx', d => d.data.description ? d.data.description.dx : 0)
			// .attr('dy', d => d.data.description ? d.data.description.dy : 0)
			.attr('text-anchor', 'middle')
			.text(d => d.data.description ? limitCharacters(d.data.description.value, 7) : '')
			.on('mouseover', function (d) {
				tooltip.renderContent(
					`<span>${d.data.description ? d.data.description.value : ''}</span>`, 
					{ top: d3.event.pageY, left: d3.event.pageX }
				);
			})
			.on('mouseout', function () {
				tooltip.hide();
			});

		nodes.exit().remove();
	};
  
	builder.context = function (value) {
		context = value;
		return builder;
	};

	builder.destroy = function () {
		tooltip.destroy();
		d3.select(selectionRef).remove();
	}

	function alignText(d) {
		const { data, x0, x1, y0, y1 } = d;
		const width = x1 - x0;
		const { rootId } = data;

		switch (rootId) {
			case 'microservices': return width / 2;
			case 'restAPI': return (width * 2) / 3;
			case 'stores': return (width * 2) / 3;
			case 'topics': return (width * 3) / 4;
			default: return width / 2;
		}
	}

	return builder;
}