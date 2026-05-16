import {
    addLanguage,
} from "./addLanguage";

async function run() {

  await addLanguage({
    language: "hi",
  });

  await addLanguage({
    language: "ja",
  });

  await addLanguage({
    language: "es",
  });

  console.log(
    "✅ Ontology complete"
  );
}

run();