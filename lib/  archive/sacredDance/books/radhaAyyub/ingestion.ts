import { supabase } from "../../../../services/supabase";

import { radhaAyyubBook } from "./book";
import { radhaAyyubChapters } from "./chapters";
import { radhaAyyubFragments } from "./fragments";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function ingestRadhaAyyubBook() {
  console.log(
    "📘 Starting Radha & Ayyub ingestion..."
  );

  /*
   * ---------------------------------------------------------
   * 1. INSERT BOOK
   * ---------------------------------------------------------
   */

  const {
    data: bookData,
    error: bookError,
  } = await supabase
    .from("sacred_dance_books")
    .upsert(
      {
        key: radhaAyyubBook.slug,

        multilingual_key:
          `books.${radhaAyyubBook.slug}`,

        title: radhaAyyubBook.title,

        subtitle:
          radhaAyyubBook.subtitle,

        series: "The Sacred Dance",

        edition: 1,

        description:
          radhaAyyubBook.description ||
          "",

        themes:
          radhaAyyubBook.themes || [],

        emotional_frequencies:
          radhaAyyubBook
            .energySignature || [],

        guide_affinities:
          radhaAyyubBook
            .guideResonance || [],

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

  console.log(
    "✅ Book inserted:",
    bookId
  );

  /*
   * ---------------------------------------------------------
   * 2. INSERT CHAPTERS
   * ---------------------------------------------------------
   */

  const insertedChapters: Record<
    string,
    string
  > = {};

  for (
    let index = 0;
    index < radhaAyyubChapters.length;
    index++
  ) {
    const chapter =
      radhaAyyubChapters[index];

    const chapterSlug =
      chapter.slug;

    const chapterKey =
      `${radhaAyyubBook.slug}_${chapterSlug}`;

    const { error } = await supabase
      .from("sacred_dance_book_chapters")
      .upsert(
        {
          key: chapterKey,

          multilingual_key:
            `books.${radhaAyyubBook.slug}.chapters.${chapterSlug}`,

          book_id: bookId,

          chapter_number:
            chapter.number ||
            index + 1,

          title: chapter.title,

          subheader:
            chapter.subtitle || "",

          summary:
            chapter.summary || "",

          themes:
            chapter.themes || [],

          emotional_frequencies: [
            chapter.energy ||
              "reflective",
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

    insertedChapters[chapterSlug] =
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
   * 3. INSERT FRAGMENTS
   * ---------------------------------------------------------
   */

  for (
    let index = 0;
    index < radhaAyyubFragments.length;
    index++
  ) {
    const fragment =
      radhaAyyubFragments[index];

    const chapterId =
      insertedChapters[
        fragment.chapter
      ];

    if (!chapterId) {
      console.warn(
        `⚠️ Missing chapter ID for ${fragment.chapter}`
      );

      continue;
    }

    const fragmentSlug =
      slugify(fragment.title);

    const fragmentKey =
      `${radhaAyyubBook.slug}_${fragment.chapter}_${fragment.order}_${fragmentSlug}`;

    /*
     * -------------------------------------------------------
     * A. CONTEXT FRAGMENT
     * -------------------------------------------------------
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
            `books.${radhaAyyubBook.slug}.${fragment.chapter}.${fragment.order}`,

          fragment_type:
            fragment.type,

          source_type: "book",

          source_id: bookId,

          content:
            fragment.content,

          themes:
            fragment.tags || [],

          emotional_frequencies: [],

          chakras: [],

          guide_affinities: [],

          archetypes: [],

          symbols: [],

          relationship_dynamics: [],

          cosmic_tags: [],

          retrieval_weight: 1.0,

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
        `❌ Context fragment failed (${fragment.title})`,
        contextError
      );

      continue;
    }

    /*
     * -------------------------------------------------------
     * B. BOOK EXTRACTION
     * -------------------------------------------------------
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
            `books.${radhaAyyubBook.slug}.${fragment.chapter}.${fragment.order}.extraction`,

          book_id: bookId,

          chapter_id: chapterId,

          extraction_type:
            fragment.type,

          content:
            fragment.content,

          themes:
            fragment.tags || [],

          emotional_frequencies: [],

          chakras: [],

          guide_affinities: [],

          symbols: [],

          relationship_dynamics: [],

          cosmic_tags: [],

          context_fragment_id:
            contextFragment.id,

          retrieval_weight: 1.0,

          active: true,
        },
        {
          onConflict: "key",
        }
      );

    if (extractionError) {
      console.error(
        `❌ Extraction failed (${fragment.title})`,
        extractionError
      );

      continue;
    }

    console.log(
      `✨ Inserted fragment: ${fragment.title}`
    );
  }

  console.log(
    "🌸 Radha & Ayyub ingestion complete"
  );
}