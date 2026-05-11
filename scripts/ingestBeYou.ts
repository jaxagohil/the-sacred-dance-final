import { ingestBeYouBook } from "../lib/sacredDance/books/beYou/ingestion";

async function run() {
  try {
    await ingestBeYouBook();
    console.log("🌸 Be You ingestion complete");
  } catch (error) {
    console.error("❌ Ingestion failed", error);
  }
}

run();