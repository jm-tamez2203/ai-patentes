export const handler = async (event: any) => {
  console.log('Event received:', JSON.stringify(event));
  
  // Respuesta de prueba
  return {
    molecule: event.arguments.prompt || "Test Molecule",
    patent_number: "US" + Math.floor(Math.random() * 10000000),
    assignee: "Pharmaceutical Company",
    country: "United States",
    expiration_date: "2030-12-31",
    summary: "Patent information for " + (event.arguments.prompt || "test molecule"),
    error: ""
  };
};