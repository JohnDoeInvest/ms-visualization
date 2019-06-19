import * as d3 from 'd3';
import d3Transform from 'd3-transform';
import { diagonal, getLinkCoordinateData, getPathData, getLinkPath } from '../utils/link.utils';
import { ServiceTypes } from '../types/service.types';
import { ConnectorIdDics } from '../types/icon.types';

export function buildLinks() {
	let context = null;
	let selectedServiceId = null;

	// eslint-disable-next-line func-style
	const builder = function (selection) {
		const { links } = context.svg.datum();

		const linkGroups = selection.selectAll('.link').data(links);
		const linkGroupsEnter = linkGroups.enter().append('g');
		const linkGroupMerge = linkGroups.merge(linkGroupsEnter).attr('class', 'link');

		linkGroupsEnter.append('svg:path');
		linkGroupMerge
			.classed('highlight', d => d.belongToId === selectedServiceId)

		linkGroupMerge.select('path')
			.attr('d', d => getPath(d))
			.attr('marker-end', d => d.belongToId === selectedServiceId ? 'url(#arrow-marker-highlight)' : 'url(#arrow-marker)');


		linkGroups.exit().remove();
		// const rootNodesData = context.svg.datum();
		// const nodesData = rootNodesData.filter((nodeData) => !nodeData.data.isGroup);
		// const linkCooridinatesData = parseServiceLinks(serviceLinks);

		// const links = selection.selectAll('path.link').data(linkCooridinatesData);
		// const linksEnter = links.enter().append('svg:path');
		// const linksMerge = links.merge(linksEnter);

		// linksMerge
		// 	.attr('class', 'link')
		// 	.classed('highlight', d => d.data.belongToId === selectedServiceId)
		// 	.attr('d', d => getPathData(d))
		// 	.attr('marker-end', d => d.data.belongToId === selectedServiceId ? 'url(#arrow-marker-highlight)' : 'url(#arrow-marker)');

		// links.exit().remove();
	};
    
	builder.selectedServiceId = function (value) {
		selectedServiceId = value;
		return builder;
	}
  
	builder.context = function (value) {
		context = value;
		return builder;
	};

	return builder;
}

function getPath(link) {
	const { source, target, belongToId } = link;
	const pathIds = getPathIds(link);
	if (pathIds && pathIds.length === 2) {
		const [sourcePahtId, targetPathId] = pathIds;
		const bboxOfSourcePath = getBBoxOfPath(source.id, sourcePahtId);
		const bboxOfTargetPath = getBBoxOfPath(target.id, targetPathId);

		if (bboxOfSourcePath && bboxOfTargetPath) {
			return getLinkPath({
				source: bboxOfSourcePath,
				target: bboxOfTargetPath,
			});
		}
	}
}

function getPathIds(link) {
	const { sourceNode, targetNode } = link;
	if (sourceNode.type === ServiceTypes.RestAPI && targetNode.type === ServiceTypes.RestAPI) {
		return [ConnectorIdDics.GET_API.right, ConnectorIdDics.GET_API.right];
	}
	if (sourceNode.type === ServiceTypes.RestAPI && targetNode.type === ServiceTypes.Microservice) {
		return [ConnectorIdDics.GET_API.right, ConnectorIdDics.MICROSERVICE.left];
	}
	if (sourceNode.type === ServiceTypes.Microservice && targetNode.type === ServiceTypes.DB) {
		return [ConnectorIdDics.MICROSERVICE.right, ConnectorIdDics.DB.left];
	}
	if (sourceNode.type === ServiceTypes.Microservice && targetNode.type === ServiceTypes.SharedDB) {
		return [ConnectorIdDics.MICROSERVICE.bottom, ConnectorIdDics.DB_SHARED.left];
	}
	if (sourceNode.type === ServiceTypes.Microservice && targetNode.type === ServiceTypes.Topic) {
		return [ConnectorIdDics.MICROSERVICE.bottomRight, ConnectorIdDics.KAFKA.left];
	}
	if (sourceNode.type === ServiceTypes.Topic && targetNode.type === ServiceTypes.Microservice) {
		return [ConnectorIdDics.KAFKA.right, ConnectorIdDics.MICROSERVICE.topRight];
	}
}

function getBBoxOfPath(parentId, pathId) {
	const parent = d3.select(`#${parentId}`);
	const nodeImg = parent.select('.node-icon');
	const svg = parent.select('svg');
	const path = svg.select(`#${pathId}`);

	const svgCoord = getScreenCoords(svg.node());
	const imgBBox = nodeImg.node().getBBox();
	const svgBBox = svg.node().getBBox();
	const pathBBox = path.node().getBBox();
	const scale = svgBBox.width / svgBBox.height;
	const width = imgBBox.width;
	const height = width / scale;
	const dx = pathBBox.x * width / svgBBox.width;
	const dy = pathBBox.y * height / svgBBox.height;
	const x = svgCoord.x + dx;
	const y = svgCoord.y + dy;

	return { x, y };
}

function getScreenCoords(node) {
	const ctm = node.getCTM();
	const x = node.getAttribute('cx');
	const y = node.getAttribute('cy');
    const xn = ctm.e + x * ctm.a + y * ctm.c;
	const yn = ctm.f + x * ctm.b + y * ctm.d;
	
    return { x: xn, y: yn };
}

