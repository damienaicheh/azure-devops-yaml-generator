import { YamlGenerator } from "./yamlGenerator";

export class IosXamarinGenerator extends YamlGenerator {

    defineVmImage(vmImage: string = 'macOS-latest'): Object {
        return super.defineVmImage(vmImage);
    }

    restoreDependencies(): void {
        throw new Error("Method not implemented.");
    }
    runUnitTests(): void {
        throw new Error("Method not implemented.");
    }
    build(): void {
        throw new Error("Method not implemented.");
    }
    publishArtifacts(): void {
        throw new Error("Method not implemented.");
    }
    distributeThroughAppCenter(): void {
        throw new Error("Method not implemented.");
    }

}