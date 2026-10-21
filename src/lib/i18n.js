export const LANGS = ['ru', 'en'];

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function homeUrl(lang, hash = '') {
  return `${BASE}${lang === 'en' ? '/en' : ''}/${hash}`;
}

export function caseUrl(lang, slug, hash = '') {
  return `${BASE}${lang === 'en' ? '/en' : ''}/cases/${slug}/${hash}`;
}

export function assetUrl(path) {
  return `${BASE}/${path}`;
}

export const UI = {
  ru: {
    all: 'Все работы', toc: 'Разделы', next: 'Следующий кейс', first: 'К первому кейсу',
    live: 'Живой прототип', lives: 'Живые прототипы', liveChip: 'живой прототип',
    title: 'продуктовый дизайнер',
    description: 'Продуктовый дизайнер: медицинская информационная система ФИЦ Биомед и конструктор роботов MANGO OFFICE.',
  },
  en: {
    all: 'All work', toc: 'Contents', next: 'Next case', first: 'Back to the first case',
    live: 'Live prototype', lives: 'Live prototypes', liveChip: 'live prototype',
    title: 'product designer',
    description: 'Product designer: the FIC Biomed medical information system and the MANGO OFFICE robot builder.',
  },
};

export const GROUPS = {
  fic: { ru: 'ФИЦ Биомед', en: 'FIC Biomed' },
  mango: { ru: 'MANGO OFFICE', en: 'MANGO OFFICE' },
};

export const LIVE_TAB = { rack: { ru: 'Штатив', en: 'Rack' }, form: { ru: 'Анкета', en: 'Questionnaire' }, ai: { ru: 'AI-робот', en: 'AI robot' } };

export const DEMO_TXT = {
  rack: {
    ru: ['Отсканируйте пробирку', 'Сканер подключается к компьютеру как клавиатура: печатает код и нажимает Enter. Щёлкните по наклейке со штрихкодом или введите код в поле сканера.'],
    en: ['Scan a tube', 'A scanner connects to the computer as a keyboard: it types the code and presses Enter. Click a barcode sticker or type a code into the scanner field.'],
  },
  form: {
    ru: ['Исправьте поле по замечанию', 'Врач вернул анкету с одним замечанием. Нажмите «К полю», впишите год, и замечание снимется само. Данные вымышленные.'],
    en: ['Fix a field after a comment', 'The doctor returned the questionnaire with one comment. Press “Go to field”, enter a year, and the comment clears by itself. The data is fictional.'],
  },
  ai: {
    ru: ['Скажите что-нибудь кофейне', 'Модель относит фразу к категории по смыслу. Если ни одна категория не набрала порог в 30 %, срабатывают ключевые слова. Проценты здесь считает простой подсчёт совпадений, настоящая модель устроена иначе.'],
    en: ['Say something to a coffee shop', 'The model assigns a phrase to a category by meaning. If no category reaches the 30 % threshold, keywords take over. Here the percentages come from simple word matching; the real model works differently.'],
  },
};
