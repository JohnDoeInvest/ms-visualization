import * as d3 from 'd3';
import { ServiceTypes } from '../types/service.types';
import { ServiceNodeParserFactory } from './service.utils';
import { ServiceLink } from '../types/link.types';

/**
 * @returns {Array<ServiceLink>}
 */
export function createServiceLinks(serviceORMs) {
	let serviceLinks = [];
	const serviceNodesDic = new Map();

	for (const serviceORM of serviceORMs) {
		const serviceNode = ServiceNodeParserFactory(serviceORM.type)(serviceORM);
		serviceNodesDic.set(serviceNode.id, serviceNode);
	}

	const getServiceLinks = (serviceORM) => {
		const { type, belongToIds } = serviceORM;
		const sourceServiceNode = ServiceNodeParserFactory(type)(serviceORM);
		
		if (type === ServiceTypes.Microservice) {
			const microserviceLinks = [];
			serviceNodesDic.forEach((serviceNode) => {
				if (serviceNode.type === ServiceTypes.Topic
					|| serviceNode.type === ServiceTypes.Store
					|| serviceNode.type === ServiceTypes.SharedService
				) {
					const targetId = serviceNode.belongToIds.find(id => id === sourceServiceNode.id);
					if (targetId) {
						const serviceLink = new ServiceLink({
							source: sourceServiceNode,
							target: serviceNode,
							belongToId: sourceServiceNode.id
						});
						microserviceLinks.push(serviceLink);
					}
				}
			});
			return microserviceLinks;
		}
		
		if (type === ServiceTypes.RestAPI || type === ServiceTypes.Topic) {
			return belongToIds.map((id) => {
				const targetNode = serviceNodesDic.get(id);
				return new ServiceLink({ source: sourceServiceNode, target: targetNode, belongToId: id });
			});
		}
		return [];
	}

	for (const serviceORM of serviceORMs) {
		serviceLinks = serviceLinks.concat(getServiceLinks(serviceORM));
	}

	return serviceLinks;
}

/**
 * interface LinkCoordinate {
 * 	source: { x0: number; y0: number; x1: number; y1: number; };
 * 	target: { x: number; y: number; x1: number; y1: number; };
 *  data: ServiceLink;
 * }
 * @param {Array<ServiceLink>} serviceLinks 
 * @param {Array<{x0: number; y0: number; x1: number; y1: number; data: ServiceNode}>} nodesData 
 */

export function getLinkCoordinateData(serviceLinks, nodesData) {
	const nodesDataDic = new Map();
	for (const nodeData of nodesData) {
		const id = nodeData.data.id;
		nodesDataDic.set(id, nodeData);
	}

	return serviceLinks.map((serviceLink) => {
		const { source, target, belongToId } = serviceLink;
		const sourceCoordinate = nodesDataDic.get(source.id);
		const targetCoordinate = nodesDataDic.get(target.id);
		return {
			source: {
				x0: sourceCoordinate.x0,
				y0: sourceCoordinate.y0,
				x1: sourceCoordinate.x1,
				y1: sourceCoordinate.y1,
			},
			target: {
				x0: targetCoordinate.x0,
				y0: targetCoordinate.y0,
				x1: targetCoordinate.x1,
				y1: targetCoordinate.y1,
			},
			data: serviceLink
		}
	});
}

export function diagonal({ source, target }) {
	const path = `M ${source.x} ${source.y}
    C ${(source.x + target.x)/2} ${source.y},
      ${(source.x + target.x) / 2} ${target.y},
      ${target.x} ${target.y}`;

	return path;
}

export function getPathData(linkCoordinate) {
	const { source, target, data } = linkCoordinate;
	const sourceCoordinate = getSourceCoordinate(source, data);
	const targetCoordinate = getTargetCoordinate(target, data);
	const path = `M ${sourceCoordinate.x} ${sourceCoordinate.y} ` + 
		`C ${(sourceCoordinate.x + targetCoordinate.x)/2} ${sourceCoordinate.y}, ` + 
		`${(sourceCoordinate.x + targetCoordinate.x) / 2} ${targetCoordinate.y}, ` +
		`${targetCoordinate.x} ${targetCoordinate.y}`;

	return path;
}

function getSourceCoordinate(sourceCoordinate, serviceLink) {
	const { source: sourceService } = serviceLink;
	const width = sourceCoordinate.x1 - sourceCoordinate.x0;
	if (sourceService.type === ServiceTypes.Microservice) {
		const height = (150 / 150) * width;
		const x = sourceCoordinate.x0 + width / 2;
		const y = ((sourceCoordinate.y1 + sourceCoordinate.y0) -height) / 2;
		return { x, y };
	}
	if (sourceService.type === ServiceTypes.RestAPI) {
		const height = (120 / 300) * width;
		const x = sourceCoordinate.x0 + width / 4;
		const y = ((sourceCoordinate.y1 + sourceCoordinate.y0) -height) / 2;
		return { x, y };
	}
	if (sourceService.type === ServiceTypes.Topic) {
		const height = (116 / 300) * width;
		const x = (sourceCoordinate.x0 + sourceCoordinate.x1) / 2;
		const y = (sourceCoordinate.y1 + sourceCoordinate.y0) / 2 + height / 4 + 4;
		return { x, y };
	}

	return {
		x: (sourceCoordinate.x0 + sourceCoordinate.x1) / 2,
		y: (sourceCoordinate.y0 + sourceCoordinate.y1) / 2
	}
}
function getTargetCoordinate(targetCoordinate, serviceLink) {
	const { target: targetService } = serviceLink;
	const width = targetCoordinate.x1 - targetCoordinate.x0;
	if (targetService.type === ServiceTypes.Microservice) {
		const height = (150 / 150) * width;
		const x = targetCoordinate.x0 +  width / 4;
		const y = (targetCoordinate.y0 + targetCoordinate.y1) / 2 + height / 3;
		return { x, y };
	}
	if (targetService.type === ServiceTypes.SharedService) {
		const height = (150 / 287) * width;
		const x = targetCoordinate.x0 +  (width * 3 / 4);
		const y = (targetCoordinate.y0 + targetCoordinate.y1) / 2 - height / 4;
		return { x, y };
	}
	if (targetService.type === ServiceTypes.Store) {
		const height = (150 / 287) * width;
		const x = targetCoordinate.x1;
		const y = (targetCoordinate.y0 + targetCoordinate.y1) / 2;
		return { x, y };
	}
	if (targetService.type === ServiceTypes.Topic) {
		const height = (116 / 300) * width;
		const x = (targetCoordinate.x0 + targetCoordinate.x1) / 2;
		const y = (targetCoordinate.y0 + targetCoordinate.y1) / 2 - height / 4 - 4;
		return { x, y };
	}

	return {
		x: targetCoordinate.x0,
		y: (targetCoordinate.y0 + targetCoordinate.y1) / 2
	}
}
