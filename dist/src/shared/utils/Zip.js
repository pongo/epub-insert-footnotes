"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adm_zip_1 = __importDefault(require("adm-zip"));
class File {
    constructor(zip, file) {
        this.zip = zip;
        this.file = file;
    }
    get path() {
        return this.file.entryName;
    }
    async getText() {
        return new Promise(resolve => this.zip.readAsTextAsync(this.file, resolve, 'utf-8'));
    }
}
class Zip {
    constructor(path) {
        this.path = path;
        this.zip = new adm_zip_1.default(this.path);
    }
    get files() {
        return this.zip.getEntries().map(x => new File(this.zip, x));
    }
    updateFile(path, text) {
        this.zip.updateFile(path, Buffer.from(text));
    }
    async writeZip(dest) {
        return new Promise((resolve, reject) => this.zip.writeZip(dest, err => {
            if (err)
                reject(err);
            else
                resolve();
        }));
    }
}
exports.Zip = Zip;
//# sourceMappingURL=Zip.js.map