# Kioku

[Video Demo](https://youtu.be/JoqIymNjKrI)

## Description

This is a flashcards application that is designed to help users learn and memorize content more efficiently using **spaced repetition**. It allows users to create, manage, and review flashcards, and is built with a powerful backend to manage user-specific flashcards and decks. The app incorporates the [SuperMemo SM2 algorithm](https://github.com/clockzhong/OpenSuperMemo/) to optimize learning through timed repetition based on user feedback.

This app provides an intuitive interface for users to study and track their progress. Each user has the possibility to create new flashcards and decks. The app tailors the review process to their learning pace, optimizing retention of information.

## Used technologies

### Frontend

- React
- TypeScript
- Mantine UI
- Vite
- echarts
- Jest

### Backend

- Python
- Django
- Django REST Framework (DRF)
- SQLite

## SuperMemo Algorithm

This project utilizes the SM2 algorithm, which is part of the SuperMemo learning system, developed by Dr. Piotr A. Wozniak. The algorithm determines the optimal time to review each flashcard based on the user’s performance during previous reviews. This ensures that the cards are presented at intervals designed to promote long-term retention.

The SM2 algorithm implementation was done using OpenSuperMemo, an open-source project dedicated to implementing the SuperMemo algorithm in Python. SM2 is the first version of SuperMemo and is detailed here. In this app, the algorithm is integrated into the backend to intelligently adjust the review intervals for each card based on user input (Again, Hard, Good, or Easy).

## Features

### User Authentication

Users can create accounts, log in securely, and manage their personal profiles. Each user’s data, including decks and flashcards, is stored privately and is accessible only to them.

### Deck and Flashcard Management

Users can create, edit, and delete flashcards and decks. Flashcards consist of a question-answer format, and users can organize their learning content into custom decks.

### Spaced Repetition Review Mode

Flashcards are presented for review in intervals based on the SM2 algorithm. Users can rate their performance for each flashcard (Again, Hard, Good, Easy), and the app schedules future reviews accordingly.

### Progress Tracking

The app provides real-time tracking of user progress, displaying the number of cards reviewed and those remaining in each study session. Additionally, data on performance and retention can be visualized through charts and graphs.

## What I learnt

The backend is built using Django, which I really enjoyed using in order to do this project. Django’s built-in admin dashboard provided an out-of-the-box solution for managing user data, decks, and flashcards. The official Django documentation was extremely helpful, with its detailed tutorial guiding much of the project setup. Django’s flexibility allowed me to quickly create models for users, decks, and flashcards, and link them together.

On top of Django, I used Django REST Framework (DRF) to build a fully functional REST API. The DRF documentation is also a valuable resource, and it made the process of serializing data, managing authentication, and creating the API endpoints straightforward. You can explore the DRF documentation [here](https://www.django-rest-framework.org/).

On the frontend, React with TypeScript allowed for type safety and maintainable code, while Mantine UI enabled rapid development of a polished, responsive interface. This combination of frontend and backend technologies helped create a cohesive and scalable application.

## Future Enhancements:

- Implement a feature that provides users with more detailed analytics of their study habits and progress over time.
- Allow users to share decks publicly or with friends, enabling collaborative study sessions or access to community-created decks.
- Ensure the app is fully responsive and optimized for mobile devices.
- Offline functionality so users can review their flashcards even without an internet connection.

## Installation and Setup:

To run the project locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/Kure-ru/kioku.git
```

2. Setup the frontend

Navigate to the frontend folder and install the dependencies, then run the development server.

```
cd frontend
npm install
npm run dev
```

3. Setup the backend

Navigate to the backend folder, install the necessary dependencies, and run the Django development server:

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

This flashcards application demonstrates the power of combining modern frontend technologies with a robust backend using Django and DRF. It offers a clean and intuitive interface for users to review their flashcards while optimizing learning through the proven spaced repetition method.

I am looking forward to continuing to learn Computer Science in the future, as well as improving on my Web Development skills.
