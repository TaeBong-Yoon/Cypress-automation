import { ownerEmail, ownerPassword } from '../../../../../fixtures/test-data';
import * as faker from 'faker';
import { ICreateRoomMutationResData } from '../../../../../../apps/pms/src/api/rooms/mutations/useCreateRoomMutation';

/**
 * Test scenario : Go to room setting page and do actions in room
 *
 * Test data :
 */
const valuesForFloor = ['16', '17', '18', '19', '20'];
const valuesForRoomType = ['17', '18', '19'];
const randomValueForFloor = faker.random.arrayElement(valuesForFloor);
const randomValueForRoomType = faker.random.arrayElement(valuesForRoomType);

const MOCK_ROOM: ICreateRoomMutationResData = {
  id: 9999999999,
  name: 'Cypress fake room',
  room_floor: parseInt(randomValueForFloor),
  room_type: parseInt(randomValueForRoomType),
  description: 'This is made by Cypress - Jonny Yoon',
};

describe('TC_ROSE : Go to room setting page and do actions in room', () => {
  before(() => {
    cy.requestUserLogin(ownerEmail, ownerPassword);
    cy.findByText('Settings').click();
    cy.get('a[href*="/settings/room-setting"]').click();
    cy.url().should('equal', `${Cypress.config('baseUrl')}/settings/room-setting`);
  });

  context('TC_ROSE01 : create new room', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/rooms/create/', {
        statusCode: 201,
        body: MOCK_ROOM,
      });
    });
    it('TC_ROSE01-01 : click new room btn', () => {
      cy.findAllByText('New Room').first().click();
      cy.dataCy('room-modal').should('be.visible');
    });
    it('TC_ROSE01-02 : input fields', () => {
      cy.findByLabelText('Room Name*').type(MOCK_ROOM.name);
      cy.findByLabelText('Floor*').select(MOCK_ROOM.room_floor.toString());
      cy.findByLabelText('Room Type*').select(MOCK_ROOM.room_type.toString());
      cy.get('textarea').type(MOCK_ROOM.description);
    });
    it('TC_ROSE01-03 : click save btn', () => {
      cy.findByText('Save', { timeout: 20000 }).click();
      cy.dataCy('room-modal').should('not.exist');
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });
  context('TC_ROSE02 : edit room', () => {
    it('TC_ROSE02-01 : check room named by CypressRoom. If not, make a new room named by CypressRoom', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button[data-cy=room-btn-CypressRoom]').length === 0) {
          cy.findAllByText('New Room').first().click();
          cy.dataCy('room-modal').should('be.visible');
          cy.findByLabelText('Room Name*').type('CypressRoom');
          cy.findByLabelText('Floor*').select(MOCK_ROOM.room_floor.toString());
          cy.findByLabelText('Room Type*').select(MOCK_ROOM.room_type.toString());
          cy.get('textarea').type(MOCK_ROOM.description);
          cy.findByText('Save', { timeout: 20000 }).click();
          cy.dataCy('room-modal').should('not.exist');
          cy.findAllByText('Your information has been saved.').should('exist');
        }
      });
    });
    it('TC_ROSE02-02 : edit fields', () => {
      cy.dataCy('room-btn-CypressRoom').click();
      cy.dataCy('room-modal').should('be.visible');
      cy.get('textarea').clear();

      cy.findByLabelText('Floor*').select(MOCK_ROOM.room_floor.toString());
      cy.findByLabelText('Room Type*').select(MOCK_ROOM.room_type.toString());
      cy.get('textarea').type(MOCK_ROOM.description);
    });
    it('TC_ROSE02-03 : click save btn', () => {
      cy.findByText('Save', { timeout: 20000 }).click();
      cy.dataCy('room-modal').should('not.exist');
      cy.findAllByText('Your information has been saved.').should('exist');
    });
  });
});
