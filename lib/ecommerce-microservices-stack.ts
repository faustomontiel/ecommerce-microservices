import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EcomApiGateway } from './apigateway';
import { EcomDatabase } from './database';
import { EcomEventBus } from './eventbus';
import { EcomMicroservices } from './microservice';
import { EcomQueue } from './queue';

export class EcommerceMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new EcomDatabase(this, 'Database');

    const microservices = new EcomMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable
    });

    const apigateway = new EcomApiGateway(this,'ApiGateway',{
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderMicroservice: microservices.orderingMicroservice,
    });

    const queue = new EcomQueue(this, 'Queue', {
      consumer: microservices.orderingMicroservice
    });

    const eventbus = new EcomEventBus(this, 'EventBus', {
      publisherFuntion: microservices.basketMicroservice,
      targetQueue: queue.orderQueue   
    });   
  }
}
