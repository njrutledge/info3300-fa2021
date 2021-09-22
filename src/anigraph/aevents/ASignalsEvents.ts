import {AEventCallbackDict} from "./AEventCallbackDict";

// type Constructor = new (...args: any[]) => {};
type Constructor<T> = new(...args: any[]) => T;

// export default function ASignalsEvents<T extends { new (...args: any[]): {} }>(constructor: T) {
export function ASignalsEvents<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        protected _eventCallbackDicts:{[name:string]:AEventCallbackDict}={};

        _getEventCallbackDict(eventName:string) {
            return this._eventCallbackDicts[eventName];
        }

        addEventListener(eventName:string, callback:(...args:any[])=>void, handle?:string) {
            if (this._eventCallbackDicts[eventName] === undefined) {
                this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
            }
            return this._eventCallbackDicts[eventName].addCallback(callback, handle);
        }

        removeEventListener(eventName:string, handle:string) {
            if (this._eventCallbackDicts[eventName] === undefined) {
                return;
            }
            return this._eventCallbackDicts[eventName].removeCallback(handle);
        }

        signalEvent(eventName:string, ...args:any[]) {
            if (this._eventCallbackDicts[eventName] === undefined) {
                this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
            }
            this._getEventCallbackDict(eventName).signalEvent(args);
        }
    }
}
