import { window, workspace } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function readFileAsync(path: fs.PathLike) {
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

export function createFile(folderPath: string, fileName: string, content: string, successMessage: string, failedMessage: string) {
    fs.writeFile(path.join(folderPath, fileName), content, err => {
        if (err) {
            console.log(err);
            return window.showErrorMessage(failedMessage);
        }

        window.showInformationMessage(successMessage);
    });
}

export async function openUntitledTab(content: string, successMessage: string, language: string = 'yaml') {
    const document = await workspace.openTextDocument({
        language,
        content,
    });

    window.showTextDocument(document);
    window.showInformationMessage(successMessage);
}