import * as d3 from 'd3';
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
		// const linkCooridinatesData = getLinkCoordinateData(serviceLinks, nodesData);

		// console.log('linkCooridinatesData', serviceLinks, linkCooridinatesData)
		const linkCooridinatesData = parseServiceLinks(serviceLinks);
        console.log('linkCoordinates', linkCooridinatesData);
		const links = selection.selectAll('path.link').data(linkCooridinatesData);
		const linksEnter = links.enter().append('svg:path');
		const linksMerge = links.merge(linksEnter);

		linksMerge
			.attr('class', 'link')
			.classed('highlight', d => d.data.belongToId === selectedServiceId)
			.attr('d', d => getPathData(d))
			.attr('marker-end', 'url(#arrow-marker)');

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
					source: {x: bboxOfSourcePath.x, y: bboxOfSourcePath.y },
					target: {x: bboxOfTargetPath.x, y: bboxOfTargetPath.y },
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
	const pathEl = d3.select(`#${parentId}`).select(`#${pathId}`);
	if (!pathEl.empty()) {
		return pathEl.node().getBBox();
	}
}