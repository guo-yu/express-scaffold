#!/bin/sh

git clone https://github.com/turingou/express-scaffold.git .
npm install .
cp app.sample.js app.js
rm app.sample.js README.md LICENSE
rm -rf bin
rm -rf .git