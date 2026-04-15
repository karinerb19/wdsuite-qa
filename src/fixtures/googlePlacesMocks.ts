export const AUTOCOMPLETE_RESPONSE = {
  suggestions: [
    {
      placePrediction: {
        place: 'places/ChIJLxc_xLoT6YARDltYxV9P46E',
        placeId: 'ChIJLxc_xLoT6YARDltYxV9P46E',
        text: {
          text: 'Beachwalk Apartments, S Voluntario St, Santa Barbara, CA, USA',
          matches: [
            { endOffset: 20 },
            { startOffset: 39, endOffset: 44 },
          ],
        },
        structuredFormat: {
          mainText: {
            text: 'Beachwalk Apartments',
            matches: [{ endOffset: 20 }],
          },
          secondaryText: {
            text: 'S Voluntario St, Santa Barbara, CA, USA',
            matches: [{ startOffset: 17, endOffset: 22 }],
          },
        },
        types: ['apartment_complex', 'establishment', 'service', 'point_of_interest'],
      },
    },
  ],
};

export const PLACE_DETAILS_RESPONSE = {
  formattedAddress: '234 S Voluntario St, Santa Barbara, CA 93103, USA',
  location: {
    latitude: 34.4207881,
    longitude: -119.6732297,
  },
  displayName: {
    text: 'Beachwalk Apartments',
    languageCode: 'en',
  },
  addressComponents: [
    { longText: '234', shortText: '234', types: ['street_number'], languageCode: 'en' },
    { longText: 'South Voluntario Street', shortText: 'S Voluntario St', types: ['route'], languageCode: 'en' },
    { longText: 'Santa Barbara', shortText: 'Santa Barbara', types: ['locality', 'political'], languageCode: 'en' },
    { longText: 'Santa Barbara County', shortText: 'Santa Barbara County', types: ['administrative_area_level_2', 'political'], languageCode: 'en' },
    { longText: 'California', shortText: 'CA', types: ['administrative_area_level_1', 'political'], languageCode: 'en' },
    { longText: 'United States', shortText: 'US', types: ['country', 'political'], languageCode: 'en' },
    { longText: '93103', shortText: '93103', types: ['postal_code'], languageCode: 'en' },
    { longText: '3464', shortText: '3464', types: ['postal_code_suffix'], languageCode: 'en' },
  ],
};