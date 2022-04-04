import { ownerEmail, ownerPassword } from '../../../../../fixtures/test-data';
import * as faker from 'faker';

/**
 * Test scenario : Go to rate structure page and do actions
 *
 * Test data :
 */

const valueForRateName = 'Test By Jonny';
const ValueForRateDescirption = 'This rate structure is made by Cypress - Jonny Yoon';

const findActionBtn = (number: number) => {
  return `ul > li:nth-child(2) > div:nth-child(1) > div > div > button:nth-child(${number})`;
};

describe('TC_RASE : Go to rate structure page and do actions', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText('Settings').click();
    cy.get('a[href*="/settings/rates"]').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/rates`);
  });

  context('TC_RASE01 : add new rate structure', () => {
    it('TC_RASE01-01 : click new rate structure btn', () => {
      cy.findByText('New Rate Structure').click();
      cy.dataCy('rate-plan-modal').should('be.visible');
    });
    it('TC_RASE01-02 : input fields', () => {
      cy.findByPlaceholderText('Input Rate Name').type(valueForRateName);
      cy.findByPlaceholderText('Input Description').type(ValueForRateDescirption);
      cy.findByText('Save').click();
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });
  context('TC_RASE02 : edit rate structure', () => {
    it('TC_RASE02-01 : click rate structure btn', () => {
      cy.get(findActionBtn(2)).click();
      cy.dataCy('rate-plan-modal').should('be.visible');
    });
    it('TC_RASE02-02 : edit fields', () => {
      cy.findByLabelText('Rate Name*').clear();
      cy.get('textarea').clear();

      cy.findByLabelText('Rate Name*').type('Edit mode - ' + valueForRateName);
      cy.get('textarea').type('Edit mode - ' + ValueForRateDescirption);
    });
    it('TC_RASE02-03 : click save btn', () => {
      cy.findByText('Save').click();
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });
  context('TC_RASE03 : copy rate structure and delete', () => {
    it('TC_RASE03-01 : copy rate structure that cypress made', () => {
      cy.get(findActionBtn(1)).click();
      //   cy.get('a[href*="/settings/rates"]').click();
      cy.get('ul > li:nth-child(2) > div:nth-child(1) > div > h2').should('contain', 'copy');
    });
    it('TC_RASE03-02 : delete copied rate structure', () => {
      cy.get(findActionBtn(3)).click();
      cy.get('ul > li:nth-child(2) > div:nth-child(1) > div > h2', { timeout: 20000 }).should('not.contain', 'copy');
    });
  });
  context('TC_RASE04 : delete rate structure ', () => {
    it('TC_RASE06-01 : click delete btn', () => {
      cy.get(findActionBtn(3), { timeout: 20000 }).click();
      cy.findByText('Edit mode - ' + valueForRateName).should('not.exist');
    });
  });
});
