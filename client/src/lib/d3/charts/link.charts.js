import * as d3 from 'd3';
import d3Transform from 'd3-transform';
import { diagonal, getLinkCoordinateData, getPathData } from '../utils/link.utils';
import { ServiceTypes } from '../types/service.types';
import { ConnectorIdDics } from '../types/icon.types';

export function buildLinks() {
	let context = null;
	let selectedServiceId = null;
	let serviceLinks = [];
	// eslint-disable-next-line func-style
	const builder = function (selection) {
		const rootNodesData = context.svg.datum();
		const nodesData = rootNodesData.filter((nodeData) => !nodeData.data.isGroup);
		const linkCooridinatesData = parseServiceLinks(serviceLinks);

		const links = selection.selectAll('path.link').data(linkCooridinatesData);
		const linksEnter = links.enter().append('svg:path');
		const linksMerge = links.merge(linksEnter);

		linksMerge
			.attr('class', 'link')
			.classed('highlight', d => d.data.belongToId === selectedServiceId)
			.attr('d', d => getPathData(d))
			.attr('marker-end', d => d.data.belongToId === selectedServiceId ? 'url(#arrow-marker-highlight)' : 'url(#arrow-marker)');

		links.exit().remove();
	};
    
	builder.serviceLinks = function (value) {
		serviceLinks = value;
		return builder;
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

function parseServiceLinks(serviceLinks) {
	let linkCoordinates = [];
	for (const serviceLink of serviceLinks) {
		const { source, target, belongToId } = serviceLink;
		const pathIds = getPathIds(serviceLink);
		if (pathIds && pathIds.length === 2) {
			const [sourcePahtId, targetPathId] = pathIds;
			const bboxOfSourcePath = getBBoxOfPath(source.id, sourcePahtId);
			const bboxOfTargetPath = getBBoxOfPath(target.id, targetPathId);
			
			if (bboxOfSourcePath && bboxOfTargetPath) {
				linkCoordinates.push({
					source: {...bboxOfSourcePath},
					target: {...bboxOfTargetPath},
					data: serviceLink
				});
			}
		}
	}
	return linkCoordinates;
}

function getPathIds(serviceLink) {
	const { source, target } = serviceLink;
	if (source.type === ServiceTypes.RestAPI && target.type === ServiceTypes.Microservice) {
		return [ConnectorIdDics.GET_API.right, ConnectorIdDics.MICROSERVICE.left];
	}
	if (source.type === ServiceTypes.Microservice && target.type === ServiceTypes.Store) {
		return [ConnectorIdDics.MICROSERVICE.right, ConnectorIdDics.DB.left];
	}
	if (source.type === ServiceTypes.Microservice && target.type === ServiceTypes.SharedService) {
		return [ConnectorIdDics.MICROSERVICE.bottom, ConnectorIdDics.DB_SHARED.left];
	}
	if (source.type === ServiceTypes.Microservice && target.type === ServiceTypes.Topic) {
		return [ConnectorIdDics.MICROSERVICE.bottomRight, ConnectorIdDics.KAFKA.left];
	}
	if (source.type === ServiceTypes.Topic && target.type === ServiceTypes.Microservice) {
		return [ConnectorIdDics.KAFKA.right, ConnectorIdDics.MICROSERVICE.topRight];
	}
}

function getBBoxOfPath(parentId, pathId) {
	const parent = d3.select(`#${parentId}`);
	const nodeImg = parent.select('.node-img');
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

