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

        console.log(this);

        var result = template(this);

        FileHelper.createFile(folderPath, this.fileName, result);

        console.log("Generate YAML");
    }

}
