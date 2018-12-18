export const getPercentOfNodeValue = (nums) => 1000 / nums;
export const SOURCE_ASSET_BASE_URI = '/assets/d3';

export function getNodeDataOnEditor(editorData) {
	if (editorData) {
		const nodesData = {
			id: 'root',
			name: 'root',
			type: 'group',
			children: []
		};
    
		if (editorData.restAPI) {
			const restAPINodeData = getRestAPINodeData(editorData.restAPI, 'restAPI');
			if (restAPINodeData) {
				nodesData.children.push(restAPINodeData);
			}
		}
    
		if (editorData.produces && editorData.consumes) {
			const topicsNodeData = getTopicsNodeData(editorData, 'topics');
			if (topicsNodeData) {
				nodesData.children.push(topicsNodeData);
			}
		}
  
		if (editorData.stores) {
			const storesNodeData = getStoresNodeData(editorData.stores, 'stores');
			if (storesNodeData) {
				nodesData.children.push(storesNodeData);
			}
		}
    
		addMicroserviceNodeData(editorData, nodesData, 'microservices');
  
		return nodesData;
	}
  
  
	return undefined;
}

function addMicroserviceNodeData(editorData, nodesData, rootId) {
	const { children } = nodesData;
	const positionOfMicroservice = children.length / 2;
	const microserviceNodeData = {
		id: rootId,
		name: rootId,
		type: 'group',
		children: [
			{
				id: `microservice`,
				rootId,
				description: {
					value: 'service',
					dx: 0,
					dy: 0
				},
				icon: SOURCE_ASSET_BASE_URI + '/icn-service.svg',
				size: getPercentOfNodeValue(1)
			}
		]
	};

	nodesData.children = [
		...children.slice(0, positionOfMicroservice),
		microserviceNodeData,
		...children.slice(positionOfMicroservice)];
}

function getRestAPINodeData(restEditorData, rootId) {
	const rootNodeData = {
		id: rootId,
		name: rootId,
		type: 'group',
		children: []
	};

	const nodes = [];
	for (const rest of restEditorData) {
		if (rest.uri && rest.method) {
			const restNode = {
				id: `${rootId}_${rest.method.toLowerCase()}_${rest.uri}`,
				rootId,
				description: {
					value: rest.uri,
					dx: 0,
					dy: 0
				},
				icon: getRestAPIImageSource(rest),
				size: 0
			};
			nodes.push(restNode);
		}
	}
  
	if (nodes.length === 0) {
		return undefined;
	}
  
	addSizeOfNodes(nodes);
	rootNodeData.children = nodes;
  
	return rootNodeData;
}

export function getRestAPIImageSource(rest) {
	const method = rest.method.toLowerCase();
	switch (method) {
		case 'post': return SOURCE_ASSET_BASE_URI + '/icn-post.svg';
		case 'get': return SOURCE_ASSET_BASE_URI + '/icn-get.svg';
		case 'delete': return SOURCE_ASSET_BASE_URI + '/icn-delete.svg';
		default: return '';
	}
}

export function getTopicsNodeData(topicEditorData, rootId) {
	const { produces, consumes } = topicEditorData;
	if (produces && consumes) {
		const rootNodeData = {
			id: rootId,
			name: rootId,
			type: 'group',
			children: []
		};
    
		const nodes = [];

		for (const produce of produces) {
			const { name, topics } = produce;
			const icon = getTopicImageSource(name);
			for (const topic of topics) {
				const topicNode = {
					id: `${rootId}_${name}_${topic.toLowerCase()}`,
					rootId,
					description: {
						value: topic,
						dx: 0,
						dy: 0
					},
					icon,
					size: 0
				};
				nodes.push(topicNode);
			}
		}

		addSizeOfNodes(nodes);
		rootNodeData.children = nodes;
    
		return rootNodeData;
	}

	return undefined;
}

export function getTopicImageSource(serviceName) {
	switch (serviceName.toLowerCase()) {
		case 'kafka': return SOURCE_ASSET_BASE_URI + '/icn-kafka.svg';
		default: return '';
	}
}

export function getStoresNodeData(storeEditorData, rootId) {
	const rootNodeData = {
		id: rootId,
		name: rootId,
		type: 'group',
		children: []
	};

	const nodes = [];
	const icon = getStoreImageSource();

	for (const store of storeEditorData) {
		const { name, dbs } = store;
		for (const db of dbs) {
			const storeNode = {
				id: `${rootId}_${name}_${db.name.toLowerCase()}`,
				rootId,
				description: {
					value: name,
					dx: 0,
					dy: 0
				},
				icon,
				size: 0
			};
			nodes.push(storeNode);
		}
	}

	addSizeOfNodes(nodes);
	rootNodeData.children = nodes;
  
	if (nodes.length === 0) {
		return  undefined;
	}

	return rootNodeData;
}

export function getStoreImageSource(storeName) {
	return SOURCE_ASSET_BASE_URI + '/icn-db.svg';
}

export function addSizeOfNodes(nodes) {
	const sizeOfNode = nodes.length ? getPercentOfNodeValue(nodes.length) : 0;
	for (const node of nodes) {
		node.size = sizeOfNode;
	}
}