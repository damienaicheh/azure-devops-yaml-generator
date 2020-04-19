import { YamlGenerator } from "./yaml-generator";
import *  as steps from "./steps";

export class XamarinFormsGenerator extends YamlGenerator {

    constructor() {
        super();
        this.template = 'stages.yml.tmpl';
        this.vmImage = 'macOS-latest';
        this.steps = [
            input => steps.chooseFileName(this, 0, input),
            input => steps.enableUnitTests(this, 1, input),
            input => steps.manageVersionAutomatically(this, 2, input),
            input => steps.updateIdenfier(this, 3, input),
            input => steps.addLaunchIconBadge(this, 4, input),
            input => steps.publishArtifacts(this, 5, input),
            input => steps.enableAppCenterDistribution(this, 6, input),
        ];
    }
}