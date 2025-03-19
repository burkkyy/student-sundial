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
      MYSQL_HOST=localhost
      MYSQL_USERNAME=root
      MYSQL_PASSWORD=DevPwd99!
      MYSQL_DATABASE=digital_vault_development
      MYSQL_PORT=3306
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

## Migrations - Database Management

TODO

### Seeding

TODO

# Deploying

## Production Environment (remote)

1. Create the appropriate database, as specified by the `DB_DATABASE` environment variable, and
2. Make sure the default `dbo` schema exists in that database.

## Test Production Build Locally

Files:

- [Dockerfile](./Dockerfile)
- [docker-compose.yml](./docker-compose.yml)
- Non-commited `.env` file

1. Create a `.env` file in top level directory with the appropriate values.

   ```bash
   VITE_APPLICATION_NAME="Student Sundial"
   HOST_PORT=8080
   API_PORT=8080

   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USERNAME=root
   MYSQL_PASSWORD=DevPwd99!
   MYSQL_DATABASE=digital_vault_development

   VITE_API_BASE_URL="http://localhost:8080"
   VITE_AUTH0_DOMAIN=https://dev-rzjcjlzhy63wjf31.us.auth0.com
   VITE_AUTH0_AUDIENCE=testing
   VITE_AUTH0_CLIENT_ID=TmJtOIRuRHC841MqXZZDJ2vBQJ8AgdCl
   ```

2. Build and boot the production image via

   ```bash
   docker compose up --build
   ```

3. Go to http://localhost:3000/ and log in.

4. Navigate around the app and do some stuff and see if it works.
