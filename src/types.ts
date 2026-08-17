export type ContentCategory = 'zikr' | 'dua' | 'ayet' | 'esma';

export type ContentSource = 'preset' | 'custom';

export type PracticeItem = {
  id: string;
  title: string;
  arabic?: string;
  latin?: string;
  meaning?: string;
  note?: string;
  target?: number;
  category: ContentCategory;
  source: ContentSource;
};

export type CustomPracticeItem = PracticeItem & {
  source: 'custom';
  createdAt: string;
};

export type CustomPracticeInput = {
  title: string;
  arabic?: string;
  latin?: string;
  meaning?: string;
  note?: string;
  target?: number;
  category: Exclude<ContentCategory, 'esma'>;
};

export type TabKey = 'home' | 'counter' | 'library' | 'asma' | 'custom';
