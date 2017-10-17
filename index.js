var cli = require('cli');
const path = require('path');
const fs = require('fs-extra');
const replace = require('replace-in-file');

options = cli.parse({
  projectname: [ 'p', 'Project Name', 'string' ],
  sourcefolder: [ 'd', 'Path to folder', 'path'],
  intermediate: [ 't', 'Generate Temp Target (Use Intermediate folder)', 'bool', false]
});

console.log(JSON.stringify(options));

if (options.projectname == null) {
  console.error("Please pass Project Name argument '-p'. See help -h.")
  process.exit(1);
  return;
}

if (options.sourcefolder == null) {
  console.error("Please pass project path argument '-d'. See help -h.")
  process.exit(1);
  return;
}

var SourceFolder = 'Source';

if (options.intermediate) {
  console.log('ass');
  SourceFolder = path.join("Intermediate", SourceFolder);
}

var TargetFilePath = path.join(options.sourcefolder, SourceFolder, options.projectname + "Server.Target.cs");

try {
  fs.copySync(path.join(__dirname, "Target.cs.template"), TargetFilePath);
} catch (error) {
  console.error('Error occurred:', error);
  process.exit(1);
  return;
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

console.log("Generated server target file.");
process.exit(0);