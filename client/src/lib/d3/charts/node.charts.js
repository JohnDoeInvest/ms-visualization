
import * as d3 from 'd3';
import { limitCharacters } from '../utils/string.utils';
import { buildTooltip } from './tooltip.charts';
import { GET_API_ICON } from '../types/icon.types';
import { NODE_SIZE } from '../types/node.types';
import { getIconByNode } from '../utils/icon.utils';
import { EventManager, EventNames } from '../types/event.types';
import { ServiceTypes } from '../types/service.types';

const dispatch = d3.dispatch(['event']);

export function buildNodes() {
	let context = null;
	let tooltip = buildTooltip();
	let selectionRef = null;
	let selectedServiceId = null;
	// eslint-disable-next-line func-style
	const builder = function (selection) {
		selectionRef = selection;
		selection.call(tooltip);

		const { nodes } = context.svg.datum();

		const nodeGroups = selection.selectAll('.node').data(nodes);
		const nodeGroupsEnter = nodeGroups.enter().append('g');
		const nodeGroupMerge = nodeGroups.merge(nodeGroupsEnter).attr('class', 'node');

		nodeGroupsEnter.append('svg:g');
		nodeGroupsEnter.append('svg:text');

		nodeGroupMerge
			.attr('id', d => d.id)
			.attr('class', 'node')
			.attr('transform', d => `translate(${d.x}, ${d.y})`)
			.style('cursor', d => d.metadata.canClickable ? 'pointer' : 'auto')
			.style('visibility', 'visible')
			.on('click', function (d) {
				if (d.type === ServiceTypes.RestAPI && d.metadata.canClickable) {
					const updatedNode = {
						...d,
						metadata: {
							...d.metadata,
							isCollapsed: !d.metadata.isCollapsed
						}
					};

					EventManager.dispatch.collapse.call(EventNames.Collapsable, null, updatedNode);
				}
			});

		const iconsGroup = nodeGroupMerge.select('g');
		const textsGroup = nodeGroupMerge.select('text');

		iconsGroup
			.attr('class', 'node-icon')
			.html(d => getIconByNode(d))

		iconsGroup.select('svg')
			.attr('width', NODE_SIZE * 2)
			.attr('height', function () {
				const bbox = d3.select(this).node().getBBox();
				const scale = bbox.width / bbox.height;
				return 2 * NODE_SIZE / scale;
			});

		textsGroup
			.attr('class', 'node-description')
			.attr('x', NODE_SIZE)
			.attr('y', function () {
				const bbox = d3.select(this.parentNode).node().getBBox();
				return bbox.height / 2;
			})
			.attr('dy', 4)
			.attr('text-anchor', 'middle')
			.text(d => limitCharacters(d.name, 12));

		nodeGroups.exit().remove();

		// descriptionTxt
		// 	.attr('class', 'node-description')
		// 	.attr('x', d => (d.x1 - d.x0) / 2)
		// 	.attr('y', d => (d.y1 - d.y0) / 2)
		// 	.attr('dy', 3)
		// 	// .attr('dx', d => d.data.description ? d.data.description.dx : 0)
		// 	// .attr('dy', d => d.data.description ? d.data.description.dy : 0)
		// 	.attr('text-anchor', 'middle')
		// 	.text(d => d.data.name ? limitCharacters(d.data.name, 7) : '')
		// 	// .on('mouseover', function (d) {
		// 	// 	tooltip.renderContent(
		// 	// 		`<span>${d.data.description ? d.data.description.value : ''}</span>`, 
		// 	// 		{ top: d3.event.pageY, left: d3.event.pageX }
		// 	// 	);
		// 	// })
		// 	// .on('mouseout', function () {
		// 	// 	tooltip.hide();
		// 	// });

		// nodes.exit().remove();
	};
  
	builder.context = function (value) {
		context = value;
		return builder;
	};

	builder.selectedServiceId = function (value) {
		selectedServiceId = value;
		return builder;
	}

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

export function toggleNodes(rootNodeClass, collapsedNodesMap) {
	const rootSelection = d3.select(`.${rootNodeClass}`);
	if (!rootSelection.empty()) {
		const nodes = rootSelection.selectAll('.node');

		nodes.each(function (nodeData) {
			const currentNode = d3.select(this);
			const isCollasped = checkNodeCollapsed(nodeData, collapsedNodesMap);

			currentNode
				.transition()
				.duration(750)
				.ease(d3.easeLinear)
				.style('visibility',  isCollasped ? 'hidden' : 'visible');
		})
	}
}

function checkNodeCollapsed(currentNode, collapsedNodesMap) {
	let flattenChildren = [];

	for (const node of collapsedNodesMap.values()) {
		flattenChildren = flattenChildren.concat(node.children || []);
	}

	const isCollasped = flattenChildren.find(child => child.id === currentNode.id);

	return !!isCollasped;
}

