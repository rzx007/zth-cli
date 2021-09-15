#! /usr/bin/env node

// 用于检查入口文件是否正常执行
const inquirer = require('inquirer')
const chalk = require('chalk') // 字体颜色
const figlet = require('figlet') // 字体转成logo
const path = require('path')
const fs = require('fs')
const ejs = require('ejs') // 可以给模板设置内容

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: chalk.magenta.bgBlueBright('你的名字'),
    default: 'rzx'
  }
]).then(answers => {
  console.log(answers)
  // 模板目录
  const desttUrl = path.join(__dirname, 'templates')
  // 生成文件目录
  // process.cwd() 对应控制台所在目录
  const cwdUrl = process.cwd()

  //读取模板文件
  fs.readdir(desttUrl, (err, files) => {
    if (err) throw err
    files.forEach(file => {
      // 使用 ejs 渲染对应的模版文件
      // renderFile（模版文件地址，传入渲染数据）
      ejs.renderFile(path.join(desttUrl, file), answers).then(data => {
        // 生成 ejs 处理后的模版文件, data输出渲染后的 HTML 字符串
        fs.writeFileSync(path.join(cwdUrl, file), data)
        figlet('Hello World!!', function (err, data) {
          if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
          }
          console.log(data)
        });
      })
    })
  })
})