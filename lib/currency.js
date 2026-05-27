/**
 * Currency utility — GBP ↔ NGN
 *
 * Hardcoded rate for now. To swap in a live API:
 *   1. Install: npm install node-fetch
 *   2. Replace `getExchangeRate` with a fetch to:
 *      https://v6.exchangerate-api.com/v6/{EXCHANGE_RATE_API_KEY}/pair/GBP/NGN
 *      or Fixer: https://data.fixer.io/api/latest?base=GBP&symbols=NGN&access_key=KEY
 */

const HARDCODED_GBP_TO_NGN = Number(process.env.GBP_TO_NGN_RATE) || 1800;

// ── Rate fetching ─────────────────────────────────────────────────────────────
export async function getExchangeRate() {
  // To use live rates, uncomment and configure:
  // try {
  //   const res = await fetch(
  //     `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/GBP/NGN`,
  //     { next: { revalidate: 3600 } } // Cache for 1 hour (Next.js fetch cache)
  //   );
  //   const data = await res.json();
  //   return data.conversion_rate;
  // } catch { /* fall through to hardcoded */ }
  return HARDCODED_GBP_TO_NGN;
}

// ── Conversion helpers ────────────────────────────────────────────────────────

/** Convert pence (GBP) → pennies-equivalent in NGN (kobo) */
export function gbpPenceToNgnKobo(pence, rate = HARDCODED_GBP_TO_NGN) {
  const gbp = pence / 100;
  const ngn = gbp * rate;
  return Math.round(ngn * 100); // kobo
}

/** Convert pence → pounds float */
export const penceToPounds = (pence) => pence / 100;

/** Convert kobo → naira float */
export const koboToNaira = (kobo) => kobo / 100;

// ── Formatting ────────────────────────────────────────────────────────────────

/**
 * Format a pence value for display.
 * @param {number} pence   - Price in pence (e.g. 5999)
 * @param {'gbp'|'ngn'} currency
 * @param {number} rate    - GBP→NGN rate
 */
export function formatPrice(pence, currency = 'gbp', rate = HARDCODED_GBP_TO_NGN) {
  const safeAmount = typeof pence === 'number' && isFinite(pence) ? pence : 0;

  if (currency === 'gbp') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(safeAmount / 100);
  }

  // NGN
  const ngn = (safeAmount / 100) * rate;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ngn);
}

/** Returns the amount in the smallest unit for the given currency + provider */
export function toSmallestUnit(pence, currency = 'gbp', rate = HARDCODED_GBP_TO_NGN) {
  if (currency === 'gbp') return pence;           // Stripe: pence
  return gbpPenceToNgnKobo(pence, rate);          // Paystack: kobo
}
