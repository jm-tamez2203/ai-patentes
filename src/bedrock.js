import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

export async function summarizePatent(record) {
  const prompt = `
Eres un analista de inteligencia farmacéutica.
Genera un resumen de la siguiente patente con enfoque en OPORTUNIDAD DE NEGOCIO:

Molécula: ${record.molecule}
Titular: ${record.assignee}
País: ${record.country}
Expira: ${record.expiration_date}
Resumen técnico: ${record.abstract}
`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0", // puedes cambiar a Haiku o Llama
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 300,
      messages: [
        { role: "user", content: [{ type: "text", text: prompt }] },
      ],
    }),
  });

  const response = await client.send(command);

  const responseBody = JSON.parse(
    new TextDecoder("utf-8").decode(response.body)
  );

  return responseBody.content[0].text;
}
