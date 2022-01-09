#! /usr/bin/env node
const chalk = require("chalk"); // 字体颜色
const path = require("path");
const fse = require("fs-extra");
const inquirer = require("inquirer");
const Generator = require("./Generator");


/*1.如果存在
 1.1当 { force: true } 时，直接移除原来的目录，直接创建
 1.2当 { force: false } 时 询问用户是否需要覆盖
2.如果不存在，直接创建
3.用户选择模板
4.用户选择版本
5.获取下载模板的链接*/

//  对命令进行处理
module.exports = async function (name, options) {
  console.log("项目名称是: " + chalk.green(name));
  // console.log("options:", options);
  // 解析执行创建命令
  const cwd = process.cwd(); // 当前命令行选择得目录 如： D:\\Code\\person-project\\rzx-node-cli

  const targetAir = path.join(cwd, name); // // 需要创建的目录地址

  // 目录是否存在
  if (fse.existsSync(targetAir)) {
    if (options.force) {
      // 删除目录，强制创建
      await fse.remove(targetAir);
    } else {
      // 询问用户是否确定要覆盖
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "目标已存在，请选择一个操作:",
          choices: [
            {
              name: chalk.blueBright("覆盖"),
              value: "overwrite",
            },
            {
              name: chalk.redBright("退出"),
              value: false,
            },
          ],
        },
      ]);
      if (!action) {
        return;
      } else if (action === "overwrite") {
        // 移除已存在的目录
        console.log(`\r\nRemoving...`);
        await fse.remove(targetAir);
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir);

  // 开始创建项目
  generator.create();
};
