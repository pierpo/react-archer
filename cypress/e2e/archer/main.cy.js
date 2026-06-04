context('React Archer', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Root');
  });

  describe('Basic arrows', () => {
    beforeEach(() => {
      cy.visit('/?example=basic-arrows');
    });

    it('should draw arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Dynamic elements', () => {
    beforeEach(() => {
      cy.visit('/?example=dynamic-elements');
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

  describe('Angle lines', () => {
    beforeEach(() => {
      cy.visit('/?example=angle-lines');
    });

    it('should draw arrows with right angles', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Straight lines', () => {
    beforeEach(() => {
      cy.visit('/?example=straight-lines');
    });

    it('should draw straight arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Anchor offsets', () => {
    beforeEach(() => {
      cy.visit('/?example=anchor-offsets');
    });

    it('should draw arrows with an offset', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Middle anchor', () => {
    beforeEach(() => {
      cy.visit('/?example=middle-anchor');
    });

    it('should draw arrows with a middle anchor', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Custom labels', () => {
    beforeEach(() => {
      cy.visit('/?example=custom-labels');
    });

    it('should draw arrows with custom labels', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Circle ends', () => {
    beforeEach(() => {
      cy.visit('/?example=circle-ends');
    });

    it('should draw arrows with circle end shapes', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Start markers', () => {
    beforeEach(() => {
      cy.visit('/?example=start-markers');
    });

    it('should draw arrows with start markers', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Styled relations', () => {
    beforeEach(() => {
      cy.visit('/?example=styled-relations');
    });

    it('should draw arrows with styled relations', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Interactive', () => {
    beforeEach(() => {
      cy.visit('/?example=interactive');
    });

    it('should draw interactive arrows', () => {
      cy.matchImageSnapshot();
    });
  });

  describe('Drag & drop', () => {
    beforeEach(() => {
      cy.visit('/?example=drag-and-drop');
    });

    it('should draw draggable arrows on their initial layout', () => {
      cy.matchImageSnapshot();
    });
  });
});
