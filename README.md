# H4I Website Redesign

# Overview

To further improve the Hack4Impact-UMD chapter website, we have been given the task of redesigning and improving the current website to better showcase Hack4Impacts mission while offering a professional and friendly user experience on an attractive user interface. 

Generally, we will be working on making the website more accessible, improving and adding new functionality for things like searching, improving the mobile version, and enhancing the look and feel of the website with new animations and styles.

The chapter website frontend is built in `React` and `TypeScript`, with a `Strapi CMS` `PostgreSQL` database for the backend. The site backend is hosted on heroku, with images stored on heroku with cloudinary. The frontend is hosted on cloudflare with surge. 

### Links

👾 [Live Deploy](https://umd.hack4impact.org/)

[Technical Design Doc](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Technical%20Design%20Doc%20f8b67954916f49bc9feb8a8f89430715.md)

         → architecture of site, initial design proposal

[User Guide/Feature List](https://www.notion.so/User-Guide-Feature-List-bd562efc39b2404fabb7cdcb9325b2cf)

          → How to add new content to the website 

          → How to use the backend

- Technical Pages/Dev Guides
    
    [Component Structure + Project Cards, Value Cards, Search, Pages](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Component%20Structure%20+%20Project%20Cards,%20Value%20Cards,%20%2076adca64cd20447f90a6a69b7ef70b32.md)
    
    [Deployment (detail)](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Deployment%20(detail)%2057ac1f04d4cf4cbc8ab339c9634081b1.md)
    
    [Manual Testing](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Manual%20Testing%2092d90d0dc8db42d5b5d351d09333b3b5.md)
    
    [Helpful Commands & Misc Important Notes Dump](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Helpful%20Commands%20&%20Misc%20Important%20Notes%20Dump%2028bdae0629b14d608f870a4f98087406.md)
    

[Known Bugs](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Known%20Bugs%207f2921a97f8c412dad57264ad2d2f6c3.md)

[CHANGELOG.md](https://www.notion.so/CHANGELOG-md-4db2ed8a908d4d86b53882cda9fe4f5c)

# Dependencies, Libraries, Frameworks

- react-bootstrap
- keen-slider
- react-router
- strapi
- react

did not use any major ui libraries, as a lot was done from scratch. nor were a lot of frameworks 

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

How to deploy (frontend): 

```jsx
cd frontend
npm build //build frontend
surge deploy // 
```

How to deploy (backend): 

```jsx
heroku push 
```

# Broad App and Content Structure

### App structure:

![Untitled](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Untitled.png)

### Content structure:

![Untitled](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Untitled%201.png)

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

`/src` is organized with `components`, `pages`, and `styles`. Both global and local styles are actually in the styles folder, which, as I’m writing this, I realize is dumb as hell because then you need to sync the organization of the `/components` and `/styles` folders. That’s for another year. 

- Pages and components: pages themselves are a kind of component! And the routing is done in App.tsx in the root folder for these pages. You would add another page in `/page`
- Media Queries: tbh we selected 1000px arbitrarily for the resize. Probably have to think about what size is better
- Custom animations: mostly css! tried to avoid heavy javascript
    - … with the exception of the search bar
- contact us section: it used to be an email link but now it is a form
    - [how does the form run]

refer to the technical pages for more
