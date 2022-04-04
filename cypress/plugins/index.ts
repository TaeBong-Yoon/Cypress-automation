/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import codeCoverageTask from '@cypress/code-coverage/task';
import { startDevServer } from '@cypress/vite-dev-server';
import istanbul from 'vite-plugin-istanbul';

module.exports = (on, config) => {
  on('dev-server:start', async (options) => startDevServer({ options, viteConfig: { plugins: [istanbul({})] } }));
  codeCoverageTask(on, config);

  return config;
};
