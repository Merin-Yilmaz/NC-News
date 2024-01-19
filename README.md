<h1 align="center">Welcome to NC News! 👋</h1>

My first project!
This API is a social news forum site, where you are able to interact, rate content and discuss topics with others, similarly to Reddit.

### 🏠 [Homepage](https://nc-news-api-od1r.onrender.com)

## Install

In order to use this repo and run it locally, you will need to do the following:

1. Clone the repo from gitHub on your local machine

```sh
$ https://github.com/Merin-Yilmaz/NC-News.git
```

2. Install Packages & Dependencies
   This project uses [node](http://nodejs.org) version v20.6.1, [npm](https://npmjs.com) version 9.8.1 and [postgres](https://www.postgresql.org) version 14.10 .
   Go check them out if you don't have them locally installed.

```sh
$ npm install
```

## Usage

```sh
npm run start
```

## ** IMPORTANT **

You will need to create the necessary environment variables in the top level of your folder

Please create 3 files:

1. .env.test
2. .env.development
3. .env.production

Into each, the correct database name will need to be added:

1. In the .env.test file, please add:

PGDATABASE=nc_news_test

2. In the .env.development file, please add:

PGDATABASE=nc_news

3. In the .env.production file, please add:

DATABASE_URL={ your database url }

Once the variables have been created, you will need to double check that these .env files are .gitignored.
If not, add them to the .gitignored file by writing under
node_modules:
.env.development
.env.test
.env.production

## Run Project

You can now seed data to the local database by running the command:

```sh
$ npm run setup.dbs
```

## Run Tests

```sh
npm run test app
```

## Author

- Github: [@Merin-Yilmaz](https://github.com/Merin-Yilmaz)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Merin-Yilmaz/NC-News/issues).

## Show your support

Give a ⭐️ if this project helped you!
