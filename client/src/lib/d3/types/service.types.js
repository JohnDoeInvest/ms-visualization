export const ServiceTypes = {
	Microservice: 'Microservice',
	Topic: 'Topic',
	Store: 'Store',
	RestAPI: 'RestAPI',
    SharedService: 'SharedService',
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
    Store: 'icn-db.svg',
    SharedService: 'icn-db-shared.svg',
}
