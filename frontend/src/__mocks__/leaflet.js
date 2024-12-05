const L = {
  map: jest.fn(),
  tileLayer: jest.fn(),
  marker: jest.fn(),
  popup: jest.fn(),
  icon: jest.fn(),
  heatLayer: jest.fn(),
};

global.L = L;

module.exports = { L };
