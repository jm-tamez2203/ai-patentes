import { defineBackend } from "@aws-amplify/backend";
import * as aws_iam from "aws-cdk-lib/aws-iam";
import { data } from "./data/resource";
import { auth } from "./auth/resource";
import { bedrockHandler } from "./function/bedrock-handler/resource";

export const backend = defineBackend({
  auth,
  data,
  bedrockHandler, // 👈 ahora Amplify sabe crearla
});

// 👇 Agregar permisos a la Lambda para invocar Bedrock
backend.bedrockHandler.resources.lambda.addToRolePolicy(
  new aws_iam.PolicyStatement({
    effect: aws_iam.Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
    ],
  })
);



/*
import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

const backend = defineBackend({
  data,
});

// Agregar permisos para Bedrock
backend.data.resources.cfnResources.cfnGraphqlApi.addPropertyOverride(
  'AuthenticationType',
  'API_KEY'
);

// Crear rol de IAM para AppSync con permisos de Bedrock
const bedrockPolicy = new aws_iam.PolicyStatement({
  effect: aws_iam.Effect.ALLOW,
  actions: ['bedrock:InvokeModel'],
  resources: ['arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0']
});

backend.data.resources.cfnResources.cfnGraphqlApi.addToRolePolicy(bedrockPolicy);
*/