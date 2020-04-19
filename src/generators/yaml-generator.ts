import { window, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { FileHelper } from '../helpers/file-helper';

export class YamlGenerator {
    fileName: string = 'azure-pipelines.yml';
    projectName: string = 'ProjectName';
    vmImage: string = 'vmImage';
    unitTests: boolean = false;
    automaticVersion: boolean = false;
    launchIconBadge: boolean = false;
    generateArtifacts: boolean = false;
    distribute: boolean = false;
    /**
     * Total step
     * etat
     * Regroupement des méthodes de pick
     * Détermination de l'état d'apres
     */

    async generate(context: ExtensionContext) {
        const folderPath = workspace.rootPath ?? '';

        var templatePath = Uri.file(path.join(context.extensionPath, '/templates/stages.yml.tmpl')).path;

        var source = await FileHelper.readFileAsync(templatePath);


        var template = Handlebars.compile(source);

        var data = {
            "fileName": "",
            "projectName": "XamarinDevOps",
            "vmImage": "macOS-latest",
            "unitTests": true,
            "automaticVersion": true,
            "launchIconBadge": false,
            "generateArtifacts": true,
            "distribute": false,
        };

        var result = template(data);

        FileHelper.createFile(folderPath, "azure-pipelines.yml", result);

        ///

        var data2 = {
            "fileName": "",
            "projectName": "CrazyProject",
            "vmImage": "macOS-latest",
            "unitTests": false,
            "automaticVersion": false,
            "launchIconBadge": true,
            "generateArtifacts": false,
            "distribute": true,
        };
        var result = template(data2);

        FileHelper.createFile(folderPath, "azure-crazy.yml", result);


        var result = template(this);

        FileHelper.createFile(folderPath, "azure-pipelines-official.yml", result);

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

}
