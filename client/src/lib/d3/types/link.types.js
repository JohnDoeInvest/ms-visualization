import { getLinksCoordinateByNodes, diagonal } from '../utils/link.utils';
export function buildLinks() {
	let context = null;
	let data = [];
	// eslint-disable-next-line func-style
	const builder = function (selection) {
		const rootData = context.svg.datum();
		const linkCoordinatesData = getLinksCoordinateByNodes(data, rootData);
        
		const links = selection.selectAll('path.link').data(linkCoordinatesData);
		const linksEnter = links.enter().append('svg:path');
		const linksMerge = links.merge(linksEnter);

		linksMerge
			.attr('class', 'link')
			.attr('d', d => diagonal(d))
			.attr('marker-end', 'url(#arrow-marker)');

		links.exit().remove();
	};
    
	builder.data = function (value) {
		data = value;
		return builder;
	};
  
	builder.context = function (value) {
		context = value;
		return builder;
	};

	return builder;
}