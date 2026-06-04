context('React Archer', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Root');
  });

  describe('First example page', () => {
    beforeEach(() => {
      cy.visit('/?example=1');
    });

    it('should draw arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Second example page', () => {
    beforeEach(() => {
      cy.visit('/?example=2');
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
      cy.visit('/?example=3');
    });

    it('should draw non curvy arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Fourth example page', () => {
    beforeEach(() => {
      cy.visit('/?example=4');
    });

    it('should draw arrows with an offset', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Fifth example page', () => {
    beforeEach(() => {
      cy.visit('/?example=5');
    });

    it('should draw arrows with a middle anchor', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Seventh example page', () => {
    beforeEach(() => {
      cy.visit('/?example=7');
    });

    it('should draw arrows with circle end shapes', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Eigth example page', () => {
    beforeEach(() => {
      cy.visit('/?example=8');
    });

    it('should draw arrows with straight lines and start markers', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Sixth example page', () => {
    beforeEach(() => {
      cy.visit('/?example=6');
    });

    it('should draw arrows with custom labels', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Ninth example page', () => {
    beforeEach(() => {
      cy.visit('/?example=9');
    });

    it('should draw arrows with styled relations', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Tenth example page', () => {
    beforeEach(() => {
      cy.visit('/?example=10');
    });

    it('should draw interactive arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Eleventh example page', () => {
    beforeEach(() => {
      cy.visit('/?example=11');
    });

    it('should draw draggable arrows on their initial layout', () => {
      cy.matchImageSnapshot();
    });
  });
});
