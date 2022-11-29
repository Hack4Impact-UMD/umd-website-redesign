# Deployment (detail)

# Test frontend

There is a test version of the frontend. it is hosted on netlify

- [https://resonant-begonia-90fe13.netlify.app/](https://resonant-begonia-90fe13.netlify.app/)
- deployed with netlify, ([https://app.netlify.com/sites/resonant-begonia-90fe13/deploys](https://app.netlify.com/sites/resonant-begonia-90fe13/deploys))
- command is `yarn build` ; and an env variable `[CI = false](https://docs.netlify.com/configure-builds/environment-variables/#declare-variables)` ; note. [you should probably change CI to be true](https://answers.netlify.com/t/new-ci-true-build-configuration-treating-warnings-as-errors-because-process-env-ci-true/14434)/ get rid of the warnings. it currently deployed with warnings for speed

# Backend deploy commands

so the backend is actually deployed off a branch (as of 2022 summer) 

deploying a subdirectory to heroku: [https://jtway.co/deploying-subdirectory-projects-to-heroku-f31ed65f3f2](https://jtway.co/deploying-subdirectory-projects-to-heroku-f31ed65f3f2)

`git subtree push --prefix backend heroku master` 

### extra reading:

heroku pipelines: [https://devcenter.heroku.com/articles/pipelines](https://devcenter.heroku.com/articles/pipelines)

### also we host the images on cloudinary because at the time we didn’t have money

on cloudinary (what we use to host images)

- tutorial used: [https://market.strapi.io/providers/@strapi-provider-upload-cloudinary](https://market.strapi.io/providers/@strapi-provider-upload-cloudinary)
- docs: [https://cloudinary.com/documentation/how_to_integrate_cloudinary](https://cloudinary.com/documentation/how_to_integrate_cloudinary)
- how to look at our actual files: [https://cloudinary.com/console/c-e10365540457b5323ada198fade44f/media_library/folders/home](https://cloudinary.com/console/c-e10365540457b5323ada198fade44f/media_library/folders/home)

can also access from heroku console

![Untitled](Deployment%20(detail)%2057ac1f04d4cf4cbc8ab339c9634081b1/Untitled.png)