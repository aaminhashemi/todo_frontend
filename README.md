# Todo project (frontend)

A web application for managing todos built with **React** for the frontend and **Laravel** with a **PostgreSQL** database for the backend.

## Live Demo

You can visit the project online at: [https://todo-frontend-tmrg.onrender.com/](https://todo-frontend-tmrg.onrender.com/)

## Features

- React frontend with Bootstrap styling
- Laravel backend
- PostgreSQL database for data storage

## Installation

1. Clone the frontend repository:
   ```sh
   git clone https://github.com/aaminhashemi/todo_frontend.git
   cd todo_frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
    This command will start the React development server. Once it's running, for first usage it takes about 1 or 2 minutes for the online server to respond . Be patient please!
    
    Used online server is Free and has it's own limitations.

    
## Puppeteer Testing

The project includes automated testing using **Puppeteer** to ensure functionality and performance.
   ```sh
   node puppeteer.test.js
   ```
## CI/CD & GitHub Actions
This project uses **GitHub Actions** to automate testing. The workflow file is located at:
```
.github/workflows/frontend.yml
```
You can view test results in the [Actions Tab](https://github.com/aaminhashemi/todo_frontend/actions).

---