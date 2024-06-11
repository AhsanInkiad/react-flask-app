# React JS and Pyton with SQL

Welcome to the project! This repository contains code for a CRUD application built with ReactJS for the frontend and Flask (Python) for the backend. The application allows users to perform CRUD operations on trade data stored in a SQL database. It has two working branches: 1)jsonModel, 2)sqlModel. 
Live site link: https://react-flask-app-vqc6.onrender.com/

## Learning from this Project

Working on this project has been a valuable learning experience, allowing me to explore Python for backend development for the first time. This is the first time I have learned how to connect a Python backend with React JS frontend and thus I have used Flask and sqLite for the first time. Key takeaways:

- Utilizing Python for the backend of the application was a rewarding experience. I had previous experience of using python for some courses but this was the first time I have used it for development purpose.

- Flask was not that complicated. Took some help from youtube videos and created necessary API's needed for the CRUD project. I had experiences of using MongoDB and Mysql, but I wanted a serverless sql database, so I have explored sqLite this time. Its simplicity and serverless architecture made it easy to set up and use for development. And my experience form using node js and express helped me a lot to understand everything within short time.

- Git branching. I knew about git branches but never made two version of an app. This time I have learned how to create two version of an app and maintain them seperately. I have also leaned how to go back and forth between the two different models stored in two different branches.

- Deploying a Python backend. I have used Render for the first time to deploy both server side and client side. I had experience of depoying in Netlify (frontend/client side) and Firebase (backend/server side). Those experiences came to use while deployinh in Rende. It was a challenging part as I had no idea about how to deploy app in Render. I took help from chatGPT and youtube video and got a confident boost after successful deployment.

## Challenges faced
- The first challenge was finding a suitable tutorial to guide the connection between the ReactJS frontend and the Python backend. I spent a considerable amount of time exploring various resources on YouTube, Google, and utilizing ChatGPT to provide relevant prompts. The key to success was engineering effective prompts, and ChatGPT provided a blueprint for the project.

- The second major challenge was selecting the appropriate database. While I had prior experience with a NoSQL database like MongoDB, the project's requirement was to use a SQL database. Initially, I considered using MySQL, but I encountered difficulties in finding a free, cloud-based service for MySQL. During my search, I discovered SQLite, a serverless, self-contained SQL database engine that eliminates the need for a separate server process. After careful consideration and extensive research, I concluded that SQLite was the perfect fit for my project.

- After successfully loading the data, I proceeded to develop the frontend, which required thorough debugging. For the visualization aspect, I explored various libraries and sought assistance from ChatGPT by providing precise prompts.


- The final challenge was deploying the project. We were told to explore free hosting options, I came across PythonAnywhere and Render. I watched a tutorial on deploying a project using Render and found it to be straightforward. Following the tutorial, I deployed the sqlModel branch of the project on Render.

## Branches

### main
- The `main` branch just contains the project setup. The app will not run from the main branch.

### jsonModel
- The `jsonModel` branch contains the initial implementation of the project using JSON as the data model.
- It includes code for the frontend and backend based on JSON data.

### sqlModel
- The `sqlModel` branch contains the updated version of the project using SQL as the data model.
- It includes code for the frontend and backend based on SQL database operations.
- This branch is the latest version and it was used for furhter development.

## How to Use

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/AhsanInkiad/react-flask-app
    ```

2. **Switch to the Desired Branch**:
- If you want to work with the JSON model:
    ```sh
    git checkout jsonModel
    ```

- If you want to work with the SQL model:
    ```sh
    git checkout sqlModel
    ```

