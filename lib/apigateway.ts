import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface EcomApiGatewayProps {
    productMicroservice: IFunction
    basketMicroservice: IFunction
    orderMicroservice: IFunction
}

export class EcomApiGateway extends Construct {

    constructor(scope: Construct, id: string, props: EcomApiGatewayProps) {
        super(scope, id);

        // Product api gateway
        this.createProductApi(props.productMicroservice);
        //Basket api gateway
        this.createBasketApi(props.basketMicroservice);
        //Ordering api gateway
        this.createOrderApi(props.orderMicroservice);

    }

    private createProductApi(productMicroservice: IFunction) {
        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName: 'Product Service',
            handler: productMicroservice,
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

    private createBasketApi(basketMicroservice: IFunction) {
        const apigw = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'Basket Service',
            handler: basketMicroservice,
            proxy: false
        });

        const basket = apigw.root.addResource('basket');
        basket.addMethod('GET'); // GET /basket
        basket.addMethod('POST'); // POST /basket

        const singleBasket = basket.addResource('{userName}'); // basket/userName
        singleBasket.addMethod('GET'); // GET /basket/{userName}
        singleBasket.addMethod('DELETE'); // DELETE /basket/{userName}

        const basketcheckout = basket.addResource('checkout'); // basket/userName
        basketcheckout.addMethod('POST'); // POST /basket/checkout
        //expected request payload: { userName: fausto}

    }

    private createOrderApi(orderingMicroservices: IFunction) {
        // Ordering microservices api gateway
        // root name = order

        // GET /order
	    // GET /order/{userName}
        // expected request : xxx/order/swn?orderDate=timestamp
        // ordering ms grap input and query parameters and filter to dynamo db

        const apigw = new LambdaRestApi(this, 'orderApi', {
            restApiName: 'Order Service',
            handler: orderingMicroservices,
            proxy: false
        });
    
        const order = apigw.root.addResource('order');
        order.addMethod('GET');  // GET /order        
    
        const singleOrder = order.addResource('{userName}');
        singleOrder.addMethod('GET');  // GET /order/{userName}
            // expected request : xxx/order/swn?orderDate=timestamp
            // ordering ms grap input and query parameters and filter to dynamo db
    
        return singleOrder;
    }
}