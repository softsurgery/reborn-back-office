import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && storedLocale !== i18n.language) {
      i18n.changeLanguage(storedLocale);
    } else {
      setIsLanguageLoaded(true);
    }
  }, [i18n]);

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;

    router.push({ pathname, query }, asPath, { locale: newLocale }).then(() => {
      localStorage.setItem('locale', newLocale);
      i18n.changeLanguage(newLocale);
    });
  };

  if (!isLanguageLoaded) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <Select value={i18n.language} onValueChange={(value) => onToggleLanguageClick(value)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">{t('languages.fr')}</SelectItem>
          <SelectItem value="en">{t('languages.en')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
