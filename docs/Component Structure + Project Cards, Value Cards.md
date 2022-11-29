# Component Structure + Project Cards, Value Cards, Search, Pages

# Component Structure + Pages

Components (as they should be) were created so that they could be used modularly. 

- page specific components were stored in their own folder
- …. ngl we dont have a folder for global components (i.e buttons)
    - ….. :) theyre there though

There was also not too many components that were compositions of other components (with the exception of the Faq, and pages).  

- This means for most components, you should be able to find them in their own file, so you don’t have to look in a single file.

There are two global components the wrap the entire page in `App.tsx`. Those components are the navbar and the footer. 

- display: they both have to be relative because its better for the content in between to render that way (which sometimes can cause resizing issues, but who goes on safari at 15%.)
- they’re global because code reduction, and there is an assumption that every page will need the navigation and footer

### style

- yeah sometimes theres just a fat path for svgs

![Untitled](Component%20Structure%20+%20Project%20Cards,%20Value%20Cards,%20%2076adca64cd20447f90a6a69b7ef70b32/Untitled.png)

# Routing

- routes for all the normal pages (/aboutus, /ourwork, /apply) are fixed.
    - the routes for the project pages are generated dynamically, and from strapi content
        - when you visit /ourwork/project → site pulls from strapi and renders the page
        - when you visit /ourwork/ and see all the projects, site pulls from the list of projects on strapi, and renders the page

# Project and Value Cards

- These are pure css, no js need apply
- Can get weird with sizing, can get weird with grid:

# Search

The implementation of the search is a little bit >.<. oh my god. 

- it’s all javascript search
- it’s also all custom, so all the search by “project, nonprofit, team member, season, or year” was manually implemented
- probably would have been better to use a framework

# Project pages:

- the projects fetch from strapi with axios, into variable `projects` in `Projects.tsx`. there is no browser cookie storage.
- oh my god the implementation is so gross
    - it’s like this because it’s what made it work: i am not proud
    - there has to be a better way to

```jsx
<div>
        <div className={styles.featuredProjectCards}>
        {/*if display current projects, show current projects title*/}
        {props.isFeatured?null: <h2 id={styles.sectionTitle}>Current Projects</h2>}
          {!projects ? projects : 
           projects.map((item, index) =>(
              <FeaturedProjectCard
                key={index}
                link={"ourwork/" + item["attributes"]["path"]}
                title={item["attributes"]["title"]}
                date={item["attributes"]["startDate"] ? getSeason((item["attributes"]["startDate"] as string).substring(5,7) as unknown as number) +  " " + (item["attributes"]["startDate"] as string).substring(0,4) : ""}
                summary={item["attributes"]["summary"]}
                image={item['attributes']["image"]['data'] ? item['attributes']["image"]["data"][0]["attributes"]["url"] : "https://plugins.jetbrains.com/files/16260/113019/icon/pluginIcon.png"}
                altText={item["attributes"]["imageAltText"]}
              />
           ))}
        </div>
        {/**display see more button if showing featured projects */}
        {props.isFeatured? <div className={styles.seeMore} >
          <StandardButton text="See More" color="blue" link="/ourwork" />
        </div>: null}
        
      </div>
```