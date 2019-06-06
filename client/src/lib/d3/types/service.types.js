export const ServiceTypes = {
	Microservice: 'Microservice',
	Topic: 'Topic',
	DB: 'DB',
	RestAPI: 'RestAPI',
    SharedDB: 'SharedDB',
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
    DB: 'icn-db.svg',
    SharedDB: 'icn-db-shared.svg',
}
