import { ownerEmail, ownerPassword } from '../../../../../fixtures/test-data';
import * as faker from 'faker';

/**
 * Test scenario : Do actions in rate plan detail modal
 *
 * Test data :
 */

const valuesForRoomRate = faker.datatype
  .number({
    min: 1,
    max: 100,
  })
  .toString()
  .padEnd(6, '0');

const findSortBtnInMultipleRates = (div: number) => {
  return cy.get(`form > section> div:nth-child(${div}) > div > div > button`);
};
const findDeleteBtnInMultipleRates = (div: number) => {
  return cy.get(`form > section> div:nth-child(${div}) > div > ul > li:nth-child(1) > div:nth-child(2) > div > button`);
};
const findInputValueInMultipleRates = (div: number) => {
  return cy.get(
    `form > section > div:nth-child(${div}) > div > ul > li:nth-child(1) > div:nth-child(1) > label > div > div > div > input`,
  );
};

describe('TC_RAMOSE : Do actions in rate plan detail modal', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText('Settings').click();
    cy.get('a[href*="/settings/rates"]').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/rates`);
  });

  context('TC_RAMOSE01 : check rate plan named by Cypress test. If not, add new rate structure', () => {
    it('TC_RAMOSE01-01 : check rate plan named by Cypress test. If not, add new rate structure', () => {
      cy.wait(2000);
      cy.get('body').then(($body) => {
        if ($body.text().includes('Cypress test') === false) {
          cy.findByText('New Rate Structure').click();
          cy.dataCy('rate-plan-modal').should('be.visible');
          cy.findByPlaceholderText('Input Rate Name').type('Cypress test');
          cy.findByPlaceholderText('Input Description').type('Hello world!');
          cy.findByText('Save').click();
          cy.findAllByText('Your information has been saved.').should('exist');
        }
      });
    });
    context('TC_RAMOSE02 : edit rate structure plan', () => {
      it('TC_RAMOSE02-01 : click rate structure', () => {
        cy.findByText('Cypress test').click();
        cy.dataCy('rate-plan-detail-modal').should('be.visible');
      });
      it('TC_RAMOSE02-02 : click view details', () => {
        cy.findAllByText('View Details').first().click();
        cy.findByText('Price').scrollIntoView();
        cy.findByText('Price').should('be.visible');
      });
      it('TC_RAMOSE02-03 : input fields in price, extra person price', () => {
        for (let i = 0; i < 6; i++) {
          cy.get('input').then((inputs) => {
            const input = inputs[i];
            cy.wrap(input).clear();
            cy.wrap(input).type(valuesForRoomRate);
          });
        }
      });
      it('TC_RAMOSE02-04: add new price hourly, daily', () => {
        for (let k = 0; k < 2; k++) {
          for (let i = 0; i < 2; i++) {
            cy.findAllByText('Add new price').then((dailyPolicyBtns) => {
              const dailyPolicyBtn = dailyPolicyBtns[i];
              cy.wrap(dailyPolicyBtn).click();
            });
          }
        }
      });
      it('TC_RAMOSE02-05 : input fields in multiple rates', () => {
        for (let i = 6; i < 14; i++) {
          cy.get('input').then((inputs) => {
            const input = inputs[i];
            cy.wrap(input).clear();
            if (i === 6 || i === 10) {
              cy.wrap(input).type('4');
            } else if (i === 8 || i === 12) {
              cy.wrap(input).type('3');
            } else {
              cy.wrap(input).type(valuesForRoomRate);
            }
          });
        }
      });
      it('TC_RAMOSE02-06 : do sorting, delete actions and check value changed', () => {
        for (let i = 1; i < 3; i++) {
          findSortBtnInMultipleRates(i).click();
          findInputValueInMultipleRates(i).should('have.value', 30);
        }
        for (let i = 1; i < 3; i++) {
          findDeleteBtnInMultipleRates(i).click();
          findInputValueInMultipleRates(i).should('have.value', 40);
        }
        for (let i = 1; i < 3; i++) {
          findDeleteBtnInMultipleRates(i).click();
        }
      });
      it('TC_RAMOSE02-07 : click save btn and close modal', () => {
        cy.findByText('Save', { timeout: 20000 }).should('be.visible').click();
        cy.findAllByText('Your information has been saved.', { timeout: 20000 }).should('exist');
        cy.dataCy('close-modal-button').click();
        cy.dataCy('rate-plan-detail-modal').should('not.exist');
      });
    });
  });
});
