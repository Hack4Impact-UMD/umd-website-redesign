# Technical Design Doc

## **Frontend Tool Decision**

The current codebase consisted of React and TypeScript for the front end upon receiving the project. This was a good stack to move forward with because of its popularity and prominence in the industry. The team also all had previous experience with React and TypeScript. The problem with using a different tech stack is that a brings a risk of failing to meet the deadline for the project, because of the time it would take to replace the code base and complete new tasks.

## **Frontend Style Decisions**

For our frontend, we’ve decided to build a lot of the components with custom css and using css modules. The components in the design (various gradients, interesting footer/header interactions and animations, cards that have fronts and backs) are not exactly typical of existing UI frameworks or libraries (bootstrap, vue). We are using css modules because it helps keep css local to components, but still readable. 

Because of the popularity of phones and the fact that users might want to view the website on their phones, we’ve made the website mobile ready. Some of the big changes that occur when going from desktop to mobile are the hamburger menu. As the view width of the website gets smaller, the navigation links in the navigation bar get squeezed together making it hard to click on the desired link. To fix this, a hamburger menu is used to hold all of the links and display them in a top-down view instead of side by side for easy access on small screen sizes.

 Other important elements of the website we’ve accounted for on mobile devices are the member grids displayed on the projects pages and the About Us page, as well as the footer. Throughout the site on mobile and desktop is the use of different z-indices. Elements with higher z-indices are elements that are important and need to be shown. For example, the scroll to the top button is given a z-index of 99, which is higher than most elements on the site. This is because we want to ensure this button is guaranteed to show when the user scrolls down the website and wants to go back to the top. This also means this button will appear on top of other elements when close enough. On the site, we have bolded certain words to ensure the user knows what he/she is viewing on a certain part of the website.

## **Backend Tool Decision**

For the backend, we are using Heroku/Strapi. We decided to go with Strapi because it makes it easy for non-technical people to manage most of the content on the website including project images, member information, and more. Strapi makes it easy to update or add new content to the website with its straightforward user interface. Furthermore, Strapi is a headless CMS, which gives our team a lot of flexibility with a pretty custom UI, as opposed to other cms like Wordpress, and is also very lightweight. This size fits the size of our organization and the goals of the Hack4Impact website. Upon receiving the project, Strapi was already being used which is another reason we are using Strapi.