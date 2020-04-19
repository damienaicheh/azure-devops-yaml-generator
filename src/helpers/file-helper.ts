import { window } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileHelper {

    static readFileAsync(path: fs.PathLike) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, { encoding: 'utf-8' }, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static createFile(folderPath: string, fileName: string, content: string) {
        fs.writeFile(path.join(folderPath, fileName), content, err => {
            if (err) {
                console.log(err);
                return window.showErrorMessage(
                    "Failed to create file!"
                );
            }

            window.showInformationMessage('Generation done.');
        });
    }
}