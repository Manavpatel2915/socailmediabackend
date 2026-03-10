import archiver from "archiver";
import fs from "fs";

export const createZip = (sourcePath: string, outputPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    const stat = fs.statSync(sourcePath);
    if (stat.isDirectory()) {
      archive.directory(sourcePath, false);
    } else {
      archive.file(sourcePath, { name: "Userdata.txt" });
    }

    archive.finalize();
  });
};