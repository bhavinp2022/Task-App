# Task App

## Description

The application is to maintain task list from the JSON file stored locally in backend. User can login using email and password, can create / delete the task. User can mark the task as done.

## Tech Stack

**Client:** React, MUI

**Server:** Node, Serverless

## Overview

Formik is used to validate login form in the frontend. When user login with email and password HttpOnly Cookie with auth_token has be set for the client. To access other apis need auth_token in cookie. Apart from login API auth_token is being verified before executing the code.
All the tasks data are being stored in JSON file locally using fs package.

## Setup & Run Frontend

Navigate to the frontend directory and then run the following commands to start the react application

```bash
  cd frontend
  npm install
  npm start
```
    
## Setup & Run Backend

Step 1. Install the Serverless framework on your machine by running the following comm  and 

```bash
  npm install serverless -g
```
    
Step 2. Navigate to backend directory, and then run the following commands

```bash
  cd backend
  npm install
```

Step 3. To run serverless app locally, run following command

```bash
  sls start offline
```