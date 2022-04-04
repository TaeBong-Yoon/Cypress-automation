import { ownerEmail, ownerPassword } from '../../../../fixtures/test-data';
import * as faker from 'faker';

/**
 * Test scenario : Go to accommodation policy page and do actions
 *
 * Test data :
 */
const valueHourlyRoundUp = ['1', '2', '3', '4', '5'];
const randomHourlyRoundUp = faker.random.arrayElement(valueHourlyRoundUp);
const randomPercent = faker.datatype
  .number({
    min: 5,
    max: 10,
  })
  .toString()
  .padEnd(2, '0');
const randomHour = faker.datatype
  .number({
    min: 0,
    max: 23,
  })
  .toString()
  .padStart(2, '0');
const randomMinute = faker.datatype
  .number({
    min: 0,
    max: 59,
  })
  .toString()
  .padStart(2, '0');
const randomPenaltyHour = faker.datatype
  .number({
    min: 10,
    max: 23,
  })
  .toString();
const penaltyInput = (type: string) => {
  cy.dataCy(`${type}.check_in.num_of_hour`).then((inputs) => {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      let num = (parseInt(randomPenaltyHour) + i) / 10;
      cy.wrap(input).clear();
      cy.wrap(input).type(num.toString());
    }
  });
  cy.dataCy(`${type}.check_out.num_of_hour`).then((inputs) => {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      let num = (parseInt(randomPenaltyHour) + i) / 10;
      cy.wrap(input).clear();
      cy.wrap(input).type(num.toString());
    }
  });
  cy.dataCy(`${type}.check_in.percentage`).then((inputs) => {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      let num = (parseInt(randomPercent) + i) / 10;
      cy.wrap(input).clear();
      cy.wrap(input).type(num.toString());
    }
  });
  cy.dataCy(`${type}.check_out.percentage`).then((inputs) => {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      let num = (parseInt(randomPercent) + i) / 10;
      cy.wrap(input).clear();
      cy.wrap(input).type(num.toString());
    }
  });
};
const deletePenalty = (type: string) => {
  cy.dataCy(`${type}.check_in.remove-button`).then((btns) => {
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      cy.wrap(btn).click();
    }
  });
  cy.dataCy(`${type}.check_out.remove-button`).then((btns) => {
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      cy.wrap(btn).click();
    }
  });
};
const checkPenaltyAfterDelete = (type: string) => {
  cy.dataCy(`${type}.check_in.num_of_hour`).should('not.exist');
  cy.dataCy(`${type}.check_out.num_of_hour`).should('not.exist');
};
describe('TC_SEPO : Go to accommodation policy page and do actions', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText('Settings').click();
    cy.get('a[href*="/settings/policy"]').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/policy`);
  });

  context('TC_SEPO01 : do actions in duplicate function - default time setting, hourly round up', () => {
    it('TC_SEPO01-01 : do action in default time setting', () => {
      cy.get('[aria-checked=false]').click();
    });
    it('TC_SEPO01-02 : do action in hourly round up', () => {
      cy.dataCy('minute-round-up-input').clear();
      cy.dataCy('minute-round-up-input').type(randomHourlyRoundUp);
    });
  });
  context('TC_SEPO02 : hourly setting', () => {
    it('TC_SEPO02-01 : setting horuly duration', () => {
      cy.findByText('Hourly Duration').should('be.visible');
      cy.findByLabelText('Minimum').clear();
      cy.findByLabelText('Maximum').clear();

      cy.findByLabelText('Minimum').type(randomHourlyRoundUp);
      cy.findByLabelText('Maximum').type((parseInt(randomHourlyRoundUp) + 1).toString());
    });
  });
  context('TC_SEPO03 : overnight setting', () => {
    it('TC_SEPO03-01 : setting overnight penalty', () => {
      cy.dataCy('tab-item-overnight').click();
      for (let i = 0; i < 2; i++) {
        cy.findAllByText('Add Policy').then((overnightPolicyBtns) => {
          const overnightPolicyBtn = overnightPolicyBtns[i];
          for (let j = 0; j < 2; j++) {
            cy.wrap(overnightPolicyBtn).click();
          }
        });
      }
      penaltyInput('overnight');
      deletePenalty('overnight');
      checkPenaltyAfterDelete('overnight');
      checkPenaltyAfterDelete('overnight');
    });
    it('TC_SEPO03-02 : setting overnight start, end time', () => {
      cy.findByLabelText('Overnight Start Time').clear();
      cy.findByLabelText('Overnight End Time').clear();

      cy.findByLabelText('Overnight Start Time').type(randomHour + randomMinute);
      cy.findByLabelText('Overnight End Time').type((parseInt(randomHour + randomMinute) + 100).toString() + `{enter}`);
    });
    it('TC_SEPO03-03 : Click save btn', () => {
      cy.findByText('Save', { timeout: 20000 }).should('be.visible').click();
      cy.findAllByText('Saved', { timeout: 20000 }).should('exist');
    });
  });
  context('TC_SEPO04 : daily setting', () => {
    it('TC_SEPO04-01 : setting daily penalty', () => {
      cy.dataCy('tab-item-daily').click();
      for (let i = 0; i < 4; i++) {
        cy.findAllByText('Add Policy').then((dailyPolicyBtns) => {
          const dailyPolicyBtn = dailyPolicyBtns[i];
          if (i >= 2) {
            for (let j = 0; j < 2; j++) {
              cy.wrap(dailyPolicyBtn).click();
            }
          }
        });
      }
      penaltyInput('daily');
      deletePenalty('daily');
      checkPenaltyAfterDelete('daily');
      checkPenaltyAfterDelete('daily');
    });
    it('TC_SEPO04-02 : setting daily start, end time', () => {
      cy.findByLabelText('Daily Start Time').clear();
      cy.findByLabelText('Daily End Time').clear();

      cy.findByLabelText('Daily Start Time').type(randomHour + randomMinute);
      cy.findByLabelText('Daily End Time').type((parseInt(randomHour + randomMinute) + 100).toString() + '{enter}');
    });
    it('TC_SEPO04-03 : Click save btn', () => {
      cy.findByText('Save', { timeout: 20000 }).should('be.visible').click();
      cy.findAllByText('Saved', { timeout: 20000 }).should('exist');
    });
  });
});
