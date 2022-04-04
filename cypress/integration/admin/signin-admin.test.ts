import { adminEmail, adminPassword } from '../../fixtures/test-data';

/**
 * Test scenario : Sign in admin page
 */

describe('TC_SIGN : Sign in as admin', () => {
  before(() => {
    cy.visit('/');
  });

  it('TC_SIGN01 : sign in', () => {
    cy.requestAdminLogin(adminEmail, adminPassword);
  });
});
