import availableLocations from './availableLocations.json';

export const findLocation = (currLocationName) => {
    return availableLocations.find(
        (location) => location.locationName === currLocationName
    );
};
