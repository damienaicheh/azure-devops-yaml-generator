import { window, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { FileHelper } from '../helpers/file-helper';
import { InputStep, MultiStepInput } from '../helpers/multi-step-case';

/**
 * Total step
 * etat
 * Regroupement des méthodes de pick
 * Détermination de l'état d'apres
 */

export class YamlGenerator {

    template: string = '';

    vmImage: string = 'vmImage';

    fileName: string = 'azure-pipelines.yml';

    projectName: string = 'ProjectName';

    unitTests: boolean = false;

    automaticVersion: boolean = false;

    updateIdentifier: boolean = false;

    launchIconBadge: boolean = false;

    generateArtifacts: boolean = false;

    distribute: boolean = false;

    entries: InputStep[] = [];

    async generate(context: ExtensionContext) {
        await MultiStepInput.runAll(this.entries);

        const folderPath = workspace.rootPath ?? '';

        var templatePath = Uri.file(path.join(context.extensionPath, `/templates/${this.template}`)).path;

        var source = await FileHelper.readFileAsync(templatePath);

        var template = Handlebars.compile(source);

        console.log(this);

        var result = template(this);

        FileHelper.createFile(folderPath, this.fileName, result, 'Generation done', 'Failed to create file');
    }

}
