#! /usr/bin/env node


const figlet = require('figlet') // 字体转成logo

const slogan = 'zth-cli'

figlet(slogan, function (err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }
  console.log(data)
});