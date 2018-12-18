
export function buildNodes() {
	let context = null;
	// eslint-disable-next-line func-style
	const builder = function (selection) {
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
			.attr('height', d => d.y1 - d.y0);

		descriptionTxt
			.attr('class', 'node-description')
			.attr('x', d => (d.x1 - d.x0) / 2)
			.attr('y', d => (d.y1 - d.y0) / 2)
			.attr('dx', d => d.data.description ? d.data.description.dx : 0)
			.attr('dy', d => d.data.description ? d.data.description.dy : 0)
			.attr('text-anchor', 'middle')
			.style('font-size', '10px')
			.style('font-weight', 700)
			.text(d => d.data.description ? d.data.description.value : '');

		nodes.exit().remove();
	};
  
	builder.context = function (value) {
		context = value;
		return builder;
	};

	return builder;
}