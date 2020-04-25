import { workspace, ExtensionContext, Uri } from 'vscode';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { FileHelper } from '../helpers/file-helper';
import { InputStep, MultiStepInput } from '../helpers/multi-step-case';
import *  as steps from "./steps";

/**
 * commentaires
 * total step bug when back
 * ajout de succeed dans les stage
 */

export class YamlGenerator {

    template: string = '';

    vmImage: string = 'vmImage';

    fileName: string = 'azure-pipelines.yml';

    projectName: string = 'ProjectName';

    unitTests: boolean = false;

    useAab: boolean = false;

    automaticVersion: boolean = false;

    updateIdentifier: boolean = false;

    launchIconBadge: boolean = false;

    generateArtifacts: boolean = false;

    distribute: boolean = false;

    currentStep: number = 1;

    steps: InputStep[] = [
        input => steps.chooseFileName(this, input),
        input => steps.chooseProjectName(this, input),
    ];

    async generate(context: ExtensionContext) {
        await MultiStepInput.runAll(this.steps);

        const folderPath = workspace.rootPath ?? '';

        var templatePath = path.join(context.extensionPath, `/templates/${this.template}`);

        var source = await FileHelper.readFileAsync(templatePath);

        var template = Handlebars.compile(source);

        var result = template(this);

        FileHelper.createFile(folderPath, this.fileName, result, 'Generation done', 'Failed to create file');
    }

}
