import { workspace, ExtensionContext, Uri } from 'vscode';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { FileHelper } from '../helpers/file-helper';
import { InputStep, MultiStepInput } from '../helpers/multi-step-case';

/**
 * ajout identifiant id
 * version manuel ou set auto version git
 * variables
 * groups
 * commentaires
 * variabiliser tout
 * ajout de succeed dans les stage
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

    currentStep: number = 1;

    steps: InputStep[] = [];

    async generate(context: ExtensionContext) {
        await MultiStepInput.runAll(this.steps);

        const folderPath = workspace.rootPath ?? '';

        var templatePath = Uri.file(path.join(context.extensionPath, `/templates/${this.template}`)).path;

        var source = await FileHelper.readFileAsync(templatePath);

        var template = Handlebars.compile(source);

        var result = template(this);

        FileHelper.createFile(folderPath, this.fileName, result, 'Generation done', 'Failed to create file');
    }

}
