#! /usr/bin/env node
const { getRepoList, getTagList } = require('./http')
const spawn = require('cross-spawn');
const inquirer = require('inquirer')
const chalk = require('chalk') // 字体颜色
const path = require('path')
const util = require('util')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  console.log(message);
  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    return result;
  } catch (error) {
    // 状态为修改为失败
    console.log(chalk.redBright('模板拉取失败，请重试 ...'));
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称

  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template>>>>>');
    if (!repoList) return;
    // 过滤我们需要的模板名称
    const repos = repoList.map(item => item.name);

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择一个项目模板'
    })

    // 3）return 用户选择的名称
    return repo;
  }

  // 获取用户选择的版本
  // 1）基于 repo 结果，远程拉取对应的 tag 列表
  // 2）用户选择自己需要下载的 tag
  // 3）return 用户选择的 tag

  async getTag(repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tags) return;

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map(item => item.name);

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: '请选择一个Tag'
    })

    // 3）return 用户选择的 tag
    return tag
  }

  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo, tag) {
    console.log('选择了，repo=' + repo + '，tag=' + tag)
    // 1）拼接下载地址
    const requestUrl = `github:zth-cli/${repo}${tag ? '#' + tag : ''}`;
    // const requestUrl = `github:rzx007/vue-template-with-elementui`;

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      '正在下载模板...', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir),
      function (err) {
        console.log(err ? chalk.red('Error') : chalk.cyan('Success'))
      }  // 参数2: 创建位置
    )

  }
  async installDependencies() {
    let { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "是否安装依赖:",
        choices: [
          {
            name: chalk.blueBright("立即"),
            value: true,
          },
          {
            name: chalk.redBright("稍后"),
            value: false,
          },
        ],
      },
    ]);
    if (action) {
      // 执行安装
      const child = spawn('cnpm', ['install'], {
        stdio: 'inherit',
        cwd: this.targetDir
      });

      // 监听执行结果
      child.on('close', function (code) {
        // 执行失败
        if (code !== 0) {
          console.log(chalk.red('Error occurred while installing dependencies!'));
          process.exit(1);
        }
        // 执行成功
        else {
          console.log(chalk.cyan('install....'))
          return true
        }
      })
    }
    return false
  }
  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  // 4）模板使用提示
  async create() {

    // 1）获取模板名称
    const repo = await this.getRepo()

    // 2) 获取 tag 名称
    const tag = await this.getTag(repo)

    console.log(repo, tag);

    // 3）下载模板到模板目录
    // await this.download(repo, tag)

    const requestUrl = `github:zth-cli/${repo}${tag ? '#' + tag : ''}`;
    await this.downloadGitRepo(requestUrl, path.resolve(process.cwd(), this.targetDir))
    const isFinsh = await this.installDependencies()
    if (isFinsh) {
      // 4）模板使用提示
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
      console.log('  npm run dev\r\n')
    } else {
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
      console.log('\r\n  npm run install')
      console.log('\r\n  npm run dev\r\n')
    }

  }
}

module.exports = Generator;
