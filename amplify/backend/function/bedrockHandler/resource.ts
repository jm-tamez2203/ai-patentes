// En amplify/backend/function/bedrockHandler/resource.ts
import { defineFunction } from '@aws-amplify/backend';

// Exportación directa
export default defineFunction({
  name: 'bedrockHandler',
  entry: './handler.ts',
});