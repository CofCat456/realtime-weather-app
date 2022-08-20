import locationName from './locationName.json';

export const findLocation = (currLocationName) => {
    return locationName.find(
        (location) => location.locationName === currLocationName
    );
};
