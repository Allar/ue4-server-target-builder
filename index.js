var cli = require('cli');
const path = require('path');
const fs = require('fs-extra');
const replace = require('replace-in-file');
const klawSync = require('klaw-sync')

var SuccessCode = 0;
var NoCodeProjectCode = 1;
var FailureCode = 2;

options = cli.parse({
  projectname: [ 'p', 'Project Name', 'string' ],
  sourcefolder: [ 'd', 'Path to folder', 'path'],
  emitnocodecode: [ 'c', `Process will exit with return code ${NoCodeProjectCode} if it has no code.`, 'bool', false]
});

if (options.projectname == null) {
  console.error("Please pass Project Name argument '-p'. See help -h.")
  process.exit(FailureCode);
  return;
}

if (options.sourcefolder == null) {
  console.error("Please pass project path argument '-d'. See help -h.")
  process.exit(FailureCode);
  return;
}

// Is this a BP only project?
var bHasCode = fs.pathExistsSync(path.join(options.sourcefolder, 'Source'));
if (!bHasCode) {
  console.log("Project is detected as a blueprint only project.");
  if (options.emitnocodecode) {
    console.log(`Will be emitting code ${NoCodeProjectCode} on success due to -bp flag.`);
    SuccessCode = NoCodeProjectCode;
  }
}

var SourceFolder = bHasCode ? "Source" : "Intermediate/Source";
var TargetFilePath = path.join(options.sourcefolder, SourceFolder, options.projectname + "Server.Target.cs");

try {
  fs.copySync(path.join(__dirname, "Target.cs.template"), TargetFilePath);
} catch (error) {
  console.error('Error occurred:', error);
  process.exit(FailureCode);
  return;
}

const gamename_options = {
  files: TargetFilePath,
  from: /\{GAME_NAME\}/g,
  to: options.projectname + 'Server'
};

const gamemodule_options = {
  files: TargetFilePath,
  from: /\{GAME_MODULE\}/g,
  to: options.intermediate ? "UE4Game" : options.projectname
};

try {
  replace.sync(gamename_options);
  replace.sync(gamemodule_options);
} catch (error) {
  console.error('Error occurred:', error);
  process.exit(FailureCode);
}

console.log("Generated server target file if it did not already exist.");
process.exit(SuccessCode);