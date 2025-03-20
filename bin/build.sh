#!/bin/sh

# just for printing with color
PINFO_COLOR="1;34"
PUPDATE_COLOR="1;32"

PINFO_PREFIX="[-]"
PUPDATE_PREFIX="[+]"

pinfo(){ printf "\033[${PINFO_COLOR}m%s\033[0m %s\n" "$PINFO_PREFIX" "$1"; }
pupdate(){ printf "\033[${PUPDATE_COLOR}m%s\033[0m %s\n" "$PUPDATE_PREFIX" "$1"; }

BASE_DIR="$PWD"
API_DIR="$BASE_DIR/api"
WEB_DIR="$BASE_DIR/web"
APP_DIR="$BASE_DIR/app"

# step 1 - setup production app
mkdir -p "$APP_DIR/dist" 
cd "$APP_DIR"

export NODE_ENV=production
cp "$API_DIR/package.json" "$APP_DIR/"
cp "$API_DIR/package-lock.json" "$APP_DIR/"
npm install --production 1>/dev/null 2>&1
npm cache clean --force --loglevel=error 1>/dev/null 2>&1

pupdate "production env setup complete"

# step 2 - api build
export NODE_ENV=development
cd "$API_DIR"
npm install 1>/dev/null 2>&1
npm run build 1>/dev/null 2>&1
pupdate "api build complete"

# step 3 - web build
export NODE_ENV=development
cd "$WEB_DIR"
npm install 1>/dev/null 2>&1
npm run build 1>/dev/null 2>&1

export NODE_ENV=production
npm run build 1>/dev/null 2>&1
pupdate "web build complete"

# step 4 - copy api build and web build to production app
mkdir -p "$APP_DIR/dist"
cp -r "$API_DIR/dist/." "$APP_DIR/dist/"
mkdir -p "$APP_DIR/dist/web"
cp -r "$WEB_DIR/dist/." "$APP_DIR/dist/web/"

pupdate "api and web build to production app complete"

# Might ditch this step... remove if causing issues
echo "RELEASE_TAG=$RELEASE_TAG" > "$APP_DIR/VERSION"
echo "GIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> "$APP_DIR/VERSION"

# step 5 - make our entry point executable
mkdir -p "$APP_DIR/bin"
cp "$API_DIR/bin/boot-app.sh" "$APP_DIR/bin/"
chmod +x "$APP_DIR/bin/boot-app.sh"
pupdate "app build complete"
pinfo "Run the app via $APP_DIR/bin/boot-app.sh"
