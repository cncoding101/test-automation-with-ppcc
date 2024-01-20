#!/bin/bash

#cucumber tag
TAG=$1

#run cucumber tests & on failuire run postcucumber
if [[ -z ${TAG} ]]
then 
    npm run cucumber -- -p all || npm run postcucumber
else 
    npm run cucumber -- -p $TAG || npm run postcucumber
fi