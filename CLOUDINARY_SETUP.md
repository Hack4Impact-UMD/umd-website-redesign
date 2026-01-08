# Cloudinary Setup for Persistent File Uploads

## Problem Identified

**Root Cause: Heroku Ephemeral Filesystem**

The backend is deployed on Heroku, which uses an ephemeral filesystem. Any files uploaded locally are **deleted every ~24 hours** when the dyno restarts.

**Evidence:**
- Christine Niu and Steven Ha's photos (e.g., "HS.jpg") were uploaded to the CMS
- They worked initially but disappeared after dyno restart
- Database still has upload records, but actual files are gone
- Existing member photos use Cloudinary URLs (`https://res.cloudinary.com/...`) and persist correctly
- New uploads use local paths (`/uploads/...`) which get deleted

## Solution: Configure Cloudinary for Persistent Storage

### 1. Install Dependencies

On Heroku or your production environment, run:

```bash
npm install @strapi/provider-upload-cloudinary
```

This has already been added to `backend/package.json`.

### 2. Set Up Cloudinary Account

1. Sign up for a free Cloudinary account at https://cloudinary.com (if not already done)
2. Get your credentials from the Cloudinary dashboard:
   - Cloud Name
   - API Key
   - API Secret

**Note:** It appears your team already has a Cloudinary account (`hgsfykuq4`) based on existing member photo URLs.

### 3. Configure Heroku Environment Variables

Set the following environment variables on Heroku:

```bash
heroku config:set CLOUDINARY_NAME=your_cloud_name
heroku config:set CLOUDINARY_KEY=your_api_key
heroku config:set CLOUDINARY_SECRET=your_api_secret
```

Or via the Heroku Dashboard:
1. Go to https://dashboard.heroku.com
2. Select your app (`chapter-website-backend`)
3. Navigate to Settings → Config Vars
4. Add these three variables

### 4. Deploy the Changes

The following files have been created/updated:

- ✅ `/backend/config/plugins.js` - Cloudinary upload configuration
- ✅ `/backend/package.json` - Added `@strapi/provider-upload-cloudinary` dependency

Deploy to Heroku:

```bash
git add backend/config/plugins.js backend/package.json
git commit -m "Configure Cloudinary for persistent file uploads on Heroku"
git push heroku main
```

Or trigger a deployment through your CI/CD pipeline if configured.

### 5. Re-upload Christine Niu and Steven Ha's Photos

After deployment:

1. Log in to Strapi admin: `https://chapter-website-backend.herokuapp.com/admin`
2. Navigate to Content Manager → Members
3. Find or create entries for Christine Niu and Steven Ha
4. Upload their avatar photos
5. Publish the entries

**This time, the photos will be uploaded to Cloudinary and persist permanently.**

## Verification

After setup, new uploads should:
- Return URLs starting with `https://res.cloudinary.com/`
- Persist across dyno restarts
- Be accessible from the frontend

## Frontend Fix (Already Implemented)

The frontend has been updated with:
- Safe null-checking using optional chaining (`?.`)
- Graceful fallback to default profile pictures
- Better error handling for missing/malformed data

These changes are in `frontend/src/pages/AboutUs.tsx:62612dc`

## Additional Notes

- Local development will continue using local file storage (SQLite)
- Production (Heroku) will use Cloudinary
- All future uploads on production will automatically go to Cloudinary
- Old uploads using local storage may need to be re-uploaded

## Troubleshooting

If images still don't show after setup:

1. Verify Cloudinary env vars are set on Heroku: `heroku config`
2. Check Heroku logs: `heroku logs --tail`
3. Ensure Strapi rebuild completed: Check build logs in Heroku dashboard
4. Clear browser cache and hard refresh the frontend
5. Verify upload URLs in Strapi Media Library start with `https://res.cloudinary.com/`

## Related Documentation

- Strapi Upload Provider: https://docs.strapi.io/dev-docs/providers
- Cloudinary Upload Provider: https://market.strapi.io/providers/@strapi-provider-upload-cloudinary
- Heroku Ephemeral Filesystem: https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem
