export const ServiceTypes = {
	Microservice: 'Microservice',
	Topic: 'Topic',
	Store: 'Store',
	RestAPI: 'RestAPI',
	SharedService: 'SharedService'
}

export const ServiceIconNames = {
    Microservice: 'icn-service.svg',
    RestAPI: {
        Get: 'icn-get.svg',
        Post: 'icn-post.svg',
        Delete: 'icn-delete.svg',
    },
    Topic: {
        Kafka: 'icn-kafka.svg'
    },
    Store: 'icn-db.svg'
}

export class ServiceNode {
	constructor({ id, name, type, isGroup, metadata: { description, belongToId, icon, isHighlighted } }) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.isGroup = isGroup;
		this.metadata = { description, belongToId, icon, isHighlighted };
		this.size = 0;
		this.children = [];
	}

	setSize(size) {
		this.size = size || this.size;
	}

	appendNodesToChildren(nodes) {
		this.children = [...this.children, ...nodes];
	}
}