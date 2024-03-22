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
    cy.getByData('start-game').click();

    cy.get('button').should('contain.text', 'Submit');
  });
});

describe('Authentication', () => {
  it('User should be able to sign in', () => {
    cy.visit('/', { failOnStatusCode: false });

    // check if Sign-in button exists (the user is signed-out)
    cy.getByData('sign-in-button').should('exist');

    cy.signIn();
  });
});

describe('Game Creation and Editing while logged out', () => {
  beforeEach(() => {
    cy.visit('/new-game', { failOnStatusCode: false });
  });
  it('User can enter basic form data', () => {
    cy.getByData('game-title').should('exist').type('Test Game');
    cy.getByData('game-description').should('exist').type('Test game description');

    // Using the exact value does not change the slider value
    // Eg. 300 does not set it to 5 minutes (300 seconds), but 295 does.
    cy.getByData('time-limit').invoke('val', 295).trigger('change')
    cy.getByData('minute-marker-5').should('have.class', 'font-bold')
    cy.getByData('time-limit').invoke('val', 1850).trigger('change')
    cy.getByData('minute-marker-30').should('have.class', 'font-bold')

    // Enter data into challenges

    // Test Trivia input
    cy.getByData('challenge-0-trivia-clue').type('Trivia question #1')
    cy.getByData('challenge-0-trivia-clue').should('have.value', 'Trivia question #1')
    cy.getByData('challenge-0-trivia-answer').type('Trivia answer #1')
    cy.getByData('challenge-0-trivia-answer').should('have.value', 'Trivia answer #1')

    // Test Caesar Cypher input
    cy.getByData('challenge-1-caesar-cypher-answer').type('Encrypt this clue')
    cy.getByData('1-encrypt-button').click()
    cy.getByData('challenge-1-caesar-cypher-clue').should('not.have.value', '')

    // Test Word Scramble input
    cy.getByData('challenge-2-word-scramble-answer').type('scramble these words')
    cy.getByData('2-scramble-button').click()
    cy.getByData('challenge-2-word-scramble-clue').should('have.descendants', 'li')

    // Add a new challenge
    cy.getByData('add-challenge').click()
    cy.getByData('challenge-3-trivia-clue').should('exist') 
    cy.getByData('remove-trivia-3').click();
    // This is flaky - later on it may not create a trivia challenge by default

    // User is not logged in, so game will not save to DB
    cy.getByData('create-game').click()
    cy.getByData('play-game').should('exist')
    cy.getByData('logged-out-message').should('exist')

    // Open the game
    cy.getByData('play-game').click();
    cy.location().should((url) => {
      expect(url.pathname).to.match(/\/game\/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/i)
    })
    cy.getByData('edit-game').click();
    cy.location().should((url) => {
      expect(url.pathname).to.match(/\/edit\/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/i)
    })
    
    cy.getByData('game-title').should('exist').type(' - edited');
    cy.getByData('edit-game').click();

    cy.getByData('play-game').click();
    cy.get('h2').contains('edited');

    cy.getByData('start-game').click();
    cy.get('h2').contains('Trivia question #1')

    cy.getByData('home-link').click();
    cy.getByData('play').click();
    cy.get('h3').contains('Test Game - edited')
  });
});
