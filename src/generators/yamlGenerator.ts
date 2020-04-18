import { window, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
const YAML = require('yaml');
import * as Handlebars from 'handlebars';

export abstract class YamlGenerator {
    fileName: string = 'azure-pipelines.yml';
    addUnitTest: boolean | undefined;
    generateArtifacts: boolean | undefined;
    addAppCenter: boolean | undefined;

    defineVmImage(vmImage: string): Object {
        return { pool: { vmImage: vmImage }, };
    }

    abstract restoreDependencies(): void;

    abstract runUnitTests(): void;

    abstract build(): void;

    abstract publishArtifacts(): void;

    abstract distributeThroughAppCenter(): void;

    readFileAsync(path: fs.PathLike) {
        return new Promise(function (resolve, reject) {
            fs.readFile(path, { encoding: 'utf-8' }, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                    console.log(typeof (result));
                    console.log(result);
                    console.log("Read OK");
                }
            });
        });
    }

    async generate(context: ExtensionContext) {
        const folderPath = workspace.rootPath ?? '';
        console.log(folderPath);
        console.log(Uri.file(path.join(context.extensionPath, '/templates/stages.yml.tmpl')));

        var templatePath = Uri.file(path.join(context.extensionPath, '/templates/stages.yml.tmpl')).path;
        console.log(templatePath);

        var source = await this.readFileAsync(templatePath);
        // await fs.readFile(templatePath, { encoding: 'utf-8' }, function (err, data) {
        //     if (!err) {
        //         console.log('received data');
        //         source = data;
        //         console.log(typeof (source));
        //         console.log(source);
        //     } else {
        //         console.log(err);
        //     }
        // });

        console.log("Start 1");

        var template = Handlebars.compile(source);

        var data = {
            "projectName": "XamarinDevOps",
            "vmImage": "macOS-latest",
            "unitTests": true,
            "automaticVersion": true,
            "launchIconBadge": false,
            "distribute": false,
        };

        var result = template(data);

        this.createFile(folderPath, "azure-pipelines.yml", result);

        ///
        console.log("Start 2");

        var data2 = {
            "projectName": "CrazyProject",
            "vmImage": "macOS-latest",
            "unitTests": false,
            "automaticVersion": false,
            "launchIconBadge": true,
            "distribute": true,
        };
        var result = template(data2);

        this.createFile(folderPath, "azure-crazy.yml", result);

        // const object = {
        //     pool: { vmImage: 'macOS-latest' },
        //     steps: [{
        //         script: 'sudo $AGENT_HOMEDIRECTORY/scripts/select-xamarin-sdk.sh 6_4_0',
        //         displayName: 'Select the Xamarin SDK version',
        //         enabled: true,
        //     }, {
        //         task: 'InstallAppleCertificate@2',
        //         inputs: {
        //             certSecureFile: '$(p12FileName)',
        //             certPwd: '$(p12Password)',
        //             keychain: 'temp',
        //             deleteCert: true
        //         }
        //     }],
        // };

        // const yamlContent = YAML.stringify(object);

        // this.createFile(folderPath, this.fileName, yamlContent);

        console.log("Generate YAML");
    }

    private createFile(folderPath: string, fileName: string, content: string) {
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
