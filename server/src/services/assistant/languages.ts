export interface AssistantLanguage { code: string; englishName: string; nativeName: string; speechTag: string; }
export const ASSISTANT_LANGUAGES: AssistantLanguage[] = [
  { code: 'en', englishName: 'English', nativeName: 'English', speechTag: 'en-IN' },
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', speechTag: 'hi-IN' },
  { code: 'te', englishName: 'Telugu', nativeName: 'తెలుగు', speechTag: 'te-IN' },
  { code: 'ta', englishName: 'Tamil', nativeName: 'தமிழ்', speechTag: 'ta-IN' },
  { code: 'kn', englishName: 'Kannada', nativeName: 'ಕನ್ನಡ', speechTag: 'kn-IN' },
  { code: 'ml', englishName: 'Malayalam', nativeName: 'മലയാളം', speechTag: 'ml-IN' },
  { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', speechTag: 'bn-IN' },
  { code: 'mr', englishName: 'Marathi', nativeName: 'मराठी', speechTag: 'mr-IN' },
  { code: 'gu', englishName: 'Gujarati', nativeName: 'ગુજરાતી', speechTag: 'gu-IN' },
  { code: 'pa', englishName: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechTag: 'pa-IN' },
  { code: 'or', englishName: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechTag: 'or-IN' },
  { code: 'ur', englishName: 'Urdu', nativeName: 'اردو', speechTag: 'ur-IN' }
];
export const languageByCode = (code: string) => ASSISTANT_LANGUAGES.find((language) => language.code === code);
