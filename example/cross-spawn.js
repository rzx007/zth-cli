#! /usr/bin/env node 

const spawn = require('cross-spawn');
const chalk = require('chalk')

// 定义需要按照的依赖
const dependencies = ['vue', 'vuex', 'vue-router'];

// 执行安装
const child = spawn('cnpm', ['install', '-D'].concat(dependencies), { 
    stdio: 'inherit' 
});

// 监听执行结果
child.on('close', function(code) {
    // 执行失败
    if(code !== 0) {
        console.log(chalk.red('Error occurred while installing dependencies!'));
        process.exit(1);
    }
    // 执行成功
    else {
        console.log(chalk.cyan('Install finished'))   
    }
})
