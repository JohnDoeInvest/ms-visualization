import { ServiceTypes } from '../types/service.types';
import { ShapeSideTypes } from '../types/shape.types';

export const ShapeSideTypeFactory = (type) => {
    switch (type) {
        case ServiceTypes.Microservice: return ShapeSideTypes.MicroserviceShapeSideTypes;
        case ServiceTypes.RestAPI: return ShapeSideTypes.RestAPIShapeSideTypes;
        case ServiceTypes.Topic: return ShapeSideTypes.TopicShapeSideTypes;
        case ServiceTypes.Store: return ShapeSideTypes.StoreShapeSideTypes;
        default: return ShapeSideTypes.SharedServiceShapeSideTypes
    }
}