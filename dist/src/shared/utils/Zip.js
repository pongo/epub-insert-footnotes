import AdmZip from 'adm-zip';
class File {
    zip;
    file;
    constructor(zip, file) {
        this.zip = zip;
        this.file = file;
    }
    get path() {
        return this.file.entryName;
    }
    async getText() {
        return new Promise((resolve) => this.zip.readAsTextAsync(this.file, resolve, 'utf-8'));
    }
}
export class Zip {
    path;
    zip;
    constructor(path) {
        this.path = path;
        this.zip = new AdmZip(this.path, { noSort: true });
    }
    get files() {
        return this.zip.getEntries().map((x) => new File(this.zip, x));
    }
    updateFile(path, text) {
        this.zip.updateFile(path, Buffer.from(text));
    }
    async writeZip(dest) {
        return new Promise((resolve, reject) => this.zip.writeZip(dest, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        }));
    }
}
//# sourceMappingURL=Zip.js.map