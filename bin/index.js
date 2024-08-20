#! /usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk'); // 字体颜色
const figlet = require('figlet'); // 字体转成logo
const create = require('../lib/create');
const process = require('process');
program
  .command('create <name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    create(name, options)
  });

// 配置 config 命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options);
  });

// 配置 ui 命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option);
  });

program
  .on('--help', () => { // 监听 --help 执行
    // 使用 figlet 绘制 Logo
    console.log(`\r\n${figlet.textSync('zth-cli', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 120,
      whitespaceBreak: true,
    })}`);
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan('zth <command> --help')} for detailed usage of given command\r\n`);
  });

program
  // 配置版本号信息
  // eslint-disable-next-line global-require
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]');

program.parse(process.argv);
