export const handler = async (event: any) => {
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
};
