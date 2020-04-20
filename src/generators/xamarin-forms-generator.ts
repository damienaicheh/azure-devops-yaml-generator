import { XamarinGenerator } from "./xamarin-generator";

export class XamarinFormsGenerator extends XamarinGenerator {

    constructor() {
        super();
        this.template = 'xamarin.forms.stages.yml.tmpl';
    }
}