/**
 * Anigraph's Model-View-Controller classes. <br>
 * *Models* represent data, *views* represent how that data is displayed, and *controllers* handle interactions and synchronization between models and views.
 *
 * Only the models are actually hierarchical. All controllers have links to their corresponding model, and to a scene controller that is the base of their respective hierarchy. Scene controllers then contain a map of model uid's to node controllers for each model in the corresponding scene hierarchy.
 *
 *
 * @module AMVC
 */

export * from "./AAppState";
export * from './base';
export * from './base/scene';
export * from './base/scenenode';
export * from './base/selection';
export * from './base/supplementals';
export * from './2d';
