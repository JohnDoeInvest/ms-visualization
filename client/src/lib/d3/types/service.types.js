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
	constructor({
        id, name, type, isGroup, belongToIds,
        metadata: { description, icon, isHighlighted }
    }) {
		this.id = id;
		this.name = name;
		this.type = type;
        this.isGroup = isGroup;
        this.belongToIds = belongToIds;
		this.metadata = { description, icon, isHighlighted };
		this.size = 0;
        this.children = [];
	}

	setSize(size) {
        this.size = size || this.size;
        return this;
    }
    
	addNodesToChildren(nodes) {
        this.children = [...this.children, ...nodes];
        return this;
	}
}