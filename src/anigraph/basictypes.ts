export type Constructor<T> = new(...args: any[]) => T;

export type GenericDict={[name:string]:any};

export interface ClassInterface<InstanceClass> extends Function {new (...args:any[]): InstanceClass};


export enum AniGraphEnums{
    BackgroundElementName = 'BackgroundElement',
    OccludesInteractions='OccludesInteractions'
}
