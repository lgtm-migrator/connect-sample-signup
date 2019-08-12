#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const forge = require("node-forge");

const BUILD_DIRECTORY = "build";
const [, , directoryToDigestify] = process.argv;
const files = walkSync(directoryToDigestify);
const manifest = getManifest();

files.forEach(file => {
  const fileName = path.basename(file);
  const fileDir = path.dirname(file);
  const content = fs.readFileSync(file);
  const sha = sha256(content);
  const [extension, ...fileParts] = fileName.split(".").reverse();
  const newFileName = [...fileParts, sha, extension].join(".");

  addToManifest(file, path.join(fileDir, newFileName));

  fs.renameSync(file, path.join(fileDir, newFileName));
});

fs.writeFileSync("./manifest.json", JSON.stringify(manifest, null, 2), "utf8");

function addToManifest(originalPath, newPath) {
  manifest[removeBuildDirectory(originalPath)] = removeBuildDirectory(newPath);
}

function removeBuildDirectory(filePath) {
  return filePath
    .split(path.sep)
    .filter(part => part !== BUILD_DIRECTORY)
    .join(path.sep);
}

function getManifest() {
  const manifest = {};
  if (!fs.existsSync("./manifest.json")) {
    return manifest;
  }
  const oldManifest = JSON.parse(fs.readFileSync("./manifest.json"));
  Object.entries(oldManifest).forEach(([baseFile, filePath]) => {
    if (fs.existsSync(path.join(BUILD_DIRECTORY, filePath))) {
      manifest[baseFile] = filePath;
    }
  });
  return manifest;
}
function walkSync(dir, filelist = []) {
  return [].concat.apply(
    [],
    fs
      .readdirSync(dir)
      .map(file =>
        fs.statSync(path.join(dir, file)).isDirectory()
          ? walkSync(path.join(dir, file), filelist)
          : filelist.concat(path.join(dir, file))[0]
      )
  );
}

function sha256(input) {
  const token = forge.md.sha256.create();
  token.update(input);
  return token.digest().toHex();
}
