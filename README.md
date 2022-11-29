# H4I Website Redesign

# Overview

To further improve the Hack4Impact-UMD chapter website, we have been given the task of redesigning and improving the current website to better showcase Hack4Impacts mission while offering a professional and friendly user experience on an attractive user interface. 

Generally, we will be working on making the website more accessible, improving and adding new functionality for things like searching, improving the mobile version, and enhancing the look and feel of the website with new animations and styles.

The chapter website frontend is built in `React` and `TypeScript`, with a `Strapi CMS` `PostgreSQL` database for the backend. The site backend is hosted on heroku, with images stored on heroku with cloudinary. The frontend is hosted on cloudflare with surge. 

### Links

- 👾 [Live Deploy](https://umd.hack4impact.org/)
- [Technical Design Doc](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Technical%20Design%20Doc%20f8b67954916f49bc9feb8a8f89430715.md):  includes some architecture of site, initial design proposal
- [User Guide/Feature List](https://www.notion.so/User-Guide-Feature-List-bd562efc39b2404fabb7cdcb9325b2cf): request access! 
    - How to add new content to the website 
    - How to use the CMS backend
- Technical Pages/Dev Guides
    * [Component Structure + Project Cards, Value Cards, Search, Pages](https://github.com/Hack4Impact-UMD/umd-website-redesign/blob/main/docs/Component%20Structure%20%2B%20Project%20Cards%2C%20Value%20Cards.md)
    * [Deployment (detail)](https://www.notion.so/Deployment-detail-57ac1f04d4cf4cbc8ab339c9634081b1d): request access! 
    * [Manual Testing](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Manual%20Testing%2092d90d0dc8db42d5b5d351d09333b3b5.md) 
    * [Helpful Commands & Misc Important Notes Dump](https://github.com/Hack4Impact-UMD/umd-website-redesign/blob/main/docs/Helpful%20Commands%20%26%20Misc%20Important%20Notes%20Dump.md) 
    * [Known Bugs](https://www.notion.so/h4i/Known-Bugs-7f2921a97f8c412dad57264ad2d2f6c3)
- [CHANGELOG.md](https://github.com/Hack4Impact-UMD/umd-website-redesign/blob/main/CHANGELOG.md): request access! 

# Dependencies, Libraries, Frameworks
- react-bootstrap
- keen-slider
- react-router
- strapi
- react
Did not use any major ui libraries nor frameworks as many components were created from scratch.

# How To Run and Deploy Project

How to run frontend, located in `/frontend`: 

```jsx
npm install —legacy-peer-deps //installs required dependencies
npm start //launches the website on the front-end
```

How to run backend, located in `/backend`:

```jsx
npm install —legacy-peer-deps //installs required dependencies
npm start //launches the backend
```

# Broad App and Content Structure

### App structure:

![app-structure](https://user-images.githubusercontent.com/45301066/204440249-363aea5e-616f-494d-aa22-40eccdd9ee5a.png)

### Content structure:

![content-structure](https://user-images.githubusercontent.com/45301066/204440267-879ee43a-c5c3-4da8-80c0-b837e4efe89c.png)

Notes: 

- Why use a list for roles, with isDisplayRole?
    - content structure limitations with strapi.
- why is there startDate, endDate in roles, where are they used?
    - unsure, actually
- why is isDisplayRole a field?
    - sometimes, you can be a board member, but have another role simultaneously
- an ideal design would be to have a list of roles for a member, and then a field that points to one of those roles called displayRole
    - can’t do that due to strapi limitations, however

Read more about Strapi content structure here: [https://docs.strapi.io/user-docs/latest/content-types-builder/introduction-to-content-types-builder.html](https://docs.strapi.io/user-docs/latest/content-types-builder/introduction-to-content-types-builder.html)

## Other glossing notes:

### Frontend

`/src` is organized with `components`, `pages`, and `styles`. Both global and local styles are actually in the styles folder, which, as I’m writing this, I realize is not ideal because then you need to sync the organization of the `/components` and `/styles` folders. That’s for another year. 

- Pages and components: pages themselves are a kind of component! And the routing is done in App.tsx in the root folder for these pages. You would add another page in `/page`
- Media Queries: tbh we selected 1000px arbitrarily for the resize. Probably have to think about what size is better
- Custom animations: mostly css! tried to avoid heavy javascript
    - … with the exception of the search bar
- contact us section: it used to be an email link but now it is a form

refer to the technical pages for more
