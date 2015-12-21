#!/bin/sh

files=$(git diff --cached --name-only --diff-filter=ACM)
images=$(echo "$files" | grep -e ".png$" -e ".gif$" -e ".jpg$" -e ".svg$")
javascripts=$(echo "$files" | grep -e ".jsx\?$")
stylesheets=$(echo "$files" | grep -e ".styl\?$")

warn=false
pass=true

if [ "$images" != "" -o "$javascripts" != "" -o "$stylesheets" != "" ]; then
  echo ""
  echo "optimize or validate files"
  echo ""
fi

if [ "$images" != "" ]; then
  for img in ${images}; do
    tmp=`mktemp`
    cat ${img} | ./node_modules/.bin/imagemin > ${tmp}
    if [ -f $tmp -a $(du -sb ${tmp} | awk '{print $1}') != 0 ]; then
      mv -f ${tmp} ${img}
      git add ${img}
      echo "\033[32m✓ [image]\t${img}\033[0m"
    else
      echo "\033[31m✗ [image]\t${img}\033[0m"
      pass=false
    fi
  done
fi

if [ "$javascripts" != "" ]; then
  for javascript in ${javascripts}; do
    result=$(./node_modules/.bin/eslint ${javascript} -f compact | sed -e "s/^.*: //g")
    if [ "$(echo $result | grep Error)" = "" ]; then
      if [ "$(echo $result | grep Warning)" = "" ]; then
        echo "\033[32m✓ [eslint]\t${javascript}\033[0m"
      else
        warn=true
        echo "\033[33m⚠︎︎ [eslint]\t${javascript}\033[0m"
        echo "$result"
      fi
    else
      echo "\033[31m✗ [eslint]\t${javascript}\033[0m"
      echo "$result"
      pass=false
    fi
  done
fi

if [ "$stylesheets" != "" ]; then
  for stylesheet in ${stylesheets}; do
    result=$(./node_modules/.bin/stylint ${stylesheet})
    if [ "$(echo $result | grep Error)" = "" ]; then
      if [ "$(echo $result | grep Warning)" = "" ]; then
        echo "\033[32m✓ [stylint]\t${stylesheet}\033[0m"
      else
        warn=true
        echo "\033[33m⚠︎ [stylint]\t${stylesheet}\033[0m"
        echo "$result"
      fi
    else
      echo "\033[31m✗ [stylint]\t${stylesheet}\033[0m"
      echo "$result"
      pass=false
    fi
  done
fi

if ! $pass; then
  echo "\033[31m"
  echo "✗ commit failure"
  echo "\033[0m"
  exit 1
elif $warn; then
  echo "\033[33m"
  echo "⚠︎ commit success (all warnings issued should be fixed before git push)"
  echo "\033[0m"
  exit 0
else
  echo "\033[32m"
  echo "✓ commit success"
  echo "\033[0m"
  exit 0
fi
