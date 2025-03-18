# API service Tests

## Implementation

Tests are written in [vitest](https://vitest.dev/guide/) and served via [npm run vitest](https://vitest.dev/guide/cli.html)

Test initialization goes like this:

1. `api/vitest.config.mts` loads the tsconfig.json and finds the appropriate setup functions.

2. Before running the tests, it runs the file found in the `globalSetup` config option. i.e. `api/tests/global-setup.ts`. This does things like setting up the database and running migrations and base seeds.

3. Next it loads a pre-test files using config option `setupFiles` files, currently only `api/tests/setup.ts`. These setup files add callbacks that will run before/after _each test file_ runs, so they should be performant. Mostly cleanup functions such as wiping the database.

4. It runs the actual tests in the loaded file.

5. Runs the next test file, and repeats from step 3.

## General Notes About Tests

1. Tests should map to a specific file in the api/src folder.

   e.g.

   - `api/src/models/user.ts` maps to `api/tests/models/user.test.ts`
   - `api/src/services/users/create-service.ts` maps to `api/tests/services/users/create-service.test.ts`

2. Tests should follow the naming convention `{filename}.test.{extension}`.
3. Test file location should be moved if a given file is moved, and deleted if the file under test is deleted.
4. A good general pattern for a test is
   ```typescript
   describe("api/src/services/users/create-service.ts", () => { // references file under test
     describe("CreateService", () => { // references class or model under test
       describe(".perform", () => { // references a specific method on the class or model
       test("creates a new user in the database", async () => { // descriptive message about the specific behaviour under test
       })
     })
   })
   ```
5. I'm using a plugin that lets me switch between the test and non-test file, and creates the test file if it does not exist. It's not great, but it mostly works. See https://marketplace.visualstudio.com/items?itemName=klondikemarlen.create-test-file

   It requires this config (in your workspace or `.vscode/settings.json`).

   > Note that if this is in your workspace config must be inside the "settings" entry. i.e. `{ "settings": { // these settings } }`.

   ```json
   {
     "createTestFile.nameTemplate": "{filename}.test.{extension}",
     "createTestFile.languages": {
       "[vue]": {
         "createTestFile.nameTemplate": "{filename}.test.{extension}.ts"
       }
     },
     "createTestFile.pathMaps": [
       {
         // Other examples
         // "pathPattern": "/?(.*)",
         // "testFilePathPattern": "spec/$1"
         "pathPattern": "(api)/src/?(.*)",
         "testFilePathPattern": "$1/tests/$2"
       },
       {
         "pathPattern": "(web)/src/?(.*)",
         "testFilePathPattern": "$1/tests/$2"
       }
     ],
     "createTestFile.isTestFileMatchers": [
       "^(?:test|spec)s?/",
       "/(?:test|spec)s?/",
       "/?(?:test|spec)s?_",
       "/?_(?:test|spec)s?",
       "/?\\.(?:test|spec)s?",
       "/?(?:test|spec)s?\\."
     ]
   }
   ```
