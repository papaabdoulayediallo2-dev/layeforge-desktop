const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const regexPkg = /dependencies:\s*\{\s*electron:\s*"\^26\.0\.0"\s*\},\s*devDependencies:\s*\{\s*"electron-builder":\s*"\^24\.6\.4"\s*\}/;

if(regexPkg.test(code)) {
  code = code.replace(regexPkg, `dependencies: {},
    devDependencies: {
      electron: "^26.0.0",
      "electron-builder": "^24.6.4"
    }`);
  fs.writeFileSync('main.js', code, 'utf8');
  console.log('Fixed dependencies -> devDependencies in main.js!');
} else {
  console.log('Regex not found!');
  
  // Let's do a fallback replace just in case formatting shifted
  code = code.replace(/dependencies.*electron: "\^26.0.0".*devDependencies:.*"electron-builder": "\^24.6.4".*\}/s, `dependencies: {},
    devDependencies: {
      electron: "^26.0.0",
      "electron-builder": "^24.6.4"
    }`);
  fs.writeFileSync('main.js', code, 'utf8');
  console.log('Applied fallback replace!');
}
