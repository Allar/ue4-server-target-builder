var cli = require('cli');
const path = require('path');
const fs = require('fs-extra');
const replace = require('replace-in-file');
const klawSync = require('klaw-sync')

options = cli.parse({
  projectname: [ 'p', 'Project Name', 'string' ],
  sourcefolder: [ 'd', 'Path to folder', 'path'],
  intermediate: [ 't', 'Generate Temp Target (Use Intermediate folder)', 'bool', false],
  forceGenerate: [ 'f', 'Force generate, even if c++ server target exists', 'bool', false]
});

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

// Check to see if server target already exists in non-temp folder
var bSkipGeneration = false;
if (!options.forceGenerate) {
  try {
    const filterFn = item => item.path.indexOf(options.projectname + 'Server.Target.cs') >= 0
    const paths = klawSync(path.join(options.sourcefolder, 'Source'), {nodir: true, filterFn});
    if (paths.length > 0) {
      bSkipGeneration = true;
    }
  } catch (error){
    // Source folder doesn't exist
  }
}

if (bSkipGeneration) {
  console.log("Skipping target generation, C++ server target detected.");
  process.exit(0);
  return;
}

var SourceFolder = 'Source';

if (options.intermediate) {
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
  process.exit(1);
}

console.log("Generated server target file.");
process.exit(0);