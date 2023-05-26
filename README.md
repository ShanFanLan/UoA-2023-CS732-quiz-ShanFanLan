# COMPSCI 732 / SOFTENG 750 Quiz &ndash; Yet Another Pokémon Browser ™️
In this quiz, you'll demonstrate your skill in *understanding* the codebase of an existing MERN-stack app, *modifying* the codebase to add an extra end-to-end feature, and *styling* the app to improve its usability and visual impact.

The quiz is worth **20%** of your final grade for the course. It is expected to be completed **individually**. Detected instances of plagiarism will result in 0 marks for the quiz, and potential disciplinary action.

In addition, please **do not make any of this code public, even after you have completed the course**. It takes an enormous amount of effort to prepare assessment materials like this, and making the code available publically will significantly hamper our ability to reuse any of it.

To complete the quiz, please follow the tasks below. Each task is given an indicative weighting towards the overall quiz grade.


## Task Zero: Understanding the existing project *(0%, but you should really do it anyway!!)*
You're given the frontend and backend of an existing MERN-stack app to play with. In addition, you're given a database initialization script to help get setup.

### 0.1: Installation
1. First, make sure you have the latest version of [**npm**](https://nodejs.org/en) installed on your machine, then run `npm install` in both the frontend and backend directories to install dependencies.

2. Next, make sure you have [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running on your machine. Then, run the database init script for the backend (`npm run init-db` in the backend folder). This script will download some information from a server and use it to pre-populate your local database.

### 0.2: Run the unit tests
The backend comes with a comprehensive test suite. Run it with `npm run test` in the backend directory. You should see that overall, 19 tests pass and 13 are skipped. You'll go and enable the skipped tests later on when you add new features to the app.

### 0.3: Run the webapp
1. Run `npm start` in the backend folder to start the backend, and `npm run dev` in the frontend folder to start the frontend. The backend should be listening on <http://localhost:3000>, and the frontend on <http://localhost:5173> (by default). open the frontend in your browser, and you should see a login screen.

2. Click the link to create an account, and enter a username and password (make sure you remember these for later!). Once you create your account, you should be taken to a page showing around 30 Pokémon, which you "own". Clicking on any of these will display further details on the right-hand side of the screen.

3. Log out, and check that you can log back in using the same username and password.

### 0.4: Understanding the code
This README is deliberately sparse on details regarding what the app itself actually does in its current state! To gain this understanding, you should go through the source code and build yourself a picture (mental or otherwise) of how everything works and fits together. For the backend, the provided unit tests also serve as excellent documentation around what it is supposed to do. At this time, also notice the "commented-out" unit tests (using `xdescribe` on lines 147 and 171 of `users.test.js`, and line 163 of `pokemon.test.js`). These are the unit tests which will guide you in Task One below.


## Our New Favourite Fetaure!
Before continuing on, here's a brief description of the new end-to-end features you'll be building for this quiz.

Currently, the app lets us view our own Pokémon. We will modify this view so that we can select any number of our own Pokémon as "favourites" (or remove them from the favourites list if desired). We will then add a new page to our application allowing us to see a list of our own favourite Pokémon - and also other users' favourites, too.


## Task One: "Favouriting" Pokémon - backend *(15%)*
Before starting this task, enable the unit tests for this task, which can be found in `pokemon.test.js` line 163 (by changing `xdescribe` to `describe`).

For this task, we want to add a single new route: `PATCH /api/pokemon/:id/setFavourite`. Add this route to `pokemon.js` in the `routes/api` folder in the backend.

When an authenticated user sends an appropriate request to modify the "favourite" status of one of *their own* Pokémon, this modification will be written to that Pokémon's record in the database. Requests to modify a Pokémon when unauthenticated, when the Pokémon is nonexistent, or when the Pokémon does not belong to the authenticated user, will be met with errors.

Upon completing this task, the unit tests you enabled above should all complete successfully, without breaking any of the existing tests.

**Hint 1:** In addition to writing the route handler, you'll also need to slightly modify the `Pokemon` schema.

**Hint 2:** The unit tests for this task will give you ample information about the required success / failure codes in different situations, the modification required to the `Pokemon` schema, and the requred format of the data to be supplied in the request body.


## Task Two: "Favouriting" Pokémon - frontend *(15%)*
Next, let's work on the frontend modifications to allow users to favourite their Pokémon. There are three parts to this:

1. Modify both the `PokemonIcon` and `PokemonDetail` components to have some kind of visual difference when displaying a "favourite" Pokémon (similarly to how there's already a visual difference between "shiny" and "non-shiny" Pokémon). Don't spend a huge amount of time on this just yet - wait until Task Five below to unleash your inner designer 😁

2. Add functionality so that when a `PokemonIcon` is double-clicked, its "favourite" status will be toggled by calling the API route you just developed in Task One.

3. Ensure that, if the API call succeeds, you can see the visual changes in step 1 above take effect for *both* the `PokemonIcon` component you just clicked, and the `PokemonDetail` component (since it will surely be displaying the Pokémon the user just double-clicked). If the API call fails, instead display some kind of error message to the user (again, this can just be something simple like an `alert()` for now).

**Hint:** I would suggest making the API call from within the `PokemonPage` component, as that will make it easier to rerender both the `PokemonIcon` and `PokemonDetail` components once the API call succeeds.


## Task Three: Viewing others' favourites - backend *(15%)*
Before starting this task, enable the unit tests for this task, which can be found in `users.test.js` lines 147 and 171.

In this task, implement *two* additional routes within `routes/api/users.js`, which will provide the necessay backend to allow our frontend to display users' favourite Pokémon:

1. `GET /api/users`: This should return a list of all users in the database. A user must be authenticated to access this route. Refer to `users.test.js` lines 147 - 168 for a detailed description of how this route should behave.

2. `GET /api/users/:id/pokemon`: This should return a list of Pokémon belonging to the user with the given id. Users must be authenticated to access this route. If a user is requesting a list of their own Pokémon, they can specify whether *all* Pokémon should be returned, or just their favourites (with the `favouritesOnly` query parameter). If a user is requesting a list of anyone else's Pokémon, only their favourites will be returned regardless. Refer to `users.test.js` lines 171 - 252 for further details about how this route should behave.


## Task Four: Viewing others' favourites - frontend *(25%)*
In this task, you'll complete the frontend's functional requirements. To do this:

1. Create a new component (say, `FavouritesPage.jsx`) in the `pages` directory, and add an appropriate `Route` to that page from within `App.jsx`, so that when the user browses to `/favourites`, they'll be taken to this new page.

2. At the same time, modify the "header" info in `MainLayout.jsx` (where the "logout" button is located) to include client-side links to both the homepage and the favourites page, so users can navigate between these pages at will.

3. On this new page, display your own favourite Pokémon at the top of the page, along with an appropriate header (e.g. "My favourites").

4. In addition, display each *other* user's favourites below your own. Each user should have their own heading (e.g. "Alice's favourites", "Bob's favourites", etc). **Note:** Your own favourites should *not* appear again in this list.

**Hint 1**: To properly test this, you should create more than one user account, and give each user a few favourites using your solutions to Tasks One and Two.

**Hint 2**: The data to be used on this page can be obtained from a combination of the `user` object you already have access to (via the `useUser()` hook) and the two API routes you coded in Task Three.

**Hint 3**: Consider other existing components / hooks which have been provided to you which you can reuse to make your job easier. In addition, don't be afraid to implement your own additional React components to break things down more nicely, rather than trying to code everything in one massive component.

**Hint 4**: Just focus on getting everything working + proper code organization in this task. In Task Five, that's where you'll spend the time making it actually look good!


## Task Five: "Beautification" *(30%)*
By now, everything should be fully functional - fantastic! However, as given, the webapp looks quite bad and is lacking some basic usability features. For this task, this is your chance to unleash your inner designer, and make something that someone might actually want to use!

For this task, modify as much of the frontend as you'd like, so that it retains its current functionality but looks and feels better. In addition, at the bottom of this README, write a paragraph or two explaining what you have done, and why.

**Note:** This description is quite vague, because this task is very open-ended. I really want you to be able to express yourself and make something that you would be happy to show off.

### Hints & Tips
- You're welcome to modify or remove my existing CSS.

- You're welcome to modify the existing React components themselves, and add new ones.

- You're welcome to use external libraries such as MUI, React Bootstrap, Tailwind CSS, SASS, or anything else with which you have experience. Absolutely anything is fine (just make sure to note what you have used in your response below, and why you chose it).

- In addition to visual changes, consider usability. Most notably, consider:
  - If our APIs return error codes, how should the user be notified? Are `alert()`s the best choice here? (Hint: No, they are not).
  - Is the webapp responsive (and does it need to be)?
  - While an API request is in progress, what is being displayed to let the user know of the in-progress operation? This is important in several locations but *especially* when a new user creates an account (there can be a noticeable delay when creating a user's Pokémon for the first time).

- It is possible to spend a practically unlimited amount of time on this task. Remember the 80/20 rule! I'm expecting you to do the "80%" for this task to get the vast majority of the available marks.

### Your text response to Task Five below:
(your text here)

  - If our APIs return error codes, how should the user be notified? Are `alert()`s the best choice here? (Hint: No, they are not).  

    `Answer:`  
    When error  occours , `alert()` is not a best way to notify users , we could user a condition method to show the message. This kind of method can let user know which   process and action shold they follow
    For example, I use `Loading_icon.gif` (in public folder) in `FavouritesPage.jsx` to inform user that data and image are loading.

  - Is the webapp responsive (and does it need to be)?  

    `Answer:`  
    Yes , this webagg is responsive , we use react hook to get the data and react to render them without refreshing the page.
    We also do some request and respond status processing procedure to deal with any situation, such as 404 200 ....

  - While an API request is in progress, what is being displayed to let the user know of the in-progress operation? This is important in several locations but *especially* when a new user creates an account (there can be a noticeable delay when creating a user's Pokémon for the first time).  

    `Answer:`  
    The same answer with the first one, we could user a condition method to show the message. This kind of method can let user know which   process and action shold they follow
    For example, I use `Loading_icon.gif` (in public folder) in `FavouritesPage.jsx` to inform user that data and image are loading.
    ***

    ## Task Five: "Beautification" *(30%)*
    - I use `Ant Design (antd)` to modify CSS and implement some components to my quiz.  
    **Ant Design**  
    https://ant.design/  

      **Install the dependencies** - you can install by follow steps: (both backend and frontend)
    ```
    npm install
    ```
    or in the frontend folder :  
    ```
    npm install antd --save
    ```
    ```
    npm install @ant-design/plots
    ```  


    ***  
    - In `MainLayout.jsx` , I use `Button` component for the Logout , Homepage and Favourite button and also do some css.  
    ![button](frontend/public/button.jpg "button")

    - In `frontend/public` folder, I create a `Loading_icon` for the loading condition status while data is loading and  from backend.
      I implement the in `FavouritesPage.jsx` line 101 and 118  
    ![Loading_icon](frontend/public/Loading_icon.gif "Loading_icon")

    - In `/components/PokemonList.jsx` , I do some css to make each pokemon icon `hover with lightyellow` color.  
    ![hover](frontend/public/hover.jpg "hover")

    - I create `/components/PokemonTable.jsx` and css file  , to show each user's favorite pokemon `Species Name` and `Species Description`.  
    ![table](frontend/public/table.jpg "table")

    - I create `/pages/OtherPokemonList.jsx` to display other user's favorite pokemon info.  
    ![other pokemon](frontend/public/other.jpg "other pokemon")

     - I create `/components/PokemonPie.jsx` to display each user's favorite pokemon quantities in a `Pie chart` for data .  
    ![pokemon pie](frontend/public/pie.jpg "pokemon pie")

    ## Enjoy my Pokemon app !!