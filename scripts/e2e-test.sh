#!/bin/bash

BASE_DIR=`dirname $0`
mongo localhost:27017/burgo_test scripts/cleandb.js
node app test &
echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo $BASE_DIR
echo "-------------------------------------------------------------------"
$BASE_DIR/../node_modules/karma/bin/karma start $BASE_DIR/../config/karma-e2e.conf.js $*
