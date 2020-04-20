import { YamlGenerator } from "./yaml-generator";
import *  as steps from "./steps";

export class XamarinFormsGenerator extends YamlGenerator {

    constructor() {
        super();
        this.template = 'stages.yml.tmpl';
        this.vmImage = 'macOS-latest';
        this.steps = [
            input => steps.chooseFileName(this, input),
            input => steps.chooseProjectName(this, input),
            input => steps.enableUnitTests(this, input),
            input => steps.manageVersionAutomatically(this, input),
            input => steps.updateIdenfier(this, input),
            input => steps.addLaunchIconBadge(this, input),
            input => steps.publishArtifacts(this, input),
            input => steps.enableAppCenterDistribution(this, input),
        ];
    }
}