import { adminEmail, adminPassword } from '../../fixtures/test-data';
import * as faker from 'faker';

/**
 * Test scenario : Create and do edit, register in applcants page
 *
 * Test data :
 */
const values = ['1', '2', '3', '4', '5', '6', '7', '8'];
const randomValue = faker.random.arrayElement(values);
const randomName = faker.name.findName();
const randomAccoName = randomName + "'s house";
const randomEmail = faker.internet.exampleEmail();
const randomAddress =
  faker.address.cardinalDirection() + ' ' + faker.address.cityName() + ' ' + faker.address.streetName();
const randomLongitude = faker.address.longitude();
const randomLatitude = faker.address.latitude();
const randomWebsite = faker.internet.url();
let targetApplicantName: string;

describe('TC_REGI : Create and do actions in applicants page', () => {
  before(() => {
    cy.visit('/');
  });

  it('TC_SIGN01 : sign in', () => {
    cy.requestAdminLogin(adminEmail, adminPassword);
  });

  context('TC_REGI01 : create new applicant', () => {
    it('TC_REGI01-01 : click register btn and check modal', () => {
      cy.get('button').contains('Register').click();
      cy.dataCy('applicant-modal').should('be.visible');
    });
    it('TC_REGI01-02 : input fields', () => {
      cy.get('select').select(randomValue);
      cy.findByLabelText('Full name*').type(randomName);
      cy.findByLabelText('Accommodation Name*').type(randomAccoName);
      cy.findByLabelText('Mobile*').type('0900000000');
      cy.findByLabelText('Number of Rooms*').type(randomValue);
      cy.findByLabelText('Email*').type(randomEmail);
      cy.findByLabelText('Business Address*').type(randomAddress);
    });
    it('TC_REGI01-03 : click save btn', () => {
      cy.get('button').contains('Save').click();
      cy.dataCy('applicant-modal').should('not.exist');
    });
    it('TC_REGI01-04 : check in table', () => {
      cy.contains(randomName)
        .parent('tr')
        .within(() => {
          cy.get('td').eq(9).contains('Pending');
        });
    });
  });

  context('TC_REGI02 : do edit action in applicant list', () => {
    let editRandomValue: number;
    before(() => {
      if (+randomValue == 8 || +randomValue == 7) {
        editRandomValue = +randomValue - 2;
      } else {
        editRandomValue = +randomValue + 1;
      }
    });
    it('TC_REGI02-01 : find and click action btn which applicant status is pending', () => {
      cy.contains('Pending')
        .parent('tr')
        .within(() => {
          cy.get('td').eq(10).click();
        });
    });
    it('TC_REGI02-02 : click edit btn', () => {
      cy.get('button').contains('Edit').click();
      cy.dataCy('applicant-modal').should('be.visible');
    });
    it('TC_REGI02-03 : clear and edit fields', () => {
      cy.get('select').select(editRandomValue);
      cy.findByLabelText('Full name*').clear();
      cy.findByLabelText('Accommodation Name*').clear();
      cy.findByLabelText('Mobile*').clear();
      cy.findByLabelText('Number of Rooms*').clear();
      cy.findByLabelText('Email*').clear();
      cy.findByLabelText('Business Address*').clear();

      cy.findByLabelText('Full name*').type('edit.' + randomName);
      cy.findByLabelText('Accommodation Name*').type('edit.' + randomAccoName);
      cy.findByLabelText('Mobile*').type('0911111111');
      cy.findByLabelText('Number of Rooms*').type(editRandomValue + '');
      cy.findByLabelText('Email*').type('edit.' + randomEmail);
      cy.findByLabelText('Business Address*').type('edit.' + randomAddress);
    });
    it('TC_REGI02-04 : click save btn', () => {
      cy.get('button').contains('Save').click();
      cy.dataCy('applicant-modal').should('not.exist');
    });
    it('TC_REGI02-05 : check change', () => {
      cy.contains('edit.' + randomName);
    });
  });

  context('TC_REGI04 : do register action in applicant list', () => {
    it('TC_REGI04-01 : find and click action btn which applicant status is pending, and click register btn', () => {
      cy.contains('Pending')
        .parent('tr')
        .within(() => {
          cy.get('td')
            .eq(5)
            .then(($name) => {
              targetApplicantName = $name.text();
            });
          cy.get('td').eq(10).click();
          cy.get('button').contains('Register').click();
        });
      cy.dataCy('verify-accommodation-modal').should('be.visible');
    });
    it('TC_REGI04-02 : input fields and click verify btn', () => {
      cy.findByLabelText('Province/City*').select(1);
      cy.findByLabelText('District*').select(1);
      cy.get('button').contains('Verify').click();
      cy.dataCy('verify-accommodation-modal').should('not.exist');
    });
    it('TC_REGI04-03 : check register accommodation modal opened', () => {
      cy.dataCy('accommodation-modal').should('be.visible');
    });
    it('TC_REGI04-04 : input fields and click save btn', () => {
      cy.findByLabelText('Longitude*').type(randomLongitude);
      cy.findByLabelText('Latitude*').type(randomLatitude);
      cy.findByLabelText('Website').type(randomWebsite);
      cy.findByLabelText('Number of floors*').type(randomValue);
      cy.get('button').contains('Save').click();
      cy.dataCy('accommodation-modal').should('not.exist');
    });
    it('TC_REGI04-05 : check status change to registered', () => {
      cy.contains('Registered').parent('tr').get('td').eq(5).should('contain', targetApplicantName);
    });
    it('TC_REGI04-06 : move to accommodation page', () => {
      cy.get('a[href*="/accommodations"]').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/accommodations`);
    });
    it('TC_REGI04-07 : check accommodation created', () => {
      cy.get('td').should('contain', targetApplicantName);
    });
  });
});
