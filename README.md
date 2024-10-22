# FroApp by DariaAleshina
FroApp is a web application designed to help learners of foreign languages expand their vocabulary using interactive flashcards called "FroCards". Users can create custom sets (so called "FroSets") of flashcards with new words, as well as explore and add other users' FroSets to their own study room for further learning.

# Key Features
Unauthorised users can view other user´s FroSets on home page and view list of cards with words in the sets. 
Authorised users get additional access to: 
    + creating their own sets; 
    + add, edit and delete their own cards; 
    + ability to add other user's sets to their study room; 
    + learn words with flipping flash cards.

# Distinctiveness and Complexity

FroApp is focused on language learning through interactive flashcards (FroCards) that users can create and study. Unlike social networks, e-commerce sites, or an online-store, FroApp is not centered around facilitating social interactions or selling products. Besides a more complex data structure where cards/words are grouped in sets, I have added a distinctive feature - flipping flash cards (on action).

The project contains:
    + 4 Models, 7 API routes 
    + Delete-funtion added (for cards)
    + Animation on card-deletion (a card smoothly dissapears when delete button is clicked)
    + Animated flash cards: (carousel, flipping on click)
    + Interactive study-room page: ability to filter sets by own/others
    + Interactive set-view: switching between (and turning off) blocks with 'Flash Cards' and 'Adding new cards'

I have also done mostly my own design/CSS (Bootstrap is used minimally).

# File Structure and Content
Django project 'final_project' contains only one App - **'froApp'**. 

* **models.py**: Defines the database schema relationships between these models:
    + User
    + Set (set title & user created)
    + Card (word, its translation and other info, incl set it belongs to)
    + StarSet (which set is added to which user's study room)

* **templates/frogApp**: Contains the HTML files for rendering web pages:
    + **layout.html**: sets design for header and footer reused on all pages
    + **regiter.html and login.html**: to authorise users
    + **index.html**: home page of the website, dynamically renders either a login/register prompt for unauthenticated users or displays the user’s custom FroSets and popular FroSets for authenticated users, with JavaScript handling additional interactions through a separate module
    + **createSet.html**: allows authenticated users to create a new FroSet by providing sections for adding new sets and individual cards, with JavaScript managing the dynamic creation and display of these elements
    + **set_view.html**: displays a specific FroSet with details about the set and its creator, allowing authenticated users to interact with the set by learning cards, adding new cards (if they created it), or starring it, with dynamic content and interactions handled through JavaScript
    + **studyroom.html**: renders the user's Study Room, allowing authenticated users to filter and view all their study sets, their own sets, or starred sets, with dynamic content updates managed by JavaScript.
    + **profile.html**: displays a user's profile page, showing all FroSets created by this user
    + **error.html**: renders with a customised message when user trying to access page that does not exist


* **static/FrogApp**: Contains static assets like CSS file, JavaScript files, and images for styling and functionality.
    + **styles.css**: styling the web app design. 
    + **flippingcards.js**: module with functions (for further export) that dynamically load and display a Carousel of FroCards (flashcards) with flipping animations, enabling users to study cards by flipping between words and their translations (and add info). Includes navigation via scrollable arrows.
    + **common.js**: module with key functions (for further export, being reused for multiple pages) for displaying forms for creating new sets and cards, for loading and displaying existing sets and cards, editing and deleting cards, adding sets to a study list. 
    + **studyroom.js, profile.js, index.js, set_view.js, createSet.js**: dinamically render relevant html.files using external JS functions from common.js and flippingcards.js.

* views.py & url.py: contain back-end logic, including 7 API routes to support JS functions for retrieving data from DB and changing it. 

# How to Run FroApp
In your terminal, cd into the project directory.
Run *python manage.py makemigrations frogApp* to make migrations for the FrogApp.
Run *python manage.py migrate* to apply migrations to the database.
Run *python manage.py runserver* to start up the Django web server, and visit the website in your browser.

# Additional Information
The app with similar idea & branding was created by me as a part of CS50 Into to CS course Final Project. As I actively learn German at the moment, I had the interest to upgrade this App to use in daily life. The project was moved from Flask to Django and has been upgraded as per new skills learned. 
