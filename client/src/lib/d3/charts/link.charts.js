import { diagonal, getLinkCoordinateData, getPathData } from '../utils/link.utils';

export function buildLinks() {
	let context = null;
	let selectedServiceId = null;
	let serviceLinks = [];
	// eslint-disable-next-line func-style
	const builder = function (selection) {
		const rootNodesData = context.svg.datum();
		const nodesData = rootNodesData.filter((nodeData) => !nodeData.data.isGroup);
		const linkCooridinatesData = getLinkCoordinateData(serviceLinks, nodesData);
        
		const links = selection.selectAll('path.link').data(linkCooridinatesData);
		const linksEnter = links.enter().append('svg:path');
		const linksMerge = links.merge(linksEnter);

		linksMerge
			.attr('id', d => `${d.data.source.id}_${d.data.target.id}`)
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