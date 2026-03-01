# Firebase API CORS Hardening Follow-Up

## Context
The Firebase Functions API currently allows all origins because `ALLOWED_ORIGINS` is unset in `/Users/stevenha/Documents/Github/umd-website-redesign/backend-firebase/functions/.env`.

This was an explicit temporary decision during backend migration validation on branch `backend-migration`.

## Required before production cutover
1. Set `ALLOWED_ORIGINS` in `/Users/stevenha/Documents/Github/umd-website-redesign/backend-firebase/functions/.env` to an explicit allowlist.
2. Include only known frontend origins (for example: production domain + preview/staging domains + localhost dev origin).
3. Redeploy Functions:
   - `cd /Users/stevenha/Documents/Github/umd-website-redesign/backend-firebase`
   - `firebase deploy --only functions --project umd-website-f3e79`
4. Verify rejected origin behavior:
   - unknown origins return `403` from API CORS policy.

## Suggested allowlist template
`ALLOWED_ORIGINS=https://your-production-domain.example,https://your-staging-domain.example,http://127.0.0.1:5173`
