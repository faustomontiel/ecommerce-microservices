//const { GetItemCommand, ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
import { GetItemCommand, ScanCommand, PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";
import { v4 as uuidv4 } from "uuid"

exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    switch (event.httpMethod) {
        case "GET":
            if (event.pathParameters != null) {
                body = await getProduct(event.pathParameters.id); // GET product/1
            } else {
                body = await getAllProducts(); // GET product
            }
        case "GET":
            body = await createProduct(event); // POST product
            break;
        case "DELETE":
            body = await deleteProduct(event.pathParameters.id); // DELETE product/1
            break;
        default:
            throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }


    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello from Product ! You've hit ${event.path}\n`
    };

    
};

const getProduct = async (productId) => {
    console.log("getProduct");

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: productId })
        };

        const { Item } = await ddbClient.send(new GetItemCommand(params));

        console.log(Item);
        return (Item) ? unmarshall(Item) : {}

    } catch (e) {
        console.error(e);
        throw e;
    }
}

const getAllProducts = async () => {
    console.log("getAllProduct");

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME
        };

        const { Items } = await ddbClient.send(new ScanCommand(params));

        console.log(Items);
        return (Items) ? Items.map((item) => unmarshall(item)) : {}

    } catch (e) {
        console.error(e);
        throw e;
    }
}

const createProduct = async (event) => {
    console.log(`createProduct function. event: "${event}"`);

    try {
        const productRequest = JSON.parse(event.body);

        const productId = uuidv4();
        productRequest.id = productId;

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Items: marshall(productRequest || {})
        };

        const createResult = await ddbClient.send(new PutItemCommand(params));

        console.log(createResult);
        return createResult;

    } catch (e) {
        console.error(e);
        throw e;
    }
};


const deleteProduct = async (productId) => {
    console.log("deleteProduct");

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: productId })
        };

        const deleteResult = await ddbClient.send(new DeleteItemCommand(params));

        console.log(deleteResult);
        return deleteResult;

    } catch (e) {
        console.error(e);
        throw e;
    }
}