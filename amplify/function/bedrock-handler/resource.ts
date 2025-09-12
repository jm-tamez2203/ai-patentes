import { defineFunction } from "@aws-amplify/backend";

export const bedrockHandler = defineFunction({
  name: "bedrockHandler",   // 👈 nombre fijo, AppSync lo encontrará
  entry: "./handler.ts",
});
