import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const name=directory+"/"+entry.name;
    if(entry.isDirectory()) await walk(name); else files.push(name);
  }
}
for(const directory of ["app","components","data","lib","db","public","scripts","tests","deploy"]) await walk(directory);
files.push("package.json","pnpm-lock.yaml","next.config.mjs","tsconfig.json","eslint.config.mjs",".env.example",".gitignore",".npmrc",".dockerignore","Dockerfile","compose.yaml");
const hashes = [];
for(const file of files.sort()) hashes.push({file,sha256:createHash("sha256").update(await readFile(file)).digest("hex")});
const sourceHash=createHash("sha256").update(hashes.map(item=>item.file+":"+item.sha256).join("\n")).digest("hex");
console.log(JSON.stringify({
  release:"wicclaw-launch-20261022-"+sourceHash.slice(0,12),
  baseCommit:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),
  sourceHash,files:hashes,
},null,2));
