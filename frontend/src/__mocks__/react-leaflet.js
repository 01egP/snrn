const MockComponent = ({ children }) => <div>{children}</div>;

export const MapContainer = MockComponent;
export const TileLayer = MockComponent;
export const useMap = jest.fn();
export const useMapEvent = jest.fn();
export const useMapEvents = jest.fn();
