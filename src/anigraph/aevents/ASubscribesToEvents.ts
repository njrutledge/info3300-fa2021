import {ACallbackSwitch} from "./ACallbackSwitch";

export interface ASubscribesToEventsInterface{
    setSubscription(name:string, callbackSwitch:ACallbackSwitch):void;
    removeSubsciption(name:string):void;
    clearSubscriptions():void;
    deactivateSubscription(name:string):void;
    activateSubscription(name:string):void;
}

export function ASubscribesToEvents<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor{
        protected _subscriptions:{[name:string]:ACallbackSwitch}={};
        public setSubscription(name:string, callbackSwitch:ACallbackSwitch){
            if(name in this._subscriptions){
                if(this._subscriptions[name].active){
                    this._subscriptions[name].deactivate();
                }
            }
            this._subscriptions[name]=callbackSwitch;
        }

        public removeSubsciption(name:string){
            if(name in this._subscriptions){
                if(this._subscriptions[name].active){
                    this._subscriptions[name].deactivate();
                }
                delete this._subscriptions[name];
            }else{
                throw new Error(`tried to remove subscription "${name}", but no such subscription found in ${this}`)
            }
        }

        clearSubscriptions(){
            for(let name in this._subscriptions){
                this.removeSubsciption(name);
            }
        }

        deactivateSubscription(name:string){
            if(name in this._subscriptions) {
                if (this._subscriptions[name].active) {
                    this._subscriptions[name].deactivate();
                }
            }else{
                throw new Error(`tried to deactivate subscription "${name}", but no such subscription found in ${this}`)
            }
        }

        activateSubscription(name:string){
            if(name in this._subscriptions) {
                if (this._subscriptions[name].active) {
                    this._subscriptions[name].activate();
                }
            }else{
                throw new Error(`tried to activate subscription "${name}", but no such subscription found in ${this}`)
            }
        }


    }
}
