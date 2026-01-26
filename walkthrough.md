# Student OS (Talapker OS) - Walkthrough

## Overview
This walkthrough guides you through the core features of the Student OS MVP.

## Prerequisites
1. Ensure you have the following environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
2. Install dependencies:
   ```bash
   npm install
   npm install react-markdown
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Feature Verification

### 1. Authentication
- **URL**: `/auth`
- **Action**: Enter your email and click "Send Code".
- **Expected**: You should receive an email with a 6-digit code. Enter it on the screen to sign in.

### 2. Dashboard
- **URL**: `/dashboard`
- **Check**:
  - User stats (GPA, IELTS, SAT) are displayed.
  - Profile completion score is accurate.
  - "Quick Actions" cards link to correct pages.

### 3. Profile Management
- **URL**: `/profile`
- **Action**: Update your GPA, IELTS, and SAT scores.
- **Expected**: Data is saved to Supabase and reflected on the Dashboard.

### 4. University Finder
- **URL**: `/universities`
- **Check**:
  - List of universities is displayed.
  - Search bar filters by name/country.
  - Filters (GPA, IELTS, Tuition) work correctly.
  - "Save" button toggles saved status (icon changes).

### 5. Chances Calculator
- **URL**: `/chances`
- **AI Errors**: Verify `GEMINI_API_KEY` is valid and has access to `gemini-1.5-flash`.
