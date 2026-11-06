import { supabase } from "../../../../services/supabase";

import { book } from "./book";
import { chapters } from "./chapters";
import { fragments } from "./fragments";

export async function ingestBeYouBook() {
  console.log("📘 Starting Be You ingestion...");

  /*
   * ---------------------------------------------------------
   * 1. INSERT BOOK
   * ---------------------------------------------------------
   */

  const { data: bookData, error: bookError } = await supabase
    .from("sacred_dance_books")
    .upsert(
      {
        key: book.key,

        multilingual_key: `books.${book.key}`,

        title: book.title,

        subtitle: book.subtitle,

        series: "The Sacred Dance",

        edition: book.version,

        description: book.description,

        themes: book.themes || [],

        emotional_frequencies:
          book.energySignature || [],

        guide_affinities:
          book.guideResonance || [],

        active: true,
      },
      {
        onConflict: "key",
      }
    )
    .select("id")
    .single();

  if (bookError || !bookData) {
    console.error(
      "❌ Book insert failed",
      bookError
    );

    return;
  }

  const bookId = bookData.id;

  console.log("✅ Book inserted:", bookId);

  /*
   * ---------------------------------------------------------
   * 2. INSERT CHAPTERS
   * ---------------------------------------------------------
   */

  const insertedChapters: Record<string, string> =
    {};

  for (
    let index = 0;
    index < chapters.length;
    index++
  ) {
    const chapter = chapters[index];

    const chapterKey =
      `${book.key}_${chapter.key}`;

    /*
     * -------------------------------------------------------
     * UPSERT CHAPTER
     * -------------------------------------------------------
     */

    const { error } = await supabase
      .from("sacred_dance_book_chapters")
      .upsert(
        {
          key: chapterKey,

          multilingual_key:
            `books.${book.key}.chapters.${chapter.key}`,

          book_id: bookId,

          chapter_number: index + 1,

          title: chapter.title,

          subheader: chapter.section,

          summary: chapter.summary,

          themes: chapter.themes || [],

          emotional_frequencies: [
            chapter.energy || "reflective",
          ],

          chakras:
            chapter.chakras || [],

          guide_affinities:
            chapter.guides || [],

          symbols:
            chapter.symbols || [],

          relationship_dynamics:
            chapter.relationshipDynamics ||
            [],

          cosmic_tags:
            chapter.cosmicTags || [],

          active: true,
        },
        {
          onConflict: "key",
        }
      );

    if (error) {
      console.error(
        `❌ Chapter failed: ${chapter.title}`,
        error
      );

      continue;
    }

    /*
     * -------------------------------------------------------
     * FETCH CHAPTER ID
     * -------------------------------------------------------
     */

    const {
      data: insertedChapter,
      error: fetchError,
    } = await supabase
      .from("sacred_dance_book_chapters")
      .select("id")
      .eq("key", chapterKey)
      .single();

    if (
      fetchError ||
      !insertedChapter
    ) {
      console.error(
        `❌ Failed to fetch chapter ID: ${chapter.title}`,
        fetchError
      );

      continue;
    }

    insertedChapters[chapter.key] =
      insertedChapter.id;

    console.log(
      `✅ Chapter inserted: ${chapter.title}`
    );
  }

  /*
   * ---------------------------------------------------------
   * DEBUG CHAPTER MAP
   * ---------------------------------------------------------
   */

  console.log(
    "🧠 Inserted chapters map:",
    insertedChapters
  );

  /*
   * ---------------------------------------------------------
   * 3. INSERT CONTEXT FRAGMENTS
   * ---------------------------------------------------------
   */

  for (const [
    chapterKey,
    chapterFragments,
  ] of Object.entries(fragments)) {
    const chapterId =
      insertedChapters[chapterKey];

    if (!chapterId) {
      console.warn(
        `⚠️ Missing chapter ID for ${chapterKey}`
      );

      continue;
    }

    for (
      let index = 0;
      index < chapterFragments.length;
      index++
    ) {
      const fragment =
        chapterFragments[index];

      const fragmentKey =
        `${book.key}_${chapterKey}_${index}`;

      /*
       * -----------------------------------------------------
       * A. CONTEXT FRAGMENT
       * -----------------------------------------------------
       */

      const {
        data: contextFragment,
        error: contextError,
      } = await supabase
        .from(
          "sacred_dance_context_fragments"
        )
        .upsert(
          {
            key: fragmentKey,

            multilingual_key:
              `books.${book.key}.${chapterKey}.${index}`,

            fragment_type:
              fragment.fragmentType,

            source_type: "book",

            source_id: bookId,

            content:
              fragment.content,

            themes: [
              fragment.theme,
            ],

            emotional_frequencies:
              fragment.emotionalFrequencies ||
              [],

            chakras:
              fragment.chakras || [],

            guide_affinities:
              fragment.guides || [],

            archetypes:
              fragment.archetypes || [],

            symbols:
              fragment.symbols || [],

            relationship_dynamics:
              fragment.relationshipDynamics ||
              [],

            cosmic_tags:
              fragment.cosmicTags || [],

            retrieval_weight:
              fragment.retrievalWeight ||
              1.0,

            active: true,
          },
          {
            onConflict: "key",
          }
        )
        .select("id")
        .single();

      if (
        contextError ||
        !contextFragment
      ) {
        console.error(
          `❌ Context fragment failed (${chapterKey})`,
          contextError
        );

        continue;
      }

      /*
       * -----------------------------------------------------
       * B. BOOK EXTRACTION
       * -----------------------------------------------------
       */

      const {
        error: extractionError,
      } = await supabase
        .from(
          "sacred_dance_book_extractions"
        )
        .upsert(
          {
            key:
              `${fragmentKey}_extraction`,

            multilingual_key:
              `books.${book.key}.${chapterKey}.${index}.extraction`,

            book_id: bookId,

            chapter_id: chapterId,

            extraction_type:
              fragment.fragmentType,

            content:
              fragment.content,

            themes: [
              fragment.theme,
            ],

            emotional_frequencies:
              fragment.emotionalFrequencies ||
              [],

            chakras:
              fragment.chakras || [],

            guide_affinities:
              fragment.guides || [],

            symbols:
              fragment.symbols || [],

            relationship_dynamics:
              fragment.relationshipDynamics ||
              [],

            cosmic_tags:
              fragment.cosmicTags || [],

            context_fragment_id:
              contextFragment.id,

            retrieval_weight:
              fragment.retrievalWeight ||
              1.0,

            active: true,
          },
          {
            onConflict: "key",
          }
        );

      if (extractionError) {
        console.error(
          `❌ Extraction failed (${chapterKey})`,
          extractionError
        );
      }
    }

    console.log(
      `✨ Inserted ${chapterFragments.length} fragments for ${chapterKey}`
    );
  }

  console.log(
    "🌸 Be You ingestion complete"
  );
}