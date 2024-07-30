# Discord Bot quick guide

This is a discord bot that sends a celebratory message whenever a user completes a sprint. All celebratory messages that were posted, are automatically saved into the database.

## Before you start

This server uses .env file for environment variables, so before you start interacting with the server, you have to create your own .env file as in provided example file *exampleEnv.txt*. The server also uses Giphy API to retrieve random gifs, so you have to get your own API key from https://developers.giphy.com/

**Also, you have to create a channel named "accomplishments" for bot to work!**

## Setup

To install all dependencies, run command:

```bash
npm install
```

## Creating database file

Create a **"data"** folder in root directory and a database file by running command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Usage

- To interact with the server, you have to use GUI REST client, such as Postman or VS Code extension Thunder Client (or any other you prefer).

- Before you make a POST request to trigger the bot, you have to add data to your database (template message and sprint).

- To add a template message to the database, you can make a POST request to "/templates" with body:

```bash
{
  "templateText": "Your celebratory message"
}
```

- To add a sprint to the database, you can make a POST request to "/sprints" with body:

```bash
{
  "sprintCode": "WD-1.1",
  "title": "First Steps Into Programming With Python"
}
```

- You can now trigger the bot by making a POST request with body:

```bash
{
  // your exact user name that is in the created Discord server
  "username": "johdoe",

  // unique sprint code: Course-Module.Sprint
  "sprintCode": "WD-1.1"
}
```

## REST API supports the following endpoints:

- POST /messages - sends a congratulatory message to a user on Discord
- GET /messages - gets a list of all congratulatory messages
- GET /messages?username=johdoe - gets a list of all congratulatory messages for a specific user
- GET /messages?sprint=WD-1.1 - gets a list of all congratulatory messages for a specific sprint
- CRUD /templates - POST/GET/PATCH/DELETE endpoints for managing congratulatory message templates
- CRUD /sprints - POST/GET/PATCH/DELETE endpoints for managing sprints
