import Translation from '../models/Translation.js';

const key = (from: string, to: string) => `${from}-${to}`;

export async function getCachedTranslation(
  originalText: string,
  sourceLang: string,
  targetLang: string
): Promise<string | null> {
  const langKey = key(sourceLang, targetLang);

  const doc = await Translation.findOne({ originalText });

  if (doc?.translations?.has(langKey)) {
    return doc.translations.get(langKey) || null;
  }

  // Try reverse: maybe originalText is the translation
  const reverseKey = `${targetLang}-${sourceLang}`;
  const candidates = await Translation.find({
    [`translations.${reverseKey}`]: originalText,
  });

  if (candidates.length > 0) {
    // Return the originalText stored in DB as the reverse translation
    return candidates[0].originalText;
  }

  return null;
}

export async function cacheTranslation(
  sourceText: string,
  translatedText: string,
  sourceLang: string,
  targetLang: string
): Promise<void> {
  const forwardKey = key(sourceLang, targetLang);
  const reverseKey = key(targetLang, sourceLang);

  console.log({ forwardKey });
  console.log({ reverseKey });
  console.log({ sourceText });
  console.log({ translatedText });
  console.log({ sourceLang });
  console.log({ targetLang });

  // Try to find existing doc with sourceText
  let doc = await Translation.findOne({ originalText: sourceText });

  if (!doc) {
    // If not found, try reverse (maybe translatedText is already in DB)
    doc = await Translation.findOne({ originalText: translatedText });

    if (doc) {
      // Reverse doc found, just add missing translation key(s)
      if (!doc.translations.has(reverseKey)) {
        doc.translations.set(reverseKey, sourceText);
        await doc.save();
      }
      if (!doc.translations.has(forwardKey)) {
        doc.translations.set(forwardKey, translatedText);
        await doc.save();
      }
      return;
    }

    await Translation.create({
      originalText: sourceText,
      language: sourceLang,
      translations: new Map<string, string>([
        [forwardKey, translatedText],
        [reverseKey, sourceText],
      ]),
    });
    return;
  }

  // Found a doc — patch it
  let updated = false;
  if (!doc.translations.has(forwardKey)) {
    doc.translations.set(forwardKey, translatedText);
    updated = true;
  }
  if (!doc.translations.has(reverseKey)) {
    doc.translations.set(reverseKey, sourceText);
    updated = true;
  }

  doc.set({ $inc: { count: 1 } });

  await doc.save();
}
