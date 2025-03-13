# FroApp by Daria Aleshina

FroApp is a web application designed to help learners of foreign languages expand their vocabulary using interactive flashcards called **"FroCards"**. Users can create custom sets (**"FroSets"**) of flashcards with new words, as well as explore and add other users' FroSets to their own study room for further learning.

This project was developed as part of **Harvard's CS50 Web Programming with Python and JavaScript**, using the **Django framework**. It was submitted in **September 2024** as a final project for the course.

[WATCH VIDEO DEMONSTRATION](https://youtu.be/sd1DZxuArcM?si=YJeCa4XxwVe_8-r_)

## Key Features

Unauthorised users can:

- View other users' FroSets on the homepage.
- Browse the list of words in each set.

Authorised users have full access to:

- Creating their own FroSets.
- Adding, editing, and deleting their own FroCards.
- Adding other users' FroSets to their personal study room.
- Learning words through interactive flashcards.

## How to Run FroApp

In your terminal, navigate to the project directory.

Run the following commands to set up and start the application:

```sh
python manage.py makemigrations frogApp  # Make migrations for the FrogApp
python manage.py migrate  # Apply migrations to the database
python manage.py runserver  # Start the Django web server
```

## Future Improvements (2025)

Looking at this project in 2025, I see many areas for improvement:

- **Code Refactoring:** Improve overall structure and readability.
- **Asynchronous JavaScript:** Implement proper async functionality where needed.
- **Better Naming Conventions:** Ensure consistent and meaningful variable and function names.
- **CSS Structure:** Organize styles more effectively for maintainability.
- **Performance Enhancements:** Optimize database queries and frontend interactions.

## Additional Information

As I am actively learning German, I was motivated to build and enhance this app for practical daily use.
