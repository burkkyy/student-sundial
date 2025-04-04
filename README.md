# Student Sundial web application

## General Stack

### API (Back-end)

- [Node](https://nodejs.org/en) + [Express](https://expressjs.com/)

- [Sequelize 7](https://sequelize.org/docs/v7/)

- [Knex](https://knexjs.org/guide/)

### Front-End

- [Vue 3](https://vuejs.org/guide/introduction.html) + [Vuetify](https://vuetifyjs.com/en/getting-started/installation/#installation)

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

- [Axios](https://github.com/axios/axios)

### Database

- Mariadb - [Mariadb](https://mariadb.org/)

- [Docker Compose](https://docs.docker.com/compose/compose-file/)

---

## Development

1. Create a `api/.env.development` and populate with the following content: (if using docker ignore this step)

   ```bash
   FRONTEND_URL=http://localhost:8080
   VITE_AUTH0_DOMAIN=https://dev-rzjcjlzhy63wjf31.us.auth0.com
   VITE_AUTH0_AUDIENCE=testing
   VITE_AUTH0_CLIENT_ID=TmJtOIRuRHC841MqXZZDJ2vBQJ8AgdCl
   AUTH0_MANAGEMENT_AUDIENCE=https://dev-rzjcjlzhy63wjf31.us.auth0.com/api/v2/
   AUTH0_MANAGEMENT_CLIENT_ID=rIYPfuOibecj7OaHAmHOhWXleqnYy2WJ
   AUTH0_MANAGEMENT_CLIENT_SECRET=<ASK-DEVELOPER-FOR-THIS>
   MYSQL_HOST=localhost
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=DevPwd99!
   MYSQL_DATABASE=student_sundial_development
   MYSQL_PORT=3306
   PDF_PARSER_JS=/usr/src/api/src/lib/pdf-parser/pdf-parser.mjs
   ```

2. In `api/` run `npm install`

3. In `web/` run `npm install`

4. Boot the api, web, and db services via `docker compose -f docker-compose.development.yml up`. This will run the boot pipeline and create the database, run migrations, and run seeds.

5. Stop the api, web, and db services via `ctrl+c`

### API Service (a.k.a back-end)

1. Boot only the api service using:

   ```bash
   docker compose -f docker-compose.development.yml up api
   ```

   Or

   ```bash
   cd api
   npm run start
   ```

2. Access the api by logging in to the front-end, then going to http://localhost:3000

### Web Service (a.k.a. front-end)

1. Boot only the web service using:

   ```bash
   docker compose -f docker-compose.development.yml up web
   ```

   Or

   ```bash
   cd web
   npm run start
   ```

2. Log in to the front-end service at http://localhost:8080

### DB Service (a.k.a database service)

1. Boot only the db service using:

   ```bash
   docker compose -f docker-compose.development.yml up db
   ```

   > NOTE: production and development have different seeds.

2. You can run migrations and seeding manually after login in to the web UI by going to

- http://localhost:3000/migrate/latest
- http://localhost:3000/migrate/up
- http://localhost:3000/migrate/down
- http://localhost:3000/migrate/seed

### Troubleshooting

If you are getting a bunch of "Login required" errors in the console, make sure that you have disabled any kind of enhanced tracking protection.

Auth0 use third-party cookies for authentication, and they get blocked by all major browsers
by default.

## Testing

TODO

# Deploying for Production

## Deploying production to remote

1. Download latest release at https://github.com/burkkyy/student-sundial/releases/latest

2. Extract via `tar -xf student-sundial-app.tar.gz`

3. In `app/`, create a `.env.production` and populate with the following content:

   ```bash
   VITE_APPLICATION_NAME="Student Sundial"
   HOST_PORT=8080
   API_PORT=8080

   MYSQL_HOST=
   MYSQL_PORT=3306
   MYSQL_USERNAME=
   MYSQL_PASSWORD=
   MYSQL_DATABASE=

   FRONTEND_URL=http://localhost:8080
   VITE_AUTH0_DOMAIN=https://dev-rzjcjlzhy63wjf31.us.auth0.com
   VITE_AUTH0_AUDIENCE=testing
   VITE_AUTH0_CLIENT_ID=TmJtOIRuRHC841MqXZZDJ2vBQJ8AgdCl
   AUTH0_MANAGEMENT_AUDIENCE=https://dev-rzjcjlzhy63wjf31.us.auth0.com/api/v2/
   AUTH0_MANAGEMENT_CLIENT_ID=rIYPfuOibecj7OaHAmHOhWXleqnYy2WJ
   AUTH0_MANAGEMENT_CLIENT_SECRET=<ASK-DEVELOPER-FOR-THIS>
   PDF_PARSER_JS=./dist/lib/pdf-parser/pdf-parser.mjs
   ```

4. Set env to production via `export NODE_ENV=production`

5. Run app via `./app/bin/boot-app.sh`

## Testing production build locally

1. Build for production via `./bin/build.sh`, with no errors it should create `app/`

2. Create a `app/.env.production` and populate with the following content:

   ```bash
   VITE_APPLICATION_NAME="Student Sundial"
   HOST_PORT=8080
   API_PORT=8080

   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=DevPwd99!
   MYSQL_DATABASE=student_sundial_production

   FRONTEND_URL=http://localhost:8080
   VITE_AUTH0_DOMAIN=https://dev-rzjcjlzhy63wjf31.us.auth0.com
   VITE_AUTH0_AUDIENCE=testing
   VITE_AUTH0_CLIENT_ID=TmJtOIRuRHC841MqXZZDJ2vBQJ8AgdCl
   AUTH0_MANAGEMENT_AUDIENCE=https://dev-rzjcjlzhy63wjf31.us.auth0.com/api/v2/
   AUTH0_MANAGEMENT_CLIENT_ID=rIYPfuOibecj7OaHAmHOhWXleqnYy2WJ
   AUTH0_MANAGEMENT_CLIENT_SECRET=<ASK-DEVELOPER-FOR-THIS>
   PDF_PARSER_JS=./dist/lib/pdf-parser/pdf-parser.mjs
   ```

3. If your MYSQL credentials are still for the dev db, (ie testing production locally) then you have to start up the db locally via:

   ```bash
   docker compose -f docker-compose.development.yml up --remove-orphans db
   ```

> Note this only starts up mariadb

4. Boot app via `./app/bin/boot-app.sh`

5. Go to http://localhost:8080/ and log in.

6. Navigate around the app and do some stuff and see if it works.
