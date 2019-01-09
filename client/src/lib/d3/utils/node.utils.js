export const getPercentOfNodeValue = (nums) => 1000 / nums;
export const SOURCE_ASSET_BASE_URI = '/assets/d3';

function convertNodeDataArrToObj(editorDataArr) {
	const nodeDataObj = {
		mircoservices: [],
		restAPIs: [],
		sharedServices: [],
		topics: [],
		stores: []
	};

	nodeDataObj.mircoservices = editorDataArr.map((data, i) => ({
		id: data.name + '-' + i,
		name: data.name,
		description: data.description,
	}));

	for (let i = 0; i < editorDataArr.length; i++) {
		const editorData = editorDataArr[i];
		const microserviceId = editorData.name + '-' + i;

		if (editorData.restAPI) {
			nodeDataObj.restAPIs = [
				...nodeDataObj.restAPIs, 
				...addBelongToMicroserviceId(editorData.restAPI, microserviceId)
			];
		}

		if (editorData.sharedServices) {
			nodeDataObj.sharedServices = [
				...nodeDataObj.sharedServices,
				...addBelongToMicroserviceId(editorData.sharedServices, microserviceId)
			];
		}

		if (editorData.produces) {
			nodeDataObj.topics = [
				...nodeDataObj.topics,
				...addBelongToMicroserviceId(editorData.produces, microserviceId)
			];
		}

		if (editorData.stores) {
			nodeDataObj.stores = [
				...nodeDataObj.stores,
				...addBelongToMicroserviceId(editorData.stores, microserviceId)
			];
		}

	}

	return nodeDataObj;
}

function addBelongToMicroserviceId(servicesArr, microserviceId) {
	return servicesArr.map((service) => ({...service, belongToMicroserviceId: microserviceId}));
}

export function getNodeDataOnEditor(editorData) {
	if (editorData) {
		const nodeDataObj = convertNodeDataArrToObj(editorData);
		
		const nodesData = {
			id: 'root',
			name: 'root',
			type: 'group',
			children: []
		};
    
		const restAPINodeData = getRestAPINodeData(nodeDataObj.restAPIs, 'restAPIs');
		if (restAPINodeData) {
			nodesData.children.push(restAPINodeData);
		}

		const mircoservicesNodeData = getMicroserviceNodeData(nodeDataObj.mircoservices, 'microservices');
		if (mircoservicesNodeData) {
			nodesData.children.push(mircoservicesNodeData);
		}

		const storesNodeData = getStoresNodeData(nodeDataObj.stores, 'stores');
		if (storesNodeData) {
			nodesData.children.push(storesNodeData);
		}
    
		const topicsNodeData = getTopicsNodeData(nodeDataObj.topics, 'topics');
		if (topicsNodeData) {
			nodesData.children.push(topicsNodeData);
		}
  
		return nodesData;
	}
  
  
	return undefined;
}

function getMicroserviceNodeData(microservices, rootId) {
	const rootNodeData = {
		id: rootId,
		name: rootId,
		type: 'group',
		children: []
	};

	const nodes = [];
	for (const microservice of microservices) {
		const microserviceNode = {
			id: microservice.id,
			type: 'microservice',
			rootId,
			description: {
				value: 'service',
				dx: 0,
				dy: 0
			},
			icon: SOURCE_ASSET_BASE_URI + '/icn-service.svg',
			size: 0,
		};
		nodes.push(microserviceNode);
	}
  
	if (nodes.length === 0) {
		return undefined;
	}
  
	addSizeOfNodes(nodes);
	rootNodeData.children = nodes;
  
	return rootNodeData;
}

function getRestAPINodeData(restAPIs, rootId) {
	const rootNodeData = {
		id: rootId,
		name: rootId,
		type: 'group',
		children: []
	};

	const nodes = [];
	for (const rest of restAPIs) {
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
				size: 0,
				belongToMicroserviceId: rest.belongToMicroserviceId
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

export function getTopicsNodeData(topicsData, rootId) {
	const rootNodeData = {
		id: rootId,
		name: rootId,
		type: 'group',
		children: []
	};

	const nodes = [];

	for (const topicData of topicsData) {
		const { name, topics } = topicData;
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
				size: 0,
				belongToMicroserviceId: topicData.belongToMicroserviceId
			};
			nodes.push(topicNode);
		}
	}

	addSizeOfNodes(nodes);
	rootNodeData.children = nodes;

	return rootNodeData;
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
				size: 0,
				belongToMicroserviceId: store.belongToMicroserviceId
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
