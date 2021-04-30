import { addPath, getInput, setFailed, debug } from "@actions/core";
import os from "os";
import cache, { extractZip } from "@actions/tool-cache";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const chmod = promisify(fs.chmod);

const FILENAME = "rclone";

async function main() {
  try {
    const url = getInput("rclone-url");
    const version = getInput("rclone-version");
    const platform = "linux"; // TODO: Add other platforms
    let arch = os.arch();
    if (arch === "x64") {
      arch = "amd64";
    }

    let toolPath = cache.find(FILENAME, version, arch);
    if (!toolPath) {
      const context: { [key: string]: string } = {
        PLATFORM: `${platform}-${arch}`,
        RCLONE_VERSION: version,
      };
      const rendered = url.replace(/\{(\w+?)\}/g, (a, match) => {
        return context[match] || "";
      });
      const dirName = rendered.substr(9, rendered.lastIndexOf("/"));

      const downloadPath = await cache.downloadTool(rendered);
      const downloadedPath = await extractZip(downloadPath);
      debug("downloadedpath: " + downloadedPath);
      const extractedPath = path.join(dirName, FILENAME);
      toolPath = await cache.cacheFile(
        extractedPath,
        FILENAME,
        FILENAME,
        version
      );
    }

    debug("toolpath:" + toolPath);

    await chmod(path.join(toolPath, FILENAME), 0o755);
    addPath(toolPath);
  } catch (err) {
    setFailed(err.message);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
}
