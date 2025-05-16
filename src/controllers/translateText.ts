import {
  DeepLClient,
  SourceLanguageCode,
  TargetLanguageCode,
} from 'deepl-node';
import { getCachedTranslation, cacheTranslation } from './cacheTranslation.js';
import { DEEPL_API_KEY } from '../utils/const.env.js';

const authKey = DEEPL_API_KEY;
const translator = new DeepLClient(authKey);

export const translateText = async (
  originalText: string,
  sourceLanguage: SourceLanguageCode,
  targetLanguage: TargetLanguageCode
  // newTranslation: string
): Promise<string> => {
  // Check if translation exists in the cache for the given direction
  const cachedTranslation = await getCachedTranslation(
    originalText,
    sourceLanguage,
    targetLanguage
  );

  if (cachedTranslation) {
    console.log('Using cached translation:', cachedTranslation);
    return cachedTranslation; // Return cached translation if it exists
  }

  // If not found in cache, simulate translation (or call an API)

  // TODO Add API Call
  const newTranslation = await translator.translateText(
    originalText,
    sourceLanguage,
    targetLanguage,
    { formality: 'prefer_less' }
  );

  console.log('No cached translation, creating new translation...');
  await cacheTranslation(
    originalText,
    newTranslation.text,
    sourceLanguage,
    targetLanguage
  ); // Save translation to cache

  return newTranslation.text; // Return the new translation
};
