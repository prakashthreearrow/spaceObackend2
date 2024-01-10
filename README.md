
### Prerequisites

To run locally:

* Make sure you have installed nodeJS.
* Make sure you have installed and run mySQL server.
* Create database with the name same as in config.json file.


## Getting Started

- To install all the modules, run the following command:

     `npm install`

 - To start, just run the following command:

	`npm start`


## Migrate to database commands examples

init setup

```
npx sequelize-cli init

```

Model + Migration file

```
    npx sequelize-cli model:generate --name admin_login_token --attributes firstName:string,lastName:string,email:string
```

Migration file generate

```
    npx sequelize-cli migration:generate --name user_device_token

```

Migration run

```
    npx sequelize-cli db:migrate
```

remigrate

```
  sequelize db:migrate:undo:all
  sequelize db:migrate

```


## Built With

* [Node](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine
* [Express](https://expressjs.com/) - A minimal and flexible Node.js web application framework.

## Authors

prakash sahu

## License



# spaceObackend
