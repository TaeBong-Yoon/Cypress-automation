import { ownerEmail, ownerPassword } from '../../../fixtures/test-data';
import '@testing-library/cypress';
/**
 * Test scenario : Sign in/out as owner
 */

describe('TC_SIGN : Sign in/out as owner', () => {
  before(() => {
    cy.visit('/');
  });

  it('TC_SIGN01 : sign in', () => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
  });

  it('TC_SIGN02 : sign out', () => {
    cy.findByText(ownerEmail).click();
    cy.findByText('Sign out').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/login`);
  });
});
