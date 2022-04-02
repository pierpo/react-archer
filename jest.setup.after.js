let fakeRandom = 0;
beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockImplementation(() => {
    fakeRandom += 0.00001;
    return fakeRandom;
  });
});

afterEach(() => {
  fakeRandom = 0;
  jest.spyOn(global.Math, 'random').mockRestore();
});
