# expressjs-restful-hiringChannelApp
RESTfull API Hiring Channel is a simple application specially for backend only. Built with NodeJs using the ExpressJs Framework.
## Requirements
1. [Node.js](https://nodejs.org/en/)
2. [Express.js](https://expressjs.com/)
3. MySql
4. [Redis](https://redis.io/)
5. [Postman](https://www.getpostman.com/)
## Installing
To install expressjs-restful-hiringChannelApp, follow these steps:
1. clone from Github:
```
$ git clone https://github.com/bayuyuhartono/expressjs-restful-hiringChannelApp.git
```
2. Move folder
```
$ cd expressjs-restful-hiringChannelApp
```
3. install package
```
$ yarn or npm install
```
4. create .env file and fill these with required things
```
DB_HOST = 
DB_USER = 
DB_PASSWORD = 
DB_DATABASE = 

REDIS_URL = 
BASE_URL = 
JWT_KEY = 
```
5. install [redis](https://redis.io/topics/quickstart)
6. Create a database with the name hiring_cannel, and Import file [hiring_channel.sql](https://github.com/bayuyuhartono/expressjs-restful-hiringChannelApp/blob/master/hiring_channel.sql) to phpmyadmin
7. run the server
```
$ npm start
```
8. See all the end point in routes folder
9. Request the end point API with [Postman](https://www.getpostman.com/) application and enjoy.. 
