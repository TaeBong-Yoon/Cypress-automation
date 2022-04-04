import { ownerEmail, ownerPassword } from '../../../../fixtures/test-data';
import * as faker from 'faker';
import { ICreateAccountMutationResData } from '../../../../../apps/pms/src/api/accounts/mutations/useCreateAccountMutation';

/**
 * Test scenario : Go to staff page and do actions
 *
 * Test data :
 */
const valueForGender = ['1', '2', '3'];
const valueForRole = ['15', '16'];
const valueForMobile = faker.datatype
  .number({
    min: 0,
    max: 9999999,
  })
  .toString()
  .padStart(7, '0');

const MOCK_STAFF: ICreateAccountMutationResData = {
  id: 99999999,
  name: faker.name.lastName() + ' ' + faker.name.firstName(),
  email: faker.internet.exampleEmail(),
  mobile: '090' + valueForMobile,
  sex: faker.random.arrayElement(valueForGender),
  profile_id: parseInt(faker.random.arrayElement(valueForRole)),
};

describe('TC_STSE : Go to staff page and do actions', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText('Settings').click();
    cy.get('a[href*="/settings/staff"]').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/staff`);
  });

  context('TC_STSE01 : create new staff', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/accounts/create/', {
        statusCode: 201,
        body: MOCK_STAFF,
      });
    });
    it('TC_STSE01-01 : click register btn', () => {
      cy.findByText('Register').click();
      cy.dataCy('staff-modal').should('be.visible');
    });
    it('TC_STSE01-02 : input fields', () => {
      cy.findByLabelText('Name*').type(MOCK_STAFF.name);
      cy.findByLabelText('Email*').type(MOCK_STAFF.email);
      cy.findByLabelText('Mobile*').type(MOCK_STAFF.mobile);
      cy.findByLabelText('Gender*').select(MOCK_STAFF.sex);
      cy.findByLabelText('Role*').select(String(MOCK_STAFF.profile_id));
    });
    it('TC_STSE01-03 : click save btn', () => {
      cy.findByText('Save').click();
      cy.dataCy('staff-modal').should('not.exist');
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });
  context('TC_STSE02 : edit staff', () => {
    it('TC_STSE02-01 : click test staff', () => {
      cy.contains('Cypress@test.com')
        .parent('tr')
        .within(() => {
          cy.get('td').get('button').click();
        });
      cy.dataCy('staff-modal').should('be.visible');
    });
    it('TC_STSE02-02 : edit information fiedls and save', () => {
      cy.findByLabelText('Name*').clear();
      cy.findByLabelText('Mobile*').clear();

      cy.findByLabelText('Name*').type('Cypress ' + MOCK_STAFF.name);
      cy.findByLabelText('Mobile*').type(MOCK_STAFF.mobile);
      cy.findByLabelText('Gender*').select(MOCK_STAFF.sex);
      cy.findByLabelText('Gender*').select(String(MOCK_STAFF.sex));
      cy.findByLabelText('Mobile*').type('{enter}');
      cy.findAllByText('Your information has been saved.').should('exist');
      cy.wait(2000);
    });
    it('TC_STSE02-03 : edit password fields and save', () => {
      cy.findByLabelText('Password').type('cypress');
      cy.findByLabelText('Confirm password').type('cypress');
      cy.findByLabelText('Password').type('{enter}');
      cy.findAllByText('Your information has been saved.').should('exist');
      cy.findByLabelText('Password').type('{esc}');
      cy.dataCy('staff-modal').should('not.exist');
    });
    it('TC_STSE02-04 : check password change', () => {
      cy.requestUserLogin('Cypress@test.com', 'cypress');
    });
  });
  context('TC_STSE03 : use pagenation', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/accounts/create/', {
        statusCode: 201,
        body: MOCK_STAFF,
      });
    });
    it('TC_STSE03-01 : sign in as owner', () => {
      cy.requestUserLogin(ownerEmail, ownerPassword);
      cy.findByText('Settings').click();
      cy.get('a[href*="/settings/staff"]').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/staff`);
    });
    it('TC_STSE03-02 : input fields', () => {
      for (let i = 0; i < 30; i++) {
        cy.findByText('Register').click();
        cy.dataCy('staff-modal').should('be.visible');
        cy.findByLabelText('Name*').type(MOCK_STAFF.name);
        cy.findByLabelText('Email*').type(MOCK_STAFF.email);
        cy.findByLabelText('Mobile*').type(MOCK_STAFF.mobile);
        cy.findByLabelText('Gender*').select(MOCK_STAFF.sex);
        cy.findByLabelText('Role*').select(String(MOCK_STAFF.profile_id));
        cy.findByText('Save').click();
        cy.dataCy('staff-modal').should('not.exist');
        cy.findAllByText('Your information has been saved.').should('exist');
      }
    });
    it('TC_STSE03-03 : pagenation by using number', () => {
      cy.wait(10000);
      cy.findByText('Previous Page').next().next().click();
      cy.get('p').contains('Showing 11 to 20');
    });
    it('TC_STSE03-04 : pagenation by using next btn', () => {
      cy.findByText('Next Page').click();
      cy.get('p').contains('Showing 21 to 30');
    });
  });
});
