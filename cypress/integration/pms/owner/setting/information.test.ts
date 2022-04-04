import { ownerEmail, ownerPassword } from '../../../../fixtures/test-data';
import * as faker from 'faker';

/**
 * Test scenario : Go to accommodation information page and edit fields
 *
 * Test data :
 */
const valuesForType = ['1', '2', '3', '4', '5', '6', '7', '8'];
const valuesForCurrency = ['1', '2', '3'];
const exampleMobile = faker.datatype
  .number({
    min: 0,
    max: 9999999,
  })
  .toString()
  .padStart(7, '0');
const randomValueForType = faker.random.arrayElement(valuesForType);
const randomValueForCurrency = faker.random.arrayElement(valuesForCurrency);
const randomName = faker.name.lastName() + "'s house";

const randomEmail = faker.internet.exampleEmail();
const randomMobile = '090' + exampleMobile;
const randomWebsite = faker.internet.url();

describe('TC_SEAC : Go to accommodation information page and edit fields', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText('Settings').click();
    cy.get('a[href*="/settings/information"]').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/information`);
  });

  context('TC_SEAC01 : edit fields', () => {
    it('TC_SEAC01-01 : clear all fields', () => {
      cy.wait(2000);
      cy.findByLabelText('Accommodation Name*', { timeout: 20000 }).clear();
      cy.findByLabelText('Email*', { timeout: 20000 }).clear();
      cy.findByLabelText('Accommodation Telephone*', { timeout: 20000 }).clear();
      cy.findByLabelText('Website', { timeout: 20000 }).clear();
    });
    it('TC_SEAC01-02 : input fields', () => {
      cy.findByLabelText('Accommodation Type*').select(randomValueForType);
      cy.findByLabelText('Accommodation Name*').type(randomName);
      cy.findByLabelText('Email*').type(randomEmail);
      cy.findByLabelText('Accommodation Telephone*').type(randomMobile);
      cy.findByLabelText('Website').type(randomWebsite);
      cy.findByLabelText('Select Display Currency').select(randomValueForCurrency);
    });
    it('TC_SEAC01-03 : click save btn', () => {
      cy.findByText('Save').click();
      cy.findAllByText('Saved', { timeout: 20000 }).should('exist');
    });
  });
});
