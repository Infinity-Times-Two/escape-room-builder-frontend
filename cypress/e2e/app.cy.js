describe('Navigation', () => {
  beforeEach(() => {
    // { failOnStatusCode: false } prevents a 401 error. Seems to do with Clerk checking for auth on each page visit - will look into it.
    cy.visit('/', { failOnStatusCode: false });
  });

  it('should navigate to the dashboard in a signed out state', () => {
    // check if Sign-in button exists (the user is signed-out)
    cy.getByData('sign-in-button').should('exist');
  });

  it('should navigate to the play page, load games, and start a game while being signed-out', () => {
    // Find a link with an href attribute containing "about" and click it
    cy.getByData('play').click();

    // The new url should include "/about"
    cy.url().should('include', '/play');

    // The new page should contain an h1 with "About"
    cy.get('h1').contains('Play');

    // Get the first game card
    cy.getByData('game-card-0').click();

    // Shows a log-in
    cy.get('.cl-headerTitle').should('have.text', 'Sign in');
  });
});

describe('User can sign in', () => {
  it('should be able to sign in', () => {
    cy.visit('/', { failOnStatusCode: false });

    // check if Sign-in button exists (the user is signed-out)
    cy.getByData('sign-in-button').should('exist');

    cy.signIn();
  });
});
