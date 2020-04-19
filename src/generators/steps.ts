import { window, commands, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import { YamlGenerator } from "./yaml-generator";
import { MultiStepInput } from '../helpers/multi-step-case';

export async function chooseFileName(generator: YamlGenerator, step: number, totalSteps: number, input: MultiStepInput, context: ExtensionContext) {
    const title = 'Give a name to your yaml pipeline file';

    generator.fileName = await input.showInputBox({
        title,
        value: 'azure-pipelines.yml',
        step: step,
        totalSteps: totalSteps,
        prompt: 'Give a name to your yaml pipeline file',
        validate: validateFileName,
        shouldResume: shouldResume
    });

    async function validateFileName(name: string) {
        return name.endsWith('.yml') ? undefined : 'Make sure your file extension is \'.yml\'';
    }

    window.showInformationMessage(`You choose: ${generator.fileName}`);
}

export async function enableUnitTests(generator: YamlGenerator, step: number, totalSteps: number, input: MultiStepInput, context: ExtensionContext) {

    const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

    const title = 'Do you want to run Unit Tests?';

    const pick = await input.showQuickPick({
        title,
        step: step,
        totalSteps: totalSteps,
        items: answers,
        shouldResume: shouldResume
    });

    var answer = getKeyFromValue(AnswerLabel, pick.label);
    generator.unitTests = answer === Answer.Yes;
}

export async function manageVersionAutomatically(generator: YamlGenerator, step: number, totalSteps: number, input: MultiStepInput, context: ExtensionContext) {

    const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

    const title = 'Manage version automatically?';

    const pick = await input.showQuickPick({
        title,
        step: step,
        totalSteps: totalSteps,
        items: answers,
        shouldResume: shouldResume
    });

    var answer = getKeyFromValue(AnswerLabel, pick.label);
    generator.automaticVersion = answer === Answer.Yes;
}

export async function setIdenfier(generator: YamlGenerator, step: number, totalSteps: number, input: MultiStepInput, context: ExtensionContext) {

    const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

    const title = 'Manage application identifier?';

    const pick = await input.showQuickPick({
        title,
        step: step,
        totalSteps: totalSteps,
        items: answers,
        shouldResume: shouldResume
    });

    var answer = getKeyFromValue(AnswerLabel, pick.label);
    //generator.automaticVersion = answer === Answer.Yes;
}

export async function addLaunchIconBadge(generator: YamlGenerator, step: number, totalSteps: number, input: MultiStepInput, context: ExtensionContext) {

    const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

    const title = 'Add launch icon badge?';

    const pick = await input.showQuickPick({
        title,
        step: step,
        totalSteps: totalSteps,
        items: answers,
        shouldResume: shouldResume
    });

    var answer = getKeyFromValue(AnswerLabel, pick.label);
    generator.launchIconBadge = answer === Answer.Yes;
}

export async function publishArtifacts(generator: YamlGenerator, step: number, totalSteps: number, input: MultiStepInput, context: ExtensionContext) {

    const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

    const title = 'Do you want to publish tha artifacts?';

    const pick = await input.showQuickPick({
        title,
        items: answers,
        shouldResume: shouldResume
    });

    generator.distribute = getKeyFromValue(AnswerLabel, pick.label) === Answer.Yes;
}

export async function enableAppCenterDistribution(generator: YamlGenerator, step: number, totalSteps: number, input: MultiStepInput, context: ExtensionContext) {

    const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

    const title = 'Do you want to distribute it using App Center?';

    const pick = await input.showQuickPick({
        title,
        step: step,
        totalSteps: totalSteps,
        items: answers,
        shouldResume: shouldResume
    });

    generator.distribute = getKeyFromValue(AnswerLabel, pick.label) === Answer.Yes;

    generator.generate(context);
}

function getKeyFromValue<T>(map: Map<T, string>, search: string) {
    for (let [key, value] of map.entries()) {
        if (value === search) {
            return key;
        }
    }
}

function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {

    });
}


enum Answer {
    No,
    Yes
}

export const AnswerLabel = new Map<Answer, string>([
    [Answer.Yes, 'Yes'],
    [Answer.No, 'No'],
]);
