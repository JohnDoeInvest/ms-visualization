export function buildDefs() {
	let patterns = '';

	// eslint-disable-next-line func-style
	const builder = function (svg) {
		let defs = svg.select('defs');
		if (defs.empty()) {
			defs = svg.append('svg:defs');
		}

		defs.html(patterns);
	};

	builder.patterns = function (value) {
		patterns = value ||  patterns;
		return builder;
	};

	return builder;
}

const arrowPattern = (id) => `
    <marker 
        id=${id}
        refX="0"
        refY="0"
        viewBox="0 -5 10 10"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
    >
        <path 
            d="M0,0L10,-5L10,5"
            fill="#000"
            stroke="none"
            shape-rendering="auto"
        />
    </pattern>
`;

// type: 'arrow'
export function getPattern(type) {
	switch (type) {
		case 'arrow': return arrowPattern;
		default: return arrowPattern;
	}
}