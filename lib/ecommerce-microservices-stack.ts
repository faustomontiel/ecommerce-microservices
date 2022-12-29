import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export class EcommerceMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'product',{
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'product',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const nodeJsFunctionsProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'ID',
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_18_X
    }
    //Product microservices lambda function nodejs
    const productFunction = new NodejsFunction(this, 'productLambdaFunction',{
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionsProps
    });

    productTable.grantReadWriteData(productFunction);

    const apigw = new LambdaRestApi(this, 'productApi',{
      restApiName: 'ProductService',
      handler: productFunction,
      proxy: false 
    });


    const product = apigw.root.addResource('product');
    product.addMethod('GET'); // GET /product
    product.addMethod('POST'); // POST /product

    const singleProduct = product.addResource('{id}'); // product/id
    singleProduct.addMethod('GET'); // GET /product/{id}
    singleProduct.addMethod('PUT'); // PUT /product/{id}
    singleProduct.addMethod('DELETE'); // DELETE /product/{id}




  }
}
