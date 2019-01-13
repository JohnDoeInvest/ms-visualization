import { diagonal, getLinkCoordinateData } from '../utils/link.utils';
export class ServiceLink {
    /**
     * @constructor
     * @param {{source: ServiceNode, target: ServiceNode, belongToId: string }} 
     */
    constructor({ source, target, belongToId }) {
        this.source = source;
        this.target = target;
        this.belongToId = belongToId;
    }
}

export function buildLinks() {
	let context = null;
	let serviceLinks = [];
	// eslint-disable-next-line func-style
	const builder = function (selection) {
		const rootNodesData = context.svg.datum();
		const nodesData = rootNodesData.filter((nodeData) => !nodeData.data.isGroup);
		const linkCooridinatesData = getLinkCoordinateData(serviceLinks, nodesData);
        
		const links = selection.selectAll('path.link').data([]);
		const linksEnter = links.enter().append('svg:path');
		const linksMerge = links.merge(linksEnter);

		linksMerge
			.attr('class', 'link')
			.attr('d', d => diagonal(d))
			.attr('marker-end', 'url(#arrow-marker)');

		links.exit().remove();
	};
    
	builder.serviceLinks = function (value) {
		serviceLinks = value;
		return builder;
	};
  
	builder.context = function (value) {
		context = value;
		return builder;
	};

	return builder;
}