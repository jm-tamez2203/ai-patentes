import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parse } from "csv-parse/sync";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function readCSVFromS3(bucket, key) {
  const data = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const body = await streamToString(data.Body);

  return parse(body, { columns: true, skip_empty_lines: true });
}

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
