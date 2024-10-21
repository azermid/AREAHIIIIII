describe('Login Screen Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8081/login');
    });
  
    it('should display the login screen correctly', () => {
      cy.contains('Log In').should('be.visible');
      cy.get('[data-testid="input-username"]').should('be.visible');
      cy.get('[data-testid="input-password"]').should('be.visible');
      cy.contains('-->').should('be.visible');
    });
  
    it('should show error when fields are empty and login is attempted', () => {
      cy.contains('-->').click();
      cy.contains('Please fill in both fields').should('be.visible');
    });
  
    it('should show error for incorrect username', () => {
        cy.get('[data-testid="input-username"]').type('wrongUser');  
        cy.get('[data-testid="input-password"]').type('wrongPassword');
      cy.contains('-->').click();
      cy.contains('User not found').should('be.visible');
    });
  
    it('should show error for incorrect password', () => {
        cy.get('[data-testid="input-username"]').type('amir');  
        cy.get('[data-testid="input-password"]').type('wrongPassword');
      cy.contains('-->').click();
      cy.contains('Invalid password').should('be.visible');
    });

    it('should login successfully and navigate to menu page', () => {
        const username = 'amir';
        const password = '1234';
        cy.get('[data-testid="input-username"]').type(username);
        cy.get('[data-testid="input-password"]').type(password);
        cy.contains('-->').click();
        cy.url().should('include', '/menu');
    });
  
    it('should navigate to "Trouble logging in?" page', () => {
      cy.contains('Trouble logging in?').click();
      cy.url().should('include', '/loginHelper');
    });
  
    it('should navigate to sign up page', () => {
      cy.contains('Sign up for an account').click();
      cy.url().should('include', '/signUp');
    });
  });
  