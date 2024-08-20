var fs = require('fs');


function getPackageJson() {
  console.log('----------------------1.开始读取package.json')
  var _packageJson = fs.readFileSync('../package.json')
  console.log('----------------------读取package.json文件完毕')

  const jsonStream = JSON.parse(_packageJson)
  jsonStream.version = "1.0.2"
  fs.writeFile('./package.json', JSON.stringify(jsonStream, null, 2) + '\n', function (err) {
    if (err) console.error(err);
    console.log('----------------------修改package.json文件完毕，version修改为：', jsonStream.version)
  });
}
getPackageJson()
