import { ServiceNode, ServiceTypes } from '../types/service.types';
import { ServiceNodeParserFactory } from './service.utils';

export const getSizeOfSeriviceNode = (len) => 1000 / len;

/**
 * create service node for graph
 * @param {*} serviceDescriptions 
 * @returns {ServiceNode} serivceNode
 */
export function createServiceNode(serviceORMs) {
	const createServiceNodeGroup = (id) => {
		return new ServiceNode({
			id,
			isGroup: true,
			belongToIds: [],
			metadata: {}
		});
	};

	const createServiceNodeChildren = (serviceORMs, type) => {
		const serviceORMSByType = serviceORMs.filter(service => service.type === type);
		const size = getSizeOfSeriviceNode(serviceORMSByType.length);
		const serviceNodes = serviceORMSByType.map(serviceORM => {
			const serviceNode = ServiceNodeParserFactory(type)(serviceORM);
			serviceNode.setSize(size);
			return serviceNode;
		});
		return serviceNodes;
	};

	const rootGroup = createServiceNodeGroup('root_service_group')
	const microserviceGroup = createServiceNodeGroup('microservice_group');
	const restAPIGroup = createServiceNodeGroup('rest_api_group');
	const topicGroup = createServiceNodeGroup('topic_group');
	const sharedServiceGroup = createServiceNodeGroup('shared_service_group');
	const storeGroup = createServiceNodeGroup('store_group');

	microserviceGroup.addNodesToChildren(createServiceNodeChildren(serviceORMs, ServiceTypes.Microservice));
	restAPIGroup.addNodesToChildren(createServiceNodeChildren(serviceORMs, ServiceTypes.RestAPI));
	topicGroup.addNodesToChildren(createServiceNodeChildren(serviceORMs, ServiceTypes.Topic));
	sharedServiceGroup.addNodesToChildren(createServiceNodeChildren(serviceORMs, ServiceTypes.SharedService));
	storeGroup.addNodesToChildren(createServiceNodeChildren(serviceORMs, ServiceTypes.Store));
	
	rootGroup.addNodesToChildren([
		restAPIGroup,
		microserviceGroup,
		topicGroup,
		sharedServiceGroup,
		storeGroup
	]);

	return rootGroup;
}
