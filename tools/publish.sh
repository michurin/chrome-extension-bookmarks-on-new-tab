#!/bin/sh

cd ${0%/*} &&
cd .. ||
{
  echo 'Can not change dir'
  exit 1
}
base='bookmarks-on-new-tab'
test -z "`git status --porcelain "$base"`" ||
{
  echo 'ERROR: not clean.'
  git status "$base"
  exit 1
}

manifest="$base/manifest.json"
version=`python -c 'print(__import__("json").load(open("'$manifest'", "r"))["version"])'`
target="$base-$version.zip"
test -e "$target" &&
{
  echo "ERROR: file $target exists."
  exit 1
}
zip -r "$target" "$base"
