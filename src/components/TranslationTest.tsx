import React from "react";

// Translation object
const translations = {
  english: {
    test: "Test in English"
  },
  hindi: {
    test: "हिंदी में परीक्षण"
  }
};

// Helper function to get translated text
const t = (language: string, key: string) => {
  return translations[language as keyof typeof translations]?.[key] || translations.english[key] || key;
};

const TranslationTest = ({ language }: { language: string }) => {
  return (
    <div>
      <h1>{t(language, "test")}</h1>
    </div>
  );
};

export default TranslationTest;