#!/usr/bin/bash

npm install
npm run build:prod
tar zcvf ./webapp-htdocs-prebuild-1.0.tar.gz ./dist

