# Critical Fumble: Forever

A simple public polling webpage with shared live results.

## Files

- `index.html` - webpage
- `styles.css` - light navy / black / gold design
- `app.js` - poll submission and result display
- `config.js` - Supabase project settings
- `supabase.sql` - database/table/security setup

## Backend

This version uses Supabase so the page can be hosted on GitHub Pages, Netlify, Vercel, etc., while the votes remain in a shared online database.

### Setup

1. Create a free Supabase project.
2. Open Supabase -> SQL Editor.
3. Paste and run `supabase.sql`.
4. Find your project's URL and anon/public API key.
5. Put them into `config.js`.
6. Upload these files to your web host.

Do NOT put the Supabase `service_role` key in the webpage. Only the anon/public key belongs in `config.js`.

## Current poll behavior

- Polls 1, 2, 3 and 5 allow one answer.
- Poll 4 allows multiple nights.
- Results are visible to every visitor.
- Submitting votes does not require an account.

## Important note

This starter version intentionally does not collect names, email addresses, or other identifying information. It is therefore an anonymous poll.

If you want to prevent someone from voting repeatedly, we can add a sign-in, one-vote-per-browser, or other voting-control system in a later version.
