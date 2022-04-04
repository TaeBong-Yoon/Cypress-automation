import { ownerEmail, ownerPassword } from '../../../../fixtures/test-data';
import * as faker from 'faker';
/**
 * Test scenario : account setting
 *
 * Test data :
 */
const valueGender = ['1', '2', '3'];
const valueMobile = faker.datatype
  .number({
    min: 0,
    max: 9999999,
  })
  .toString()
  .padStart(7, '0');
const randomName = faker.name.lastName() + ' ' + faker.name.firstName();
const randomGender = faker.random.arrayElement(valueGender);
const randomMobile = '090' + valueMobile;

describe('TC_ACCOUNT : account setting', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText(ownerEmail).click();
    cy.findByText('My Account').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/accounts/me`);
  });

  context('TC_ACCOUNT01 : edit information', () => {
    it('TC_ACCOUNT01-01 : edit basic info', () => {
      cy.findByLabelText('Gender*').select(randomGender);

      cy.findByLabelText('Name*').clear();
      cy.findByLabelText('Mobile*').clear();

      cy.findByLabelText('Name*').type(randomName);
      cy.findByLabelText('Mobile*').type(randomMobile + '{enter}');
    });
    it('TC_ACCOUNT01-02 : click save btn', () => {
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });

  context('TC_ACCOUNT02 : change password', () => {
    before(() => {
      cy.requestUserLogin('cypress@test.com', 'cypress');
      cy.findByText('Cypress@test.com').click();
      cy.findByText('My Account').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/accounts/me`);
    });
    it('TC_ACCOUNT02-01 : input all fields and save', () => {
      cy.findByLabelText('Current password*').type('cypress');
      cy.findByLabelText('New password*').type('cypress');
      cy.findByLabelText('Re-enter password*').type('cypress');
      cy.findByLabelText('Re-enter password*').type('{enter}');
      cy.findAllByText('Your information has been saved.').should('exist');
    });
    it('TC_ACCOUNT02-02 : check password change', () => {
      cy.requestUserLogin('cypress@test.com', 'cypress');
    });
  });
});
