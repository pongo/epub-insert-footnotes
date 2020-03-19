import AdmZip from 'adm-zip';
import { ChapterFilePath } from 'src/app/types';

class File {
  constructor(private readonly zip: AdmZip, private readonly file: AdmZip.IZipEntry) {}

  get path(): ChapterFilePath {
    return this.file.entryName as ChapterFilePath;
  }

  async getText(): Promise<string> {
    return new Promise(resolve => this.zip.readAsTextAsync(this.file, resolve, 'utf-8'));
  }
}

export class Zip {
  private readonly zip: AdmZip;

  constructor(readonly path: string) {
    this.zip = new AdmZip(this.path);
  }

  get files(): File[] {
    return this.zip.getEntries().map(x => new File(this.zip, x));
  }

  updateFile(path: string, text: string) {
    this.zip.updateFile(path, Buffer.from(text));
  }

  async writeZip(dest?: string) {
    return new Promise((resolve, reject) =>
      this.zip.writeZip(dest, err => {
        if (err) reject(err);
        else resolve();
      }),
    );
  }
}
