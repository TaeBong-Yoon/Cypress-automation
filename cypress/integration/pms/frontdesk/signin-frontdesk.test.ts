import { frontdeskEmail, frontdeskPassword } from '../../../fixtures/test-data';

/**
 * Test scenario : Sign in as frontdesk
 */

describe('TC_SIGN : Sign in/out as frontdesk', () => {
  before(() => {
    cy.visit('/');
  });

  it('TC_SIGN01 : sign in', () => {
    cy.requestUserLogin(frontdeskEmail, frontdeskPassword);
  });

  it('TC_SIGN02 : sign out', () => {
    cy.findByText(frontdeskEmail).click();
    cy.findByText('Sign out').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/login`);
  });
});
