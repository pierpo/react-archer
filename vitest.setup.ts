import { beforeEach, afterEach, vi } from 'vitest';

// jsdom only ships a throwing stub for window.resizeTo; replace it so resize-driven tests run quietly.
window.resizeTo = () => {};

// Make Math.random deterministic so generated marker ids / snapshots are stable.
let fakeRandom = 0;

beforeEach(() => {
  vi.spyOn(global.Math, 'random').mockImplementation(() => {
    fakeRandom += 0.00001;
    return fakeRandom;
  });
});

afterEach(() => {
  fakeRandom = 0;
  vi.restoreAllMocks();
});
