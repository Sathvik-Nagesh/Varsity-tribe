export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const locales: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'en-DE', // or 'de-DE' or 'en-IE'
    GBP: 'en-GB',
  };

  const locale = locales[currency] || 'en-IN';

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });

  return formatter.format(amount);
}
