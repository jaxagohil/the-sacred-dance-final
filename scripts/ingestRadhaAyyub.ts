import { ingestRadhaAyyubBook } from "../lib/sacredDance/books/radhaAyyub/ingestion";

async function run() {
  try {
    await ingestRadhaAyyubBook();

    console.log(
      "🌸 Radha & Ayyub ingestion complete"
    );
  } catch (error) {
    console.error(
      "❌ Ingestion failed",
      error
    );
  }
}

run();