var cli = require('cli');
const path = require('path');
const fs = require('fs-extra');
const replace = require('replace-in-file');

options = cli.parse({
  projectname: [ 'p', 'Project Name', 'string' ],
  sourcefolder: [ 's', 'Path to project Intermediate/Source folder', 'path'],
});

var TargetFilePath = path.join(options.sourcefolder, options.projectname + "Server.Target.cs");

try {
  fs.copySync(path.join(__dirname, "Target.cs.template"), TargetFilePath);
} catch (error) {
  console.error('Error occurred:', error);
  process.exit(1);
}

const replace_options = {
  files: TargetFilePath,
  from: /\{GAME_NAME\}/g,
  to: options.projectname + 'Server'
};

try {
  replace.sync(replace_options);
} catch (error) {
  console.error('Error occurred:', error);
  process.exit(1);
}

process.exit(0);