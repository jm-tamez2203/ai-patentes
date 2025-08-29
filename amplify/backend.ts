import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

// El nombre de la función se genera automáticamente
// Intenta con estos nombres comunes:
const functionNames = [
  'askBedrockFunction',
  'bedrockHandlerFunction', 
  'functionHandler'
];

for (const functionName of functionNames) {
  const fn = backend.data.resources.functions[functionName];
  if (fn) {
    fn.addToRolePolicy(
      new PolicyStatement({
        resources: [
          "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        ],
        actions: ["bedrock:InvokeModel"],
      })
    );
    break;
  }
}
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