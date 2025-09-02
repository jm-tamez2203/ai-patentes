import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  PatentInfo: a.customType({
    molecule: a.string(),
    patent_number: a.string(),
    assignee: a.string(),
    country: a.string(),
    expiration_date: a.string(),
    summary: a.string(),
    error: a.string(),
  }),

  askBedrock: a
    .query()
    .arguments({ prompt: a.string() })
    .returns(a.ref("PatentInfo"))
    .authorization((allow) => [allow.publicApiKey()])
    .handler(a.handler.function('amplify-aipatentes-ec2use-bedrockHandlerlambdaCAF1-qnOzAWOA7zHw')), // Solo el nombre como string
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});

/* Versión anterior sin Prompt Eng
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  BedrockResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  askBedrock: a
    .query()
    .arguments({ prompt: a.string() }) // ✅ CAMBIO AQUÍ
    .returns(a.ref("BedrockResponse"))
/*  .authorization((allow) => [allow.authenticated()])
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

*/


/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
