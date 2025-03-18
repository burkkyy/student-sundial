# Yukon Government - Digital Vault web application

## General Stack

### API (Back-end)

- [Node](https://nodejs.org/en) + [Express](https://expressjs.com/)

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

- [Sequelize 7](https://sequelize.org/docs/v7/)

- [Knex](https://knexjs.org/guide/)

### Front-End

- [Vue 3](https://vuejs.org/guide/introduction.html) + [Vuetify](https://vuetifyjs.com/en/getting-started/installation/#installation)

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

- [Axios](https://github.com/axios/axios)

### Database

- Microsoft SQL Server - [MSSQL](https://www.postgresql.org/docs/current/app-psql.html)

- [Docker Compose](https://docs.docker.com/compose/compose-file/)

### Mail Server

- Mail Dev - [MailDev](https://github.com/maildev/maildev?tab=readme-ov-file#docker-run)
- [MailDev Docker Image](https://hub.docker.com/r/maildev/maildev)

---

## Development

1. In the `api` folder.

2. Create a `.env.development` file with this content. It must match the config in `docker-compose.development.yml`

   ```bash
   VITE_AUTH0_DOMAIN=https://dev-0tc6bn14.eu.auth0.com
   VITE_AUTH0_AUDIENCE=testing
   VITE_AUTH0_CLIENT_ID=mNqPwPZ5M1VXkEH6e8OgEaxmmWfxecwo

   SHARE_POINT_TENANT_ID=Some Directory (tenant) ID
   SHARE_POINT_CLIENT_ID=Some Application (client) ID
   SHARE_POINT_CLIENT_SECRET=Some Client Secret
   ```

3. Go back to the top level directory.

4. [Set up the `dev`](#set-up-dev-command) command, or use `docker compose -f docker-compose.development.yml` instead of `dev` in all instructions.

5. Boot the api, web, and db services via `dev up` or `docker compose -f docker-compose.development.yml up`. This will run the boot pipeline and create the database, run migrations, and run seeds.

6. Stop the api, web, and db services via `ctrl+c` or `dev down` or if you want to wipe the database `dev down -v`.

7. Install local dependencies by installing `asdf` and node via `asdf` and then running `npm install` at the top level of the project.

8. To get the local per-service node_modules, folders run `dev api npm i` and `dev web npm i`. I'm not sure why the previous commands don't do this automatically.

### API Service (a.k.a back-end)

1. Boot only the api service using:

   ```bash
   dev up api

   # or

   docker compose -f docker-compose.development.yml up api

   # or

   cd api
   npm run start
   ```

2. Access the api by logging in to the front-end, then going to http://localhost:3000

### Web Service (a.k.a. front-end)

1. Boot only the web service using:

   ```bash
   dev up web

   # or

   docker compose -f docker-compose.development.yml up web

   # or

   cd web
   npm run start
   ```

2. Log in to the front-end service at http://localhost:8080

### DB Service (a.k.a database service)

1. Boot only the db service using:

   ```bash
   dev up db

   # or

   docker compose -f docker-compose.development.yml up db
   ```

   > Migrations run automatically, as do seeds.
   > NOTE: production and development have different seeds.

2. You can access the `sqlcmd` command line via

   ```bash
   dev sqlcmd

   # or

   docker compose -f docker-compose.development.yml exec db sh -c '
      /opt/mssql-tools18/bin/sqlcmd
      -U "$DB_USERNAME"
      -P "$DB_PASSWORD"
      -H "$DB_HOST"
      -d "$DB_DATABASE"
      -C \
      -I
   '
   ```

You can also run migrations and seeding manually after login in to the web UI by going to

- http://localhost:3000/migrate/latest
- http://localhost:3000/migrate/up
- http://localhost:3000/migrate/down
- http://localhost:3000/migrate/seed

You can also skip seeding if database is not empty by setting the `SKIP_SEEDING_UNLESS_EMPTY=true` environment variable.

### Mail Service (a.k.a mail server)

1. Access the web interface at http://localhost:1080

### Troubleshooting

If you are getting a bunch of "Login required" errors in the console, make sure that you have disabled any kind of enhanced tracking protection.

Auth0 use third-party cookies for authentication, and they get blocked by all major browsers
by default.

## Testing

1. Run the api test suite via `dev test_api`.

See [api/tests/README.md](./api/tests/README.md) for more detailed info.

## Migrations - Database Management

This project is using [knex](https://knexjs.org/guide/migrations.html#migration-cli) with the config hoisted from the db/db-client.ts file.

NOTE: Migrations should use snake_case. While database table and column names use snake_case, we are using Sequelize for our models so that we get camelCase to match the JS standard, in the JS section of the codebase.

1. To create a new migration from the template [sample-migration](./api/src/db/template/sample-migration.ts) do:

   ```bash
   dev migrate make create-users-table
   ```

   or

   ```bash
   dev knex migrate:make create-users-table
   ```

   Or

   ```bash
   dev api sh
   npm run knex migrate:make create-users-table
   ```

   > If you are using Linux, all files created in docker will be created as `root` so you won't be able to edit them. Luckily, this is handle by the `dev knex` command, when using Linux, after you provide your `sudo` password.

2. To run the all new migrations do:

   ```bash
   dev migrate latest
   ```

   or

   ```bash
   dev migrate up
   ```

3. To rollback the last executed migration:

   ```bash
   dev migrate down
   ```

4. To rollback all migrations:

   ```bash
   dev migrate rollback --all
   ```

### Seeding

Seeding is similar to migrating but with less options, see Knex docs.

Currently only has these commands:

- `dev seed make fill-users-table`
- `dev seed run`

Can also use the other patterns

```bash
dev knex seed:make fill-users-table
```

Or

```bash
dev api sh
npm run knex seed:make fill-users-table
```

Seeds are separated by environment.
i.e. api/src/db/seeds/development vs. api/src/db/seeds/production

This allows for the convenient loading of required defaults in production, with more complex seeds in development, for easy QA.

Seeds currently don't keep track of whether they have run or not. As such, seed code should be idempotent, so that it can be executed at any point in every environment.

### References

- [knex](https://knexjs.org/guide/migrations.html#migration-cli)

### Extras

If you want to take over a directory or file in Linux you can use `dev ownit <path-to-directory-or-file>`.

If you are on Windows or Mac, and you want that to work, you should implement it in the `bin/dev` file. You might never actually need to take ownership of anything, so this might not be relevant to you.

## Set up `dev` command

The `dev` command vastly simplifies development using docker compose. It only requires `ruby`; however, `direnv` and `asdf` will make it easier to use.

It's simply a wrapper around docker compose with the ability to quickly add custom helpers.

All commands are just strings joined together, so it's easy to add new commmands. `dev` prints out each command that it runs, so that you can run the command manually to debug it, or just so you learn some docker compose syntax as you go.

1. (optional) Install `asdf` as seen in https://asdf-vm.com/guide/getting-started.html.

   e.g. for Linux

   ```bash
   apt install curl git

   git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.12.0

   echo '
   # asdf
   . "$HOME/.asdf/asdf.sh"
   . "$HOME/.asdf/completions/asdf.bash"
   ' >> ~/.bashrc
   ```

2. Install `ruby` via `asdf` as seen here https://github.com/asdf-vm/asdf-ruby, or using whatever custom Ruby install method works for your platform.

   e.g. for Linux

   ```bash
   asdf plugin add ruby https://github.com/asdf-vm/asdf-ruby.git

   # install version from .tool-versions file
   asdf install ruby

   asdf reshim ruby
   ```

   You will now be able to run the `./bin/dev` command.

3. (optional) Install [direnv](https://direnv.net/) and create an `.envrc` with

   ```bash
    #!/usr/bin/env bash

    PATH_add bin
   ```

   and then run `direnv allow`.

   You will now be able to do `dev xxx` instead ov `./bin/dev xxx`.

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
   VITE_APPLICATION_NAME="Digital Vault"
   HOST_PORT=8080
   API_PORT=8080

   DB_HOST=db
   DB_PORT=1433
   DB_USERNAME=sa
   DB_PASSWORD=DevPwd99!
   DB_DATABASE=digital_vault_production

   DB_TRUST_SERVER_CERTIFICATE=true # false or unset in production environment

   VITE_API_BASE_URL="http://localhost:8080"
   VITE_AUTH0_CLIENT_ID="mNqPwPZ5M1VXkEH6e8OgEaxmmWfxecwo"
   VITE_AUTH0_AUDIENCE="testing"
   VITE_AUTH0_DOMAIN="https://dev-0tc6bn14.eu.auth0.com"

   MAIL_HOST="mail"
   MAIL_PORT=1025
   MAIL_FROM="digital-vault.development@yukon.ca"
   MAIL_SERVICE="MailDev" # Outlook365 or unset in production environment
   ```

2. (optional) If testing build arguments do

   ```bash
   dc build --build-arg RELEASE_TAG=2024.01.8.1 --build-arg GIT_COMMIT_HASH=532bd759c301ddc3352a1cee41ceac8061bfa3f7
   ```

   or

   ```bash
   dc build \
      --build-arg RELEASE_TAG=$(date +%Y.%m.%d) \
      --build-arg GIT_COMMIT_HASH=$(git rev-parse HEAD)
   ```

   and then in the next step drop the `--build` flag.

3. Build and boot the production image via

   ```bash
   docker compose up --build
   ```

4. Go to http://localhost:3000/ and log in.

5. Navigate around the app and do some stuff and see if it works.
