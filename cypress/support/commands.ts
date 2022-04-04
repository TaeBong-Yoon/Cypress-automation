// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      requestAdminLogin(email: string, password: string): void;
      requestUserLogin(email: string, password: string): void;
      dataCy(payload: string): Cypress.Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('requestAdminLogin', (email, password) => {
  cy.visit('/');
  cy.findByPlaceholderText('Email').type(email);
  cy.findByPlaceholderText('Password').type(password);
  cy.findByText('Sign in').click();
  cy.url().should('equal', `${Cypress.config('baseUrl')}/applicants`);
});

Cypress.Commands.add('requestUserLogin', (email, password) => {
  cy.visit('/');
  cy.findByPlaceholderText('Email').type(email);
  cy.findByPlaceholderText('Password').type(password);
  cy.findByText('Sign in').click();
  cy.url().should('equal', `${Cypress.config('baseUrl')}/home`);
});

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`, { timeout: 20000 });
});
