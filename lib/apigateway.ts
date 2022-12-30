import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface EcomApiGatewayProps {
    productMircoservice: IFunction
}

export class EcomApiGateway extends Construct {

    constructor(scope: Construct, id: string, props: EcomApiGatewayProps) {
        super(scope, id);

        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName: 'ProductService',
            handler: props.productMircoservice,
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