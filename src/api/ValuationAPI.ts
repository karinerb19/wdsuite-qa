import { APIRequestContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { BaseAPI } from './BaseAPI';

const PREDICT_URL = `${process.env.AVM_API_URL}/evra/v5.0/predict`;

export interface PredictRequest {
    latitude: string;
    longitude: string;
    construction_year: number;
    nr_units: number;
    asking_rent: number;
}

export interface PredictResponse {
    transaction_price: number;
    confidence_score: number;
    model_based_confidence_score: number;
    bed_1_market_rent_average: number;
    bed_1_market_rent_median: number;
    bed_3_market_rent_average: number;
    bed_3_market_rent_median: number;
    construction_year: number;
    nr_units: number;
    asking_rent: number;
    noi: number | null;
    avg_unit_size: number | null;
}

export class ValuationAPI extends BaseAPI {

    constructor(request: APIRequestContext) {
        super(request);
    }

    async predict(payload: PredictRequest): Promise<{ status: number; body: PredictResponse | null }> {

        const response = await this.request.post(PREDICT_URL, {
            headers: {
                'authorization': `Bearer ${this.bearerToken}`,
                'x-latitude': payload.latitude,
                'x-longitude': payload.longitude,
                'content-type': 'application/json',
            },
            data: payload,
        });

        if (response.status() !== 200) {
            const text = await response.text();
            console.error(`API Error ${response.status()}: ${text.substring(0, 200)}`);
            return { status: response.status(), body: null };
        }

        return {
            status: response.status(),
            body: await response.json() as PredictResponse,
        };
    }


}