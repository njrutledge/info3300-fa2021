/**
 * For defining interactions with graphics.
 * If you want to subclass to cover a different class of interactions (e.g., not using three.interaction) you just need to change the addEventListener call to use
 */

import {Vec2} from "../amath";
import {AControllerInterface} from "../amvc/base/AController";
import {ACallbackSwitch} from "../aevents";
import {InteractionEvent} from "../thirdparty/threeinteraction";
import * as THREE from "three";
import {Object3D} from "three";
import {AModelInterface} from "../amvc/base/AModel";
import {ASceneNodeController} from "../amvc";
import {AMockInteractiveElement} from "./AMockInteractiveElement";
import {AniGraphEnums} from "../basictypes";


interface ReceivesOnOffInteractionsInterface{
    on(eventType:string, callback:(...args:any[])=>any):any;
    off(eventType:string, callback:(...args:any[])=>any):any;
    once(eventType:string, callback:(...args:any[])=>any):any;
}

interface ReceivesEventListenerInteractionsInterface{
    addEventListener(eventType:string, callback:(event:any)=>any, ...args:any[]):any;
    removeEventListener(eventType:string, callback:(event:any)=>any, ...args:any[]):any;
}

export type AReceivesInteractionsInterface = ReceivesEventListenerInteractionsInterface|ReceivesOnOffInteractionsInterface;

export interface AInteractionEventListener{
    eventType: string;
    addListener: () => void;
    removeListener: () => void;
}

export interface DOMEventInterface extends Event{
    clientX?:number;
    clientY?:number;
}


export abstract class AInteractionEvent{
    public interaction!:AInteraction;
    abstract _event:DOMEventInterface|InteractionEvent;
    abstract get DOMEvent():Event;
    abstract preventDefault():void;
    abstract elementIsTarget(event:AReceivesInteractionsInterface):boolean;
    abstract get eventIsOnTarget():boolean;
    abstract get positionInContext():Vec2;
    abstract get cursorPosition():Vec2;
    abstract get targetModel():AModelInterface;
    abstract get shiftKey():boolean;
    abstract get altKey():boolean;
    abstract get ctrlKey():boolean;
}

export class AMockInteractionEvent extends AInteractionEvent{
    public _cursorPosition:Vec2;
    _shiftKey:boolean;
    _altKey:boolean;
    _ctrlKey:boolean;
    static GetMockElement(){
        return {
            addEventListener:(eventType:string, callback:(event:any)=>any, ...args:any[])=>{return;},
            removeEventListener:(eventType:string, callback:(event:any)=>any, ...args:any[])=>{}
        }
    }
    public _event!:DOMEventInterface;
    constructor(interaction:AInteraction, cursorPosition:Vec2, shiftKey:boolean=false, altKey:boolean=false, ctrlKey:boolean=false, event?:DOMEventInterface){
        super();
        this._event = (event as DOMEventInterface);
        if(!this._event){
            // @ts-ignore
            this._event = this;
        }
        this.interaction=interaction;
        this._cursorPosition = cursorPosition;
        this._shiftKey = shiftKey;
        this._altKey = altKey;
        this._ctrlKey=ctrlKey;
    }
    get DOMEvent(){return this._event;}
    preventDefault(){}
    elementIsTarget(event:AReceivesInteractionsInterface){return true;};
    get eventIsOnTarget(){return true;}
    get positionInContext() {return this._cursorPosition;};
    get cursorPosition(){return this._cursorPosition;};
    get targetModel(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.model;
    }
    get shiftKey(){return this._shiftKey};
    get altKey(){return this._altKey;};
    get ctrlKey(){return this._ctrlKey;}
}


export class ADOMInteractionEvent extends AInteractionEvent{
    public _event:DOMEventInterface;
    constructor(event:DOMEventInterface, interaction:AInteraction){
        super();
        this._event = event;
        this.interaction=interaction;
    }
    get DOMEvent() {
        return this._event;
    }
    get shiftKey(){
        return (this._event as PointerEvent).shiftKey;
    }
    get altKey(){
        return (this._event as PointerEvent).altKey;
    }
    get ctrlKey(){
        return (this._event as PointerEvent).ctrlKey;
    }

    preventDefault(){
        this._event.preventDefault();
    }
    elementIsTarget(element:AReceivesInteractionsInterface){
        return this._event.target===element;
    }
    get positionInContext(){
        const contextElement = this.interaction.owner.getContextDOMElement();
        const svgrect = contextElement.getBoundingClientRect();
        // @ts-ignore
        return new Vec2(this._event.clientX-svgrect.left, this._event.clientY-svgrect.top);
    }
    get cursorPosition(){
        return this.positionInContext;
    }
    get targetModel(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.model;
    }
    get eventIsOnTarget(){
        return this._event.target===this._event.currentTarget;
    }
}

export class AThreeJSInteractionEvent extends AInteractionEvent{
    public _event:InteractionEvent;
    constructor(event:InteractionEvent, interaction:AInteraction){
        super();
        this._event = event;
        this.interaction=interaction;
    }
    get DOMEvent() {
        return this._event.data.originalEvent;
    }
    get shiftKey():boolean{
        return this._event.data.originalEvent.shiftKey;
    }
    get altKey(){
        return this._event.data.originalEvent.altKey;
    }
    get ctrlKey(){
        return this._event.data.originalEvent.ctrlKey;
    }
    get clientXY() {
        return new Vec2(this.DOMEvent.clientX, this.DOMEvent.clientY);
    }
    get normalizedXY(){
        return new Vec2(this._event.data.global.x, this._event.data.global.y);
    }
    get intersections(){
        return this._event.intersects;
    }
    preventDefault(){
        // this.DOMEvent.preventDefault();
    }
    elementIsTarget(element:AReceivesInteractionsInterface){
        return this._event.target===element;//===this._event.currentTarget;
    }
    get eventIsOnTarget(){
        return this._event.target===this._event.currentTarget;
    }
    get positionInContext(){
        const contextElement = this.interaction.owner.getContextDOMElement();
        const svgrect = contextElement.getBoundingClientRect();
        // @ts-ignore
        return new Vec2(this.DOMEvent.clientX-svgrect.left, this.DOMEvent.clientY-svgrect.top);
    }
    get cursorPosition(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.normalizedToViewCoordinates(this.normalizedXY);
        // return this.normalizedXY;
    }
    get targetModel(){
        return (this.interaction.owner as ASceneNodeController<any>).sceneController.nodeControllers[this._event.target.userData['modelID']].model
    }

}



export class AInteraction extends ACallbackSwitch {

    protected _eventListeners:AInteractionEventListener[];

    /**
     * `owner` is whatever holds the interactions.
     * @type {AControllerInterface}
     */
    public owner!: AControllerInterface<any>;
    /**
     * `element` is typically the thing being interacted with. For example, if you are adding a click interaction to a THREE.Mesh, then the element would be the THREE.Mesh.
     * @type {any}
     */
    public element: AReceivesInteractionsInterface;

    public onlyMouseDownOnTarget:boolean=true;
    _shouldIgnoreEvent(event:Event|InteractionEvent){
        // if(event instanceof InteractionEvent){
        // if(this.element instanceof THREE.Object3D){
        //     const ievent = event as InteractionEvent;
        //     if(this.element===ievent.target){
        //         return false;
        //     }
        // }
        // return true;

        if(this.element instanceof THREE.Object3D){
            const ievent = event as InteractionEvent;
            if(!(this.onlyMouseDownOnTarget && (ievent.type ==='mousedown' || ievent.type==='click' || ievent.type==='touchstart'))){
                return false;
            }else{
                if(this.onlyMouseDownOnTarget){
                    if(this.element===ievent.target){
                    // if(this.element===ievent.currentTarget){
                        if(ievent.intersects[0] && ievent.intersects[0].object.userData[AniGraphEnums.OccludesInteractions] && (!this.element.userData[AniGraphEnums.OccludesInteractions])){
                            return true;
                        }
                        return false;
                    }else{
                        if(ievent.currentTarget===ievent.intersects[0].object && ievent.intersects[0].distance<ievent.intersects[1].distance){
                            return false;
                        }
                        return true;
                    }
                }
                // let iobj = ievent.intersects[0].object;
                const self = this;
                for(let intersect of ievent.intersects) {
                    let iobj = intersect.object;

                    // distance is strictly greater than the closest
                    if(intersect.distance>ievent.intersects[0].distance){
                        return true;
                    }

                    //check to see if we are an ancestor of the intersection
                    if (this.element.type === "Object3D" || this.element.type === "Group") {
                        let elementIsAncestor = false;
                        iobj.traverseAncestors((ancestor: Object3D) => {
                                if (ancestor === self.element) {
                                    elementIsAncestor = true;
                                }
                            }
                        )
                        if(elementIsAncestor){
                            return false;
                        }
                    } else {
                        if(iobj===this.element){
                            return false;
                        }
                        // return !((event as InteractionEvent).intersects[0].object === this.element);
                    }
                }
                // return this.element == event.intersects[0].;
            }
        }else if(this.element instanceof AMockInteractiveElement) {
            return false;
        }else{
            console.warn("_shouldIgnoreEvent not implemented for DOM events");
            return false;
        }

    }

    // static Create(element:any, clickCallback?:CallbackType, handle?:string, ...args:any[]);

    getWindowElement(){
        return window;
    }

    getBackgroundElement(){
        // return this.owner.sceneController.view._backgroundElement;
        if(!('sceneController' in this.owner)){throw new Error("Tried to get background element on controller class without a sceneController property...");}
        return (this.owner as ASceneNodeController<any>).sceneController.view.threejs;
    }

    /**
     * Event listeners is a list of event listeners associated with the interaction. Often this may just be a single event listener, but in the case of, for example, dragging, it may contain multiple event listeners.
     * And event listener is one call of [...].on(...).
     * @type {any[]}
     * @private
     */
    /** Get eventListeners */
    get eventListeners(){return this._eventListeners;};

    /**
     *
     * @param element
     * @param eventListeners
     * @param onlyMouseDownOnTarget - should this trigger only when the element is the target of the interaction. Defaults to true.
     * @param handle
     */
    constructor(element:AReceivesInteractionsInterface, eventListeners?:AInteractionEventListener[], handle?:string){
        super(handle);
        this.element = element;
        this._eventListeners = eventListeners?eventListeners:[];
    }

    bindMethods(){

    }

    addEventListener(eventType:string, callback:(...args:any[])=>any){
        const interaction = this;
        const modcallbackthree = function(event:InteractionEvent){
            if(!interaction._shouldIgnoreEvent(event)) {
                callback(new AThreeJSInteractionEvent(event, interaction));
            }
        }

        const modcallbackmock = function(event:InteractionEvent){
            callback(event);
        }

        const modcallbackdom = function(event:Event){
            if(!interaction._shouldIgnoreEvent(event)) {
                callback(new ADOMInteractionEvent(event, interaction));
            }
        }

        let modcallback=modcallbackthree;
        if(interaction.element instanceof AMockInteractiveElement){
            modcallback=modcallbackmock;
        }
        const isdominteraction = !(interaction.element instanceof THREE.Object3D || interaction.element instanceof AMockInteractiveElement);
        if(isdominteraction){
            // @ts-ignore
            modcallback=modcallbackdom;
        }
        // const modcallback = (isdominteraction)?modcallbackdom:modcallbackthree;

        function addListener(this:AInteractionEventListener){
            if(interaction.element instanceof THREE.Object3D || interaction.element instanceof AMockInteractiveElement){
                // @ts-ignore
                interaction.element.on(eventType, modcallback);
                switch (eventType) {
                    case 'mousedown':{
                        // @ts-ignore
                        interaction.element.on('touchstart', modcallback);
                        break;
                    }
                    case 'mousemove':{
                        // @ts-ignore
                        interaction.element.on('touchmove', modcallback);
                        break;
                    }
                    case 'mouseup':{
                        // @ts-ignore
                        interaction.element.on('touchend', modcallback);
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }else{
                // @ts-ignore
                interaction.element.addEventListener(eventType, modcallback);
            }
        }

        function removeListener(this:AInteractionEventListener){
            // interaction.element.off(eventType, modcallback);
            if(interaction.element instanceof THREE.Object3D || interaction.element instanceof AMockInteractiveElement){
                // @ts-ignore
                interaction.element.off(eventType, modcallback);
                switch (eventType) {
                    case 'mousedown':{
                        // @ts-ignore
                        interaction.element.off('touchstart', modcallback);
                        break;
                    }
                    case 'mousemove':{
                        // @ts-ignore
                        interaction.element.off('touchmove', modcallback);
                        break;
                    }
                    case 'mouseup':{
                        // @ts-ignore
                        interaction.element.off('touchend', modcallback);
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }else{
                // @ts-ignore
                interaction.element.removeEventListener(eventType, modcallback);
            }
        }
        // const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener, active:false, once:false, counter:0};
        const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener};
        eventListener.addListener = eventListener.addListener.bind(eventListener);
        eventListener.removeListener = eventListener.removeListener.bind(eventListener)
        this.eventListeners.push(eventListener);
        return eventListener;
    }

    addWindowEventListener(eventType: string, callback: (...args: any[]) => any, options?: boolean | AddEventListenerOptions){
        const interaction = this;
        // @ts-ignore
        const once:boolean = ((options!==undefined) && ((typeof options)!=="boolean"))?options.once:false;

        let modcallback = function(event:InteractionEvent){
            if(!interaction._shouldIgnoreEvent(event)) {
                callback(new AThreeJSInteractionEvent(event, interaction));
            }
        }


        function addListener(){
            // @ts-ignore
            this.active = true;
            if(once){
                // @ts-ignore
                interaction.getBackgroundElement().once(eventType, modcallback);
                switch (eventType) {
                    case 'mousedown':{
                        // @ts-ignore
                        interaction.getBackgroundElement().once('touchstart', modcallback);
                        break;
                    }
                    case 'mousemove':{
                        // @ts-ignore
                        interaction.getBackgroundElement().once('touchmove', modcallback);
                        break;
                    }
                    case 'mouseup':{
                        // @ts-ignore
                        interaction.getBackgroundElement().once('touchend', modcallback);
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }else{
                // @ts-ignore
                interaction.getBackgroundElement().on(eventType, modcallback);
                switch (eventType) {
                    case 'mousedown':{
                        // @ts-ignore
                        interaction.getBackgroundElement().on('touchstart', modcallback);
                        break;
                    }
                    case 'mousemove':{
                        // @ts-ignore
                        interaction.getBackgroundElement().on('touchmove', modcallback);
                        break;
                    }
                    case 'mouseup':{
                        // @ts-ignore
                        interaction.getBackgroundElement().on('touchend', modcallback);
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }
        }
        function removeListener(){
            // @ts-ignore
            interaction.getBackgroundElement().off(eventType, modcallback);
            switch (eventType) {
                case 'mousedown':{
                    // @ts-ignore
                    interaction.element.off('touchstart', modcallback);
                    break;
                }
                case 'mousemove':{
                    // @ts-ignore
                    interaction.element.off('touchmove', modcallback);
                    break;
                }
                case 'mouseup':{
                    // @ts-ignore
                    interaction.element.off('touchend', modcallback);
                    break;
                }
                default:{
                    break;
                }
            }

        }
        const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener};
        eventListener.addListener = eventListener.addListener.bind(eventListener);
        eventListener.removeListener = eventListener.removeListener.bind(eventListener)

        this.eventListeners.push(eventListener);
        return eventListener;
    };

    activate() {
        // if(!this.isActive) {
        this.deactivate();
        for (let eventListener of this.eventListeners) {
            eventListener.addListener();
        }
        this.active = true;
        // }
    }

    _deactivateEventListeners() {
        for (let eventListener of this.eventListeners) {
            eventListener.removeListener();
        }
    }

    clearEventListeners() {
        this._deactivateEventListeners();
        this._eventListeners = [];
    }

    deactivate() {
        // if(this.isActive){
        this._deactivateEventListeners();
        this.active = false;
        // }
    }

    release() {
        this.deactivate();
        this._eventListeners = [];
        // super.release();
    }
}
