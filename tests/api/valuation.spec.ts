import { test, expect } from '@playwright/test';
import { ValuationAPI, PredictRequest } from '../../src/api/ValuationAPI.js';

const IRVINE_SPECTRUM: PredictRequest = {
    latitude: '33.649866599999996',
    longitude: '-117.74419069999999',
    construction_year: 1972,
    nr_units: 20,
    asking_rent: 5000,
};

test.describe('Multifamily Valuation API', () => {

    test('predict endpoint returns a valid valuation for a property', async ({ request }) => {

        const valuationAPI = new ValuationAPI(request);

        const { status, body } = await valuationAPI.predict(IRVINE_SPECTRUM);

        expect(status).toBe(200);
        expect(body).not.toBeNull();
        expect(body!.transaction_price).toBeGreaterThan(0);
        expect(body!.model_based_confidence_score).toBeGreaterThan(0);

        test.info().annotations.push(
            { type: 'transaction_price', description: `$${body!.transaction_price.toLocaleString()}` },
            { type: 'confidence_score', description: String(body!.confidence_score) },
            { type: 'model_confidence', description: String(body!.model_based_confidence_score) },
        );

    });

    test('predict endpoint echoes back correct input values', async ({ request }) => {
        const valuationAPI = new ValuationAPI(request);

        const { status, body } = await valuationAPI.predict(IRVINE_SPECTRUM);

        expect(status).toBe(200);
        expect(body!.construction_year).toBe(IRVINE_SPECTRUM.construction_year);
        expect(body!.nr_units).toBe(IRVINE_SPECTRUM.nr_units);
        expect(body!.asking_rent).toBe(IRVINE_SPECTRUM.asking_rent);
    });

    test('predict endpoint returns market rent data', async ({ request }) => {

        const valuationAPI = new ValuationAPI(request);

        const { status, body } = await valuationAPI.predict(IRVINE_SPECTRUM);

        expect(status).toBe(200);
        expect(body!.bed_1_market_rent_average).toBeGreaterThan(0);
        expect(body!.bed_1_market_rent_median).toBeGreaterThan(0);
        expect(body!.bed_3_market_rent_average).toBeGreaterThan(0);
        expect(body!.bed_3_market_rent_median).toBeGreaterThan(0);

    });

});