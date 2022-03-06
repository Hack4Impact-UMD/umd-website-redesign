# Pull Request Etiquette

### 1. The title of the pull request should be a brief description of the task completed.
### 2. Include a description of things you added/changed.
### 3. Provide a list of dependencies you used. 
### 4. Send a Slack message to the tech leads that you made a PR.
####

Example in Command Line:

git commit -m "Subject" -m "Description"

Your subject should be the task you were assigned or something that you fixed (i.e add green button component, or fix blank bug). Keep the subject line concise.

In your description, you should include more detail about what you added/changed, and provide a list of dependencies used.

# Testing Guide
### 1. Usability Testing
#### * Check to make sure your task "looks right" and is easy to use for the user (i.e there are no spelling mistakes in your text, the alignment is correct, font and size, color, etc. are all correct.)
### 2. Functional Testing
#### * Check to make sure your task "does the right thing" (i.e The About Us in the navigation bar takes the user to the About Us page, the social media logos takes the user to the correct social media page, etc.)


# Features and Best Practices to Use:
### CSS Modules
###   - has local scope by default, which we like
###   - makes sure that style applies to only the component and nothing else
###   - Avoid using CSS expressions or functions like calc(), it slows down the page, use attributes like box-sizing instead

### Prettier
###   - Use Prettier in VSCode for consistent style throughout your code.

### Avoid using global variables


