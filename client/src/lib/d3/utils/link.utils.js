export function diagonal({ source, target }) {
	const path = `M ${source.x} ${source.y}
    C ${(source.x + target.x)/2} ${source.y},
      ${(source.x + target.x) / 2} ${target.y},
      ${target.x} ${target.y}`;

	return path;
}

// { source: { x, y }, target: { x, y }}
export function getLinksCoordinateByNodes(links, nodes) {
	const linkCoordiantes = [];
	const nodeMap = getNodeMap(nodes);

	for (const link of links) {
		const sourceId = link.source;
		const targetId = link.target;

		if (nodeMap.has(sourceId) && nodeMap.has(targetId)) {
			const sourceData = nodeMap.get(sourceId);
			const targetData = nodeMap.get(targetId);
			linkCoordiantes.push({
				source: {
					x: sourceData.x1,
					y: (sourceData.y0 + sourceData.y1) / 2
				},
				target: {
					x: targetData.x0,
					y: (targetData.y0 + targetData.y1) / 2
				}
			});
		}
	}

	return linkCoordiantes;
}

export function getLinksDataOnNodeData(nodesData) {
	if (nodesData) {
		const linksData = [];
		const { children } = nodesData;
		const flatChildren = children.reduce((accFlatChildren, child) => [...accFlatChildren, ...child.children], []);
        
		const mircroserviceNode = flatChildren.find(c => c.id === 'microservice');
    
		if (mircroserviceNode) {
			const microserviceId = mircroserviceNode.id;
    
			for (const node of flatChildren) {
				if (node.rootId === 'restAPI') {
					linksData.push({ source: node.id, target: microserviceId });
					// eslint-disable-next-line brace-style
				} else if (node.rootId === 'topics') {
					linksData.push({ source: node.id, target: microserviceId });
					linksData.push({ source: microserviceId, target: node.id });
					// eslint-disable-next-line brace-style
				} else if (node.rootId === 'stores') {
					linksData.push({ source: microserviceId, target: node.id });
				}
			}
		}
    
		return linksData;
	}
}

function getNodeMap(nodes) {
	const nodeMap = new Map();
    
	for (const node of nodes) {
		const id = node.data.id;
		nodeMap.set(id, node);
	}

	return nodeMap;
}
