context('React Archer', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Root');
  });

  describe('First example page', () => {
    beforeEach(() => {
      cy.contains('Example 1').click();
    });

    it('should draw arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Second example page', () => {
    beforeEach(() => {
      cy.contains('Example 2').click();
      cy.contains('Change labels').click();
    });

    it('should draw arrows', () => {
      cy.matchImageSnapshot();
    });

    it('should update labels', () => {
      cy.get('[data-cy="change-labels-input"]').type('blabla some test');
      cy.matchImageSnapshot();
    });

    it('should update number of elements', () => {
      cy.get('[data-cy="add-element"]').click();
      cy.matchImageSnapshot();
    });
  });

  describe('Third example page', () => {
    beforeEach(() => {
      cy.contains('Example 3').click();
      cy.get('h2').contains('Example 3');
    });

    it('should draw non curvy arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Fourth example page', () => {
    beforeEach(() => {
      cy.contains('Example 4').click();
      cy.get('h2').contains('Example 4');
    });

    it('should draw arrows with an offset', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Fifth example page', () => {
    beforeEach(() => {
      cy.contains('Example 5').click();
      cy.get('h2').contains('Example 5');
    });

    it('should draw arrows with a middle anchor', () => {
      cy.matchImageSnapshot();
    });
  });
});
