#!/bin/sh

cd ${0%/*} &&
cd ..
jshint --verbose bookmarks-on-new-tab/*.js
echo "rc=$?"
