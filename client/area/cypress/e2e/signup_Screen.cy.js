function generateRandomEmail() {
    const domains = ['example.com', 'test.com', 'demo.com', 'mail.com', 'sample.com'];
    
    const randomName = Math.random().toString(36).substring(2, 15); // Génère un nom aléatoire
    const randomDomain = domains[Math.floor(Math.random() * domains.length)]; // Choisit un domaine aléatoire
    
    return `${randomName}@${randomDomain}`;
}

function generateRandomName() {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson'];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomFirstName} ${randomLastName}`;
}

describe('Sign Up Screen', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8081/signUp');
    });
  
    it('should render the sign-up screen correctly', () => {
      cy.contains('Sign Up').should('be.visible');
      cy.get('[data-testid="input-email"]').should('be.visible');
      cy.get('[data-testid="input-username"]').should('be.visible');
      cy.get('[data-testid="input-password"]').should('be.visible');
      cy.get('[data-testid="input-verify password"]').should('be.visible');
      cy.contains('-->').should('be.visible');
      cy.contains('Already have an account?').should('be.visible');
    });
  
    it('should show an error message when fields are missing', () => {
      cy.get('[data-testid="input-username"]').type('testuser');
      cy.get('[data-testid="input-password"]').type('password123');
      cy.get('[data-testid="input-verify password"]').type('password123');
      cy.contains('-->').click();
      cy.contains('Please fill in all fields').should('be.visible');
    });
  
    it('should show an error message when passwords do not match', () => {
      cy.get('[data-testid="input-email"]').type('test@example.com');
      cy.get('[data-testid="input-username"]').type('testuser');
      cy.get('[data-testid="input-password"]').type('password123');
      cy.get('[data-testid="input-verify password"]').type('differentPassword');
      cy.contains('-->').click();
      cy.contains('Passwords do not match').should('be.visible');
    });
  
    it('should register successfully and navigate to the menu', () => {
        cy.intercept('POST', '/api/register', {
          statusCode: 200,
          body: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJ6enoiLCJwcm92aWRlciI6ImFyZWEiLCJpYXQiOjE3Mjk1NDUyODQsImV4cCI6MTcyOTU0ODg4NH0.Gq-ruKPUo5aT5spaGQ3CT-OtbOhg6vWwzYnf5rJlWQc',
          },
        }).as('registerUser');
      
        cy.get('[data-testid="input-email"]').type(generateRandomEmail());
        cy.get('[data-testid="input-username"]').type(generateRandomName());
        cy.get('[data-testid="input-password"]').type('password123');
        cy.get('[data-testid="input-verify password"]').type('password123');
        cy.contains('-->').click();
      
        cy.url().should('include', '/menu');
      });

    it('should navigate to the sign-in page', () => {
      cy.contains('Already have an account?').click();
      cy.url().should('include', '/login');
    });
  });
  