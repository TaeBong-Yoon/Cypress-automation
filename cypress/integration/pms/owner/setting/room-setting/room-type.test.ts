import { ownerEmail, ownerPassword } from '../../../../../fixtures/test-data';
import * as faker from 'faker';
import { ICreateRoomTypeMutationResData } from '../../../../../../apps/pms/src/api/rooms/mutations/useCreateRoomTypeMutation';

/**
 * Test scenario : Go to room setting page and do actions in room type
 *
 * Test data :
 */
const valuesForNumber = ['1', '2', '3', '4', '5', '6', '7', '8'];
const valuesForRoomType = ['Cy Deluxe', 'Cy Standard', 'Cy Luxury', 'Cy Sweet', 'Cy VIP'];
const valueForDescription = 'This is made by Cypress - Joony Yoon';
const valuesForRoomRate = faker.datatype
  .number({
    min: 1,
    max: 100,
  })
  .toString()
  .padEnd(6, '0');

const MOCK_ROOM_TYPE: ICreateRoomTypeMutationResData = {
  id: 999999999,
  name: faker.random.arrayElement(valuesForRoomType),
  description: valueForDescription,
  capacity_adult: parseInt(faker.random.arrayElement(valuesForNumber)),
  capacity_child: parseInt(faker.random.arrayElement(valuesForNumber)),
  max_capacity: parseInt(faker.random.arrayElement(valuesForNumber)) * 50,
  color: '#000000',
  num_of_bed: parseInt(faker.random.arrayElement(valuesForNumber)),
  num_of_bath: parseInt(faker.random.arrayElement(valuesForNumber)),
  extra_adult_price: valuesForRoomRate,
  extra_child_price: valuesForRoomRate,
  hourly_price: valuesForRoomRate,
  overnight_price: valuesForRoomRate,
  daily_price: valuesForRoomRate,
  additional_hour_price: valuesForRoomRate,
};

describe('TC_ROTYSE : Go to room setting page and do actions in room type', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText('Settings').click();
    cy.get('a[href*="/settings/room-setting"]').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/room-setting`);
  });

  context('TC_ROTYSE01 : create new room type', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/rooms/room-type/create/', {
        statusCode: 201,
        body: MOCK_ROOM_TYPE,
      });
    });
    it('TC_ROTYSE01-01 : click new room type btn', () => {
      cy.findByText('New Room Type', { timeout: 20000 }).should('be.visible').click();
      cy.dataCy('room-type-modal').should('be.visible');
    });
    it('TC_ROTYSE01-02 : input fields', () => {
      cy.findByLabelText('Max Capacity*').clear();
      cy.findByLabelText('Number of Adults*').clear();
      cy.findByLabelText('Number of Children').clear();

      cy.findByLabelText('Room Type Name*').type(MOCK_ROOM_TYPE.name);
      cy.findByLabelText('Number of Beds*').type(String(MOCK_ROOM_TYPE.num_of_bed));
      cy.findByLabelText('Number of Baths').type(String(MOCK_ROOM_TYPE.num_of_bath));
      cy.findByLabelText('Max Capacity*').type(String(MOCK_ROOM_TYPE.max_capacity));
      cy.findByLabelText('Number of Adults*').type(String(MOCK_ROOM_TYPE.capacity_adult));
      cy.findByLabelText('Number of Children').type(String(MOCK_ROOM_TYPE.capacity_child));

      cy.findByLabelText('Hourly*').type(String(MOCK_ROOM_TYPE.hourly_price));
      cy.findByLabelText('Overnight*').type(String(MOCK_ROOM_TYPE.overnight_price));
      cy.findByLabelText('Additional hour*').type(String(MOCK_ROOM_TYPE.additional_hour_price));
      cy.findByLabelText('Daily*').type(String(MOCK_ROOM_TYPE.daily_price));

      cy.findByLabelText('Price per extra adult*').type(String(MOCK_ROOM_TYPE.extra_adult_price));
      cy.findByLabelText('Price per extra child*').type(String(MOCK_ROOM_TYPE.extra_child_price));

      cy.get('textarea').type(MOCK_ROOM_TYPE.description);
    });
    it('TC_ROTYSE01-03 : click save btn', () => {
      cy.findByText('Save', { timeout: 20000 }).should('be.visible').click();
      cy.dataCy('room-type-modal').should('not.exist');
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });
  context('TC_ROTYSE02 : edit room type', () => {
    it('TC_ROTYSE02-01 : check if there is a check room type named Cypress. If not, create a new room type named Cypress.', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button[data-cy=room-type-btn-Cypress]').length === 0) {
          cy.findByText('New Room Type').click();
          cy.dataCy('room-type-modal').should('be.visible');
          cy.findByLabelText('Max Capacity*').clear();
          cy.findByLabelText('Number of Adults*').clear();
          cy.findByLabelText('Number of Children').clear();

          cy.findByLabelText('Room Type Name*').type('Cypress');
          cy.findByLabelText('Number of Beds*').type(String(MOCK_ROOM_TYPE.num_of_bed));
          cy.findByLabelText('Number of Baths').type(String(MOCK_ROOM_TYPE.num_of_bath));
          cy.findByLabelText('Max Capacity*').type(String(MOCK_ROOM_TYPE.max_capacity));
          cy.findByLabelText('Number of Adults*').type(String(MOCK_ROOM_TYPE.capacity_adult));
          cy.findByLabelText('Number of Children').type(String(MOCK_ROOM_TYPE.capacity_child));

          cy.findByLabelText('Hourly*').type(String(MOCK_ROOM_TYPE.hourly_price));
          cy.findByLabelText('Overnight*').type(String(MOCK_ROOM_TYPE.overnight_price));
          cy.findByLabelText('Additional hour*').type(String(MOCK_ROOM_TYPE.additional_hour_price));
          cy.findByLabelText('Daily*').type(String(MOCK_ROOM_TYPE.daily_price));

          cy.findByLabelText('Price per extra adult*').type(String(MOCK_ROOM_TYPE.extra_adult_price));
          cy.findByLabelText('Price per extra child*').type(String(MOCK_ROOM_TYPE.extra_child_price));

          cy.get('textarea').type(MOCK_ROOM_TYPE.description);
          cy.findByText('Save', { timeout: 20000 }).should('be.visible').click();
          cy.dataCy('room-type-modal').should('not.exist');
          cy.findAllByText('Your information has been saved.').should('exist');
        }
      });
    });
    it('TC_ROTYSE02-02 : click room type named by Cypress', () => {
      cy.dataCy('room-type-btn-Cypress').click();
      cy.dataCy('room-type-modal').should('be.visible');
    });
    it('TC_ROTYSE02-03 : edit fields', () => {
      cy.findByLabelText('Number of Beds*').clear();
      cy.findByLabelText('Number of Baths').clear();
      cy.findByLabelText('Max Capacity*').clear();
      cy.findByLabelText('Number of Adults*').clear();
      cy.findByLabelText('Number of Children').clear();
      cy.get('textarea').clear();

      cy.findByLabelText('Number of Beds*').type(String(MOCK_ROOM_TYPE.num_of_bed));
      cy.findByLabelText('Number of Baths').type(String(MOCK_ROOM_TYPE.num_of_bath));
      cy.findByLabelText('Max Capacity*').type(String(MOCK_ROOM_TYPE.max_capacity));
      cy.findByLabelText('Number of Adults*').type(String(MOCK_ROOM_TYPE.capacity_adult));
      cy.findByLabelText('Number of Children').type(String(MOCK_ROOM_TYPE.capacity_child));
      cy.get('textarea').type(MOCK_ROOM_TYPE.description);
    });
    it('TC_ROTYSE02-04 : click save btn', () => {
      cy.findByText('Save', { timeout: 20000 }).should('be.visible').click();
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });
});
