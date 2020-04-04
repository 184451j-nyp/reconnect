# reconnect-node

Remembering those late night talks.

(Re)Connect is a Node.js Web App initially designed as a card game.
However due to the unfortunate arrival of the Covid-19 pandemic of 2020, it needed to be transformed into a web app.

# Requirements
You should have the following software/frameworks installed on your machine:
* [Node.js](https://nodejs.org/) (Preferably an LTS version)
* [MySQL](https://mysql.com)/[MariaDB](https://mariadb.org)

# Usage
This should be done in either bash, terminal, or command prompt.

```bash
cd ~/reconnect-node

npm install
npm start
```

Open your preferred web browser and visit [http://localhost:49800](http://localhost:49800)

# Folder Structure
```
.
├── config                  # All database configuration files
├── models                  # Database table definitions
├── public                  # Webpage publicly accessible files
├── routes                  # Express routes defined
├── views                   # Handlebar templates
├── package.json
├── package-lock.json
└── reconnect.js
