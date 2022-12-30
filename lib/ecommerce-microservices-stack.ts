import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EcomApiGateway } from './apigateway';
import { EcomDatabase } from './database';
import { EcomMicroservices } from './microservices';

export class EcommerceMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new EcomDatabase(this, 'Database');

    const microservices = new EcomMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable
    });

    const apigateway = new EcomApiGateway(this,'ApiGateway',{
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice
    });

  }
}
