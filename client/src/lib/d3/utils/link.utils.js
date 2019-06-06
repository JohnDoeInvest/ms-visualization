// import * as d3 from 'd3';

// export function diagonal({ source, target }) {
// 	const path = `M ${source.x} ${source.y}
//     C ${(source.x + target.x)/2} ${source.y},
//       ${(source.x + target.x) / 2} ${target.y},
//       ${target.x} ${target.y}`;

// 	return path;
// }

export function getPathData({ source, target }) {
	const path = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
	return path;
}
