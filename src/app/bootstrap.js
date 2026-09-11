import { CreatorUtilsApp } from '../app.js';

/** Composition root duy nhất của frontend. */
export function bootstrapApplication(rootWindow = window) {
  const application = new CreatorUtilsApp();
  rootWindow.app = application;
  return application;
}
