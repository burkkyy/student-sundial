#!/bin/sh

BASE_DIR="$PWD"
APP_DIR="$BASE_DIR/app"

[ ! -d "$APP_DIR" ] && {
  echo "app/ not found. Forgot to build?";
  exit 1;
}

cd "$APP_DIR"

BOOT_SCRIPT="./bin/boot-app.sh"
export NODE_ENV=production
exec "$BOOT_SCRIPT"
