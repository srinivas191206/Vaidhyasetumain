import React from "react";

// Translation object
const translations = {
  english: {
    test: "Test in English"
  },
  hindi: {
    test: "हिंदी में परीक्षण"
  },
  punjabi: {
    test: "ਪੰਜਾਬੀ ਵਿੱਚ ਟੈਸਟ"
  }
};

// Helper function to get translated text
const t = (language: string, key: string) => {
  return translations[language as keyof typeof translations]?.[key] || translations.english[key] || key;
};

const LanguageTest = ({ language }: { language: string }) => {
  return (
    <div>
      <h1>{t(language, "test")}</h1>
      <p>Current language: {language}</p>
    </div>
  );
};

export default LanguageTest;