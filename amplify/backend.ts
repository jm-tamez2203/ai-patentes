import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { auth } from "./auth/resource";
// Importaciones de AWS CDK deben estar al inicio
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

// Intenta importar la función solo si existe
try {
  // Verifica si el archivo existe
  const { bedrockHandler } = await import("./backend/function/bedrockHandler/resource");
  
  const backend = defineBackend({
    auth,
    data,
    bedrockHandler,
  });

  // Intenta agregar permisos
  const dataStack = backend.data.stack;
  const bedrockFunction = dataStack.node.tryFindChild('bedrockHandler');

  if (bedrockFunction && (bedrockFunction as any).addToRolePolicy) {
    (bedrockFunction as any).addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["bedrock:InvokeModel"],
        resources: [
          "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        ],
      })
    );
  } else {
    console.log('Adding permissions manually in AWS Console');
  }

} catch (error) {
  // Si no existe la función, crea el backend sin ella
  console.log('Function not found, creating backend without explicit function import');
  
  const backend = defineBackend({
    auth,
    data,
  });
}
//} else {
//  console.log('Function not found or does not have addToRolePolicy method');
//  console.log('Available children:', dataStack.node.children.map(c => c.node.id));
//}
/*import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { auth } from "./auth/resource";
import  bedrockHandler  from "./backend/function/bedrockHandler/resource";

const backend = defineBackend({
  auth,
  data,
  bedrockHandler, // ← Registra la función
});
*/

// Agregar la política a la función Lambda
//backend.bedrockHandler.resources.lambda.addToRolePolicy(bedrockPolicy);
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