# node-serverless
A Node.js application that shows how to deploy an Node.js, Express app to AWS Lambda using Serveless Stack Toolkit

# Working with the Project

Download this project from above link and checkout a new branch from the QA. Create a env file in the project as `.env` and put the below code inside it.

.env
```
    JWT_SECRET=
    ATLAS_URI=
```

> **Note:** The **JWT_SECRET** and **ATLAS_URI** are important to work with this project. You can generate JWT token using any algorithm or command of choice. The ATLAS URI should be gotten from your mongoDB setup. Now, create all these variables in the project and make sure you set the values for all the variable. Otherwise, the project will not work.
