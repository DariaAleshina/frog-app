# FroApp by DariaAleshina
FroApp is a web application designed to help learners of foreign languages expand their vocabulary using interactive flashcards called "FroCards". Users can create custom sets (so called "FroSets") of flashcards with new words, as well as explore and add other users' FroSets to their own study room for further learning.

# Key Features
Unauthorised users can view other user´s FroSets on home page and view list of cards with words in the sets. 
Authorised users get full access to: 
+ creating their own sets; 
+ add, edit and delete their own cards; 
+ ability to add other user's sets to their study room; 
+ learn words with flipping flash cards.

# Distinctiveness and Complexity
FroApp is designed with a specific educational goal — language learning — where the primary value is knowledge acquisition rather than communication, social engagement, or transactions. This makes FroApp different from the other projects in the course in terms of both purpose and end-user interaction.

**Learning-Oriented Design**: FroApp centers on helping users learn and retain new vocabulary using interactive, personalized flashcards (FroCards). Users are actively engaging with content - sets of words/cards grouped by chosen topic - to memorise new foreign words. Users can add (and remove later) other user's shared content to their Study Room so that there is no need to create their own sets of cards from scratch, which enchances the learing process. 

**Unique Interactive Tools**: My project introduces unique mechanic not present in the other projects like carousel of flipping flashcards (with custom JavaScript and CSS animations) to reinforce learning new words.

**Complexity** of this project (vs other projects in the course) is achieved by:
+ Dynamic & complex structure of user-generated content: user creates custom sets that may contain endless amount of words/cards inside it. Each user FroSet has a feature of learning with flipping flashcards (and this feature can be activated and deactivated).
+ Sharable User Content: FroApp allows users not only create their own content, but also get access and interact with those of other users.
+ Unique gamification tools: flipping flashcards with animations, which transforms static content into an interactive experience
+ Customizable Study Rooms: Users can add sets to their study room, filter between their own sets and starred sets, making it a more dynamic space. 
+ Custom App design: I created mostly my own design/CSS. Bootstrap is used minimally.
+ Added CSS animaitons: e.g. on card-deletion to improve UX.
+ Project contains at least 9 HTML pages (vs 6 in my 'Network' project, and same as in my 'Auctions' project), 7 API routes (vs 6 in my 'Network' project), 4 Models (same as in my my 'Network' project)


# File Structure and Content
Django project 'final_project' contains only one App - **'froApp'**:

* **models.py**: Defines the database schema relationships between these models:
    + User (basic user data: username, email, etc)
    + Set (set title & user created)
    + Card (foreign word or a phrase, translation, example of usage and oany other additional info + set it belongs to)
    + StarSet (which set is added by which user - data is used to add sets to a user's personal study room)

* **templates/frogApp**: Contains the HTML code to render layout and distinctive web pages:
    + **layout.html**: sets unique design for header and footer reused on all pages
    + **regiter.html and login.html**: to authorise users
    + **index.html**: home page of the website. Dynamically renders either a login/register prompt for unauthenticated users or displays the user’s own FroSets as well as other users' FroSets (sorted by study-popularity) for authenticated users. JS described a seperate module (index.js) handles the display of sets.
    + **createSet.html**: allows authenticated users to create a new FroSet via two forms - (1) create set titel  and then (2) add a new card info. JS described a seperate module (createSet.js) handles the dynamic dispay of both forms as well as dispay of the created cards. 
    + **set_view.html**: displays a specific FroSet info: the set title, its creator username, list of all the cards in this set. Authenticated users have access to interact with flipping flash cards, to add new cards (if they created the set), or add it to study room. JS described a seperate module (set_view.js) handles the dynamic dispay of card list, flipping cards and "add new card" form (if applicable). 
    + **studyroom.html**: renders the user's Study Room, allowing authenticated users to filter and view the sets: their own sets or starred sets. JS described a seperate module (studyroom.js) handles the display of sets based on the filter.
    + **profile.html**: displays a user's profile page, showing all FroSets created by this user. JS described a seperate module (profile.js) handles the display of sets.
    + **error.html**: renders with a customised message when user trying to access page that does not exist

* **static/FrogApp**: Contains static assets like CSS file, JavaScript files, and images for styling and functionality.
    + **styles.css**: styling the web app design (covers all pages). 
    + **flippingcards.js**: module with functions (for further export) that dynamically load and display a Carousel of FroCards (flashcards) with flipping animations, enabling users to study cards by flipping between words and their translations (and add info). Includes navigation via scrollable arrows.
    + **common.js**: module with key functions (for further export, being reused for multiple pages) for displaying forms for creating new sets and cards, for loading and displaying existing sets and cards, editing and deleting cards, adding sets to a study list. 
    + **studyroom.js, profile.js, index.js, set_view.js, createSet.js**: dinamically render relevant html.files using external JS functions from common.js and flippingcards.js.

* **views.py & url.py**: contains 15 functions, including 7 API routes to support JS functions for retrieving data from DB and changing it. 

# How to Run FroApp
In your terminal, cd into the project directory.
Run *python manage.py makemigrations frogApp* to make migrations for the FrogApp.
Run *python manage.py migrate* to apply migrations to the database.
Run *python manage.py runserver* to start up the Django web server, and visit the website in your browser.

# Additional Information
The app with similar idea & branding was created by me as a part of CS50 Into to CS course Final Project. As I actively learn German at the moment, I had the interest to upgrade this App to use in daily life. The project was moved from Flask to Django and has been upgraded as per new skills learned. 
