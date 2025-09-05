import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event: any) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  try {
    const prompt = event.arguments?.prompt || "";

    if (!prompt) {
      return {
        molecule: "",
        patent_number: "",
        assignee: "",
        country: "",
        expiration_date: "",
        summary: "",
        error: "Prompt is required"
      };
    }

    // Llamada a Bedrock
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        temperature: 0.5,
        top_p: 0.9,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Eres un experto en patentes farmacéuticas. 

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
  "summary": "breve resumen de la patente"
}

MOLECULA: ${prompt}`
              }
            ]
          }
        ]
      })
    });

    console.log('Calling Bedrock for molecule:', prompt);
    const response = await bedrockClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const textContent = result.content[0].text;
    
    console.log('Raw Bedrock response:', textContent);

    // Extraer JSON de la respuesta
    const jsonStart = textContent.indexOf('{');
    const jsonEnd = textContent.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error('No JSON found in response:', textContent);
      return {
        molecule: prompt,
        patent_number: "No disponible",
        assignee: "No disponible",
        country: "No disponible",
        expiration_date: "No disponible",
        summary: "No se encontró información de patente",
        error: ""
      };
    }

    const jsonString = textContent.substring(jsonStart, jsonEnd);
    const jsonData = JSON.parse(jsonString);

    // Validar y limpiar la respuesta
    return {
      molecule: jsonData.molecule || prompt,
      patent_number: jsonData.patent_number || "No disponible",
      assignee: jsonData.assignee || "No disponible",
      country: jsonData.country || "No disponible",
      expiration_date: jsonData.expiration_date || "No disponible",
      summary: jsonData.summary || "Información no disponible",
      error: ""
    };

  } catch (error) {
    console.error("Error in Bedrock handler:", error);
    
    // Respuesta de fallback en caso de error
    return {
      molecule: event.arguments?.prompt || "",
      patent_number: "Error",
      assignee: "Error",
      country: "Error",
      expiration_date: "Error",
      summary: "Error al procesar la solicitud",
      error: error instanceof Error ? error.message : "Error desconocido"
    };
  }
};

/*export const handler = async (event: any) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  // Respuesta de prueba
  return {
    molecule: event.arguments.prompt || "Test Molecule",
    patent_number: "US1234567",
    assignee: "Test Company",
    country: "US",
    expiration_date: "2030-12-31",
    summary: "Test response for " + (event.arguments.prompt || "test molecule"),
    error: ""
  };
};*/
