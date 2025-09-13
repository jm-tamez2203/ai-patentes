import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event: any) => {
  console.log("Event received:", JSON.stringify(event));

  const prompt = event.arguments?.prompt ?? "No molecule provided";

  // Prompt optimizado
  const systemPrompt = `
Eres un experto en patentes farmacéuticas.

INSTRUCCIONES:
1. Devuelve SOLO un JSON válido sin texto adicional
2. Si no encuentras información, usa "No disponible" en los campos
3. Basa la información en patentes reales cuando sea posible

DEVUELVE ESTE JSON:
{
  "molecule": "nombre de la molécula",
  "patent_number": "número de patente",
  "assignee": "empresa titular", 
  "country": "país de la patente",
  "expiration_date": "fecha de expiración",
  "summary": "breve resumen de la patente",
  "error": ""
}
`;

  try {
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0", // 👈 ajusta si usas otro modelo
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 500,
        temperature: 0,
        system: systemPrompt, // 👈 ahora va aquí, no en messages
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Molécula: ${prompt}`,
              },
            ],
          },
        ],
      }),
    });

    const response = await client.send(command);

    // El modelo regresa un JSON dentro de `response.body`
    const output = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Raw model output:", JSON.stringify(output));

    // Claude en Bedrock devuelve en `output.content[0].text`
    const text = output.content?.[0]?.text || "{}";

    let jsonResult: any = {};
    try {
      jsonResult = JSON.parse(text);
    } catch (err) {
      console.error("Error parsing model JSON:", err);
      jsonResult = {
        molecule: prompt,
        patent_number: "No disponible",
        assignee: "No disponible",
        country: "No disponible",
        expiration_date: "No disponible",
        summary: "Error al interpretar la salida del modelo",
        error: "JSON parse error",
      };
    }

    return jsonResult;
  } catch (err: any) {
    console.error("Bedrock invocation failed:", err);
    return {
      molecule: prompt,
      patent_number: "No disponible",
      assignee: "No disponible",
      country: "No disponible",
      expiration_date: "No disponible",
      summary: "",
      error: err.message || "Error invocando Bedrock",
    };
  }
};
