const elementsFa = [
  "هیدروژن",
  "هلیم",
  "لیتیم",
  "بور",
  "کربن",
  "نیتروژن",
  "اکسیژن",
  "فلوئور",
  "نئون",
  "سدیم",
  "منیزیم",
  "آلومینیوم",
  "سیلیسیم",
  "فسفر",
  "گوگرد",
  "کلر",
  "آرگون",
  "پتاسیم",
  "کلسیم",
  "تیتانیم",
  "کروم",
  "منگنز",
  "آهن",
  "کبالت",
  "نیکل",
  "مس",
  "روی",
  "گالیم",
  "ژرمانیم",
  "آرسنیک",
  "سلنیوم",
  "برم",
  "استرانسیم",
  "نقره",
  "قلع",
  "ید",
  "زنون",
  "سزیم",
  "پلاتین",
  "طلا",
  "جیوه",
  "سرب",
  "بیسموت",
  "رادیم",
  "اورانیم",
];

export function generateRandomTeamName(): string {
  const index = Math.floor(Math.random() * elementsFa.length);
  return elementsFa[index];
}
