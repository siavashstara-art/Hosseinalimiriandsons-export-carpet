# Implementation Plan - User Profile Enhancements & Gamified Carpet Market System

## User Requirements Addressed
1. **Referral Code & Profile Registration:** Assign a unique referral code (e.g. `ALIMIRI-[ID]`) upon user registration/login.
2. **Daily Attendance XP & Streaks:** Award XP daily upon opening the app / checking in, maintaining activity streaks and tracking presence.
3. **Daily League Rankings:** Display user ranking in the daily referral/activity league based on XP and attendance.
4. **Monthly Tenure Star Rewards:** Award legendary stars based on the number of months the user has been active in the platform.
5. **Profile Listing Management:** Provide a dedicated ad creation and management section within each user's profile, displaying remaining/active listings count and quick access.
6. **Province Listing Browser:** Dedicated section to access all listings and filter them by province/city.

---

## Proposed Changes

### 1. Types & State (`src/types/index.ts` & App state)
- Add user profile extension fields: `referralCode`, `xp`, `attendanceStreak`, `lastCheckInDate`, `activeMonthsCount`, `legendaryStars`, `remainingAdQuota`, `myListings`.

### 2. User Profile & Attendance Component (`src/components/UserProfileModal.tsx` or BoothManager)
- Build a dedicated User Profile Modal/Dashboard showing:
  - Unique referral code with copy-to-clipboard button.
  - Daily attendance check-in button (grants +50 XP and increments streak).
  - Monthly tenure stars badge counter.
  - Remaining free ad quota and quick post ad form.
  - My listings list with deletion/status toggle.

### 3. Province Listing Filter & Browse (`src/components/PublicHomeListings.tsx`)
- Enhance listing browser to filter listings by selected province and city with remaining quota indicators.

---

## Verification Plan
- Verify user registration generates unique referral code.
- Verify daily attendance check-in increases XP and streak.
- Verify listing creation updates remaining quota and displays in profile and province browser.
- Run `compile_applet` to ensure clean TypeScript build.
