export const PROPERTIES = {
    BEACHWALK_APARTMENTS: 'Beachwalk Apartments',
    OCEANVIEW_TOWERS: 'Oceanview Towers',
    IRVINE_SPECTRUM: 'Irvine Spectrum Center Irvine CA',
};

export interface SearchTestCase {
  query: string;
  expectedName: string;
}

export const SEARCH_TEST_CASES: SearchTestCase[] = [
  { query: PROPERTIES.BEACHWALK_APARTMENTS, expectedName: 'Beachwalk' },
  { query: PROPERTIES.OCEANVIEW_TOWERS, expectedName: 'Ocean View' },
  { query: PROPERTIES.IRVINE_SPECTRUM, expectedName: 'Irvine Spectrum' },
];