import { window, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
const YAML = require('yaml');

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

    generate(): void {
        const folderPath = workspace.rootPath ?? '';
        console.log(folderPath);

        const object = {
            pool: { vmImage: 'macOS-latest' },
            steps: [{
                script: 'sudo $AGENT_HOMEDIRECTORY/scripts/select-xamarin-sdk.sh 6_4_0',
                displayName: 'Select the Xamarin SDK version',
                enabled: true,
            }, {
                task: 'InstallAppleCertificate@2',
                inputs: {
                    certSecureFile: '$(p12FileName)',
                    certPwd: '$(p12Password)',
                    keychain: 'temp',
                    deleteCert: true
                }
            }],
        };

        const yamlContent = YAML.stringify(object);

        this.createFile(folderPath, this.fileName, yamlContent);

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
