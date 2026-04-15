// ISO 27001 Password Policy Utilities

export const PASSWORD_RULES = [
  { id: 'length', label: 'Minimal 12 karakter', test: (p: string) => p.length >= 12 },
  { id: 'upper', label: 'Huruf besar (A-Z)', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'Huruf kecil (a-z)', test: (p: string) => /[a-z]/.test(p) },
  { id: 'number', label: 'Angka (0-9)', test: (p: string) => /[0-9]/.test(p) },
  { id: 'special', label: 'Simbol khusus (!@#$%^&*)', test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
  { id: 'noRepeat', label: 'Tidak ada karakter berulang 3x', test: (p: string) => !/(.)\1{2,}/.test(p) },
];

export function generateSecurePassword(length = 16): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specials = '!@#$%^&*_+-=';
  const all = upper + lower + digits + specials;

  // Guarantee at least one of each category
  let pw = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ];

  for (let i = pw.length; i < length; i++) {
    pw.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle
  for (let i = pw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pw[i], pw[j]] = [pw[j], pw[i]];
  }

  return pw.join('');
}
