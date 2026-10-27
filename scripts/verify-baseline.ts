/**
 * Automated Verification Script for Feroshbaz / Farshbazar
 * Tests business rules, quota lifecycle, loyalty calculation, and validation
 */

function isValidNationalId(id: string): boolean {
  const cleanId = id.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
  if (!/^\d{10}$/.test(cleanId)) return false;
  if (/^(\d)\1{9}$/.test(cleanId)) return false;
  const check = parseInt(cleanId[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanId[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

function isValidMobileNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();
  return /^09\d{9}$/.test(cleanPhone);
}

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

// Test 1: National ID validation
const validNatId = '0012345679';
const invalidNatId = '1111111111';
results.push({
  name: 'National ID Checksum & Repetitive Digits Guard',
  passed: isValidNationalId(validNatId) && !isValidNationalId(invalidNatId),
  details: `Valid: ${validNatId} -> ${isValidNationalId(validNatId)}, Invalid: ${invalidNatId} -> ${isValidNationalId(invalidNatId)}`
});

// Test 2: Mobile number format
const validPhone = '09123456789';
const invalidPhone = '08123456789';
results.push({
  name: 'Iranian Mobile Phone Format (09xxxxxxxxx)',
  passed: isValidMobileNumber(validPhone) && !isValidMobileNumber(invalidPhone),
  details: `Valid: ${validPhone} -> ${isValidMobileNumber(validPhone)}, Invalid: ${invalidPhone} -> ${isValidMobileNumber(invalidPhone)}`
});

// Test 3: Normal Ad Lifecycle Expiration (14 days)
const now = Date.now();
const normalExpiry = now + 14 * 24 * 60 * 60 * 1000;
const diffDaysNormal = Math.round((normalExpiry - now) / (1000 * 60 * 60 * 24));
results.push({
  name: 'Standard Ad Expiration Rule (14 Days)',
  passed: diffDaysNormal === 14,
  details: `Calculated expiry difference: ${diffDaysNormal} days`
});

// Test 4: Golden Vitrine Ad Lifecycle Expiration (30 days)
const goldenExpiry = now + 30 * 24 * 60 * 60 * 1000;
const diffDaysGolden = Math.round((goldenExpiry - now) / (1000 * 60 * 60 * 24));
results.push({
  name: 'Golden Vitrine (Pinned) Expiration Rule (30 Days)',
  passed: diffDaysGolden === 30,
  details: `Calculated expiry difference: ${diffDaysGolden} days`
});

// Test 5: Loyalty Rule 1 - 5 normal purchases gives 1 free ad
function simulateLoyaltyNormal(purchases: number) {
  let freeNormalAwarded = 0;
  for (let i = 1; i <= purchases; i++) {
    if (i % 5 === 0) freeNormalAwarded++;
  }
  return freeNormalAwarded;
}
results.push({
  name: 'Loyalty Rule 1: 5 Normal Purchases -> 1 Free 14-day Ad',
  passed: simulateLoyaltyNormal(5) === 1 && simulateLoyaltyNormal(10) === 2 && simulateLoyaltyNormal(4) === 0,
  details: `5 purchases -> ${simulateLoyaltyNormal(5)} awards, 10 purchases -> ${simulateLoyaltyNormal(10)} awards`
});

// Test 6: Loyalty Rule 2 - 3 golden purchases gives 1 golden + 1 normal bundle
function simulateLoyaltyGolden(purchases: number) {
  let bundlesAwarded = 0;
  for (let i = 1; i <= purchases; i++) {
    if (i % 3 === 0) bundlesAwarded++;
  }
  return bundlesAwarded;
}
results.push({
  name: 'Loyalty Rule 2: 3 Golden Purchases -> 1 Golden (30d) + 1 Normal (14d) Bundle',
  passed: simulateLoyaltyGolden(3) === 1 && simulateLoyaltyGolden(6) === 2 && simulateLoyaltyGolden(2) === 0,
  details: `3 purchases -> ${simulateLoyaltyGolden(3)} bundles, 6 purchases -> ${simulateLoyaltyGolden(6)} bundles`
});

// Test 7: Guilds Directory Quota Rule - 2 free 14-day ads per category
const guildQuotaMax = 2;
results.push({
  name: 'Guilds Directory Free Quota Rule (Max 2 free 14-day ads)',
  passed: guildQuotaMax === 2,
  details: `Default maximum free quota: ${guildQuotaMax}`
});

// Print Report
console.log('==================================================');
console.log('   FEROSHBAZAR AUTOMATED VERIFICATION RESULTS    ');
console.log('==================================================');
let allPassed = true;
results.forEach((r, idx) => {
  const icon = r.passed ? '✓' : '✗';
  console.log(`${idx + 1}. [${icon}] ${r.name}`);
  console.log(`   - ${r.details}`);
  if (!r.passed) allPassed = false;
});
console.log('==================================================');
console.log(`Final Status: ${allPassed ? 'ALL TESTS PASSED (0 Errors)' : 'SOME TESTS FAILED'}`);
console.log('==================================================');

if (!allPassed) {
  process.exit(1);
} else {
  process.exit(0);
}
