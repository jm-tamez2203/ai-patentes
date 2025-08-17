import { readCSVFromS3 } from "./s3.js";
import { summarizePatent } from "./bedrock.js";

export const handler = async (event) => {
  try {
    const bucket = process.env.PATENT_BUCKET;
    const key = "patents.csv";

    const records = await readCSVFromS3(bucket, key);

    const query = event.queryStringParameters?.q?.toLowerCase() || "";

    const filtered = records.filter(
      (row) =>
        row.molecule.toLowerCase().includes(query) ||
        row.abstract.toLowerCase().includes(query)
    );

    // Enviar a Claude para resumen (paralelo con Promise.all)
    const enriched = await Promise.all(
      filtered.map(async (row) => {
        const summary = await summarizePatent(row);
        return { ...row, ai_summary: summary };
      })
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
