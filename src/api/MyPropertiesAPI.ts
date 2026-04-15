import { APIRequestContext } from '@playwright/test';
import { BaseAPI } from './BaseAPI';

const MY_PROPERTIES_URL = `${process.env.EVRA_API_URL}/evra/v5.11/my-properties`;

export interface MyProperty {
    property_id: string;
    address_repr: string;
    latitude: number;
    longitude: number;
    status: string;
}

export class MyPropertiesAPI extends BaseAPI {

    private readonly dataVersion = 'evra-statistics=v2-2026-03, evra-features=v1-2026-03, evra-properties=v1-2026-03';

    constructor(request: APIRequestContext) {
        super(request);
    }


    private get defaultHeaders() {
        return {
            'authorization': `Bearer ${this.bearerToken}`,
            'content-type': 'application/json',
            'data-version': this.dataVersion,
        };
    }

    async getMyProperties(): Promise<MyProperty[]> {

        const response = await this.request.get(`${MY_PROPERTIES_URL}?sort_by=created_at`,
            { headers: this.defaultHeaders }
        );

        if (!response.ok()) {
            console.error(`getMyProperties failed: ${response.status()} ${await response.text()}`);
            return [];
        }

        const body = await response.json();
        return Array.isArray(body) ? body : [];

    }

    async deleteProperty(propertyId: string, latitude: number, longitude: number): Promise<void> {

        await this.request.delete(`${MY_PROPERTIES_URL}/${propertyId}`, {
            headers: {
                ...this.defaultHeaders,
                'x-latitude': String(latitude),
                'x-longitude': String(longitude),
            },
        });
    }


    async deleteAllProperties(): Promise<void> {

        const properties = await this.getMyProperties();

        if (!properties.length) return;

        for (const property of properties) {
            await this.deleteProperty(
                property.property_id,
                property.latitude,
                property.longitude
            );
        }

    }
}