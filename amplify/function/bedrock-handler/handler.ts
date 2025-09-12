export const handler = async (event: any) => {
  console.log("Event received:", JSON.stringify(event));

  return {
    molecule: event.arguments.prompt || "Test Molecule",
    patent_number: "US" + Math.floor(Math.random() * 10000000),
    assignee: "Pharma Inc.",
    country: "US",
    expiration_date: "2030-12-31",
    summary: "Patent info for " + (event.arguments.prompt || "test molecule"),
    error: "",
  };
};