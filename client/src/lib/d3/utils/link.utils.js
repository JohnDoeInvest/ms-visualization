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
	const sourceCoordinate = {
		x: source.x1,
		y: (source.y0 + source.y1) / 2
	};
	const targetCoordinate = {
		x: target.x0,
		y: (target.y0 + target.y1) / 2
	};

	const path = `M ${sourceCoordinate.x} ${sourceCoordinate.y} ` + 
		`C ${(sourceCoordinate.x + targetCoordinate.x)/2} ${sourceCoordinate.y}, ` + 
		`${(sourceCoordinate.x + targetCoordinate.x) / 2} ${targetCoordinate.y}, ` +
		`${targetCoordinate.x} ${targetCoordinate.y}`;

	return path;
}
