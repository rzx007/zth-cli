/*
 * @Author: 阮志雄
 * @Date: 2022-11-27 12:25:52
 * @LastEditTime: 2022-11-27 13:16:43
 * @LastEditors: 阮志雄
 * @Description: In User Settings Edit
 * @FilePath: \zth-cli\example\fs.mjs
 */
// 读取package.json文件，缓存内容

import fs from 'fs';

function getPackageJson() {
  console.log('----------------------1.开始读取package.json')
  var _packageJson = fs.readFileSync('../package.json')
  console.log('----------------------读取package.json文件完毕')
  return JSON.parse(_packageJson)
}


function _getPackageVersion() {
  return cbDataPackage.version
} var cbDataPackage = getPackageJson()

function writePackageJson(cbDataPackage, wholeVersion) {
  // 方法1： 重写package.json文件
  console.log('----------------------4. 开始修改package.json文件')
  cbDataPackage.version = wholeVersion
  fs.writeFile('./package.json', JSON.stringify(cbDataPackage, null, 2), function (err) {
    if (err) console.error(err);
    console.log('----------------------修改package.json文件完毕，version修改为：', cbDataPackage.version)
  });
}
writePackageJson(getPackageJson(), '1.1.2')