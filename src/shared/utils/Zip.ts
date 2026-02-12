import AdmZip from 'adm-zip';
import type { ChapterFilePath } from '#src/app/types.js';

class File {
  private readonly zip: AdmZip;
  private readonly file: AdmZip.IZipEntry;

  constructor(zip: AdmZip, file: AdmZip.IZipEntry) {
    this.zip = zip;
    this.file = file;
  }

  get path(): ChapterFilePath {
    return this.file.entryName as ChapterFilePath;
  }

  async getText(): Promise<string> {
    return new Promise((resolve) => this.zip.readAsTextAsync(this.file, resolve, 'utf-8'));
  }
}

export class Zip {
  readonly path: string;
  private readonly zip: AdmZip;

  constructor(path: string) {
    this.path = path;
    this.zip = new AdmZip(this.path, { noSort: true });
  }

  get files(): File[] {
    return this.zip.getEntries().map((x) => new File(this.zip, x));
  }

  updateFile(path: string, text: string) {
    this.zip.updateFile(path, Buffer.from(text));
  }

  async writeZip(dest?: string) {
    return new Promise<void>((resolve, reject) =>
      this.zip.writeZip(dest, (err) => {
        if (err) reject(err);
        else resolve();
      }),
    );
  }
}
