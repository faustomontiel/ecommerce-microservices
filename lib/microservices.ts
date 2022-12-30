import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface EcomMicroservicesProps{
    productTable: ITable;
}

export class EcomMicroservices extends Construct{
    
    public readonly productMircoservices: NodejsFunction;

    constructor(scope: Construct, id: string, props: EcomMicroservicesProps){
        super(scope,id);

        const nodeJsFunctionsProps: NodejsFunctionProps = {
            bundling: {
              externalModules: [
                'aws-sdk'
              ]
            },
            environment: {
              PRIMARY_KEY: 'ID',
              DYNAMODB_TABLE_NAME: props.productTable.tableName
            },
            runtime: Runtime.NODEJS_18_X
          }
          //Product microservices lambda function nodejs
          const productFunction = new NodejsFunction(this, 'productLambdaFunction',{
            entry: join(__dirname, `/../src/product/index.js`),
            ...nodeJsFunctionsProps
          });
      
          props.productTable.grantReadWriteData(productFunction);
          this.productMircoservices = productFunction;
    }
}