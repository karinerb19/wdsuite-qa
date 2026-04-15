import { APIRequestContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class BaseAPI {
    
    protected readonly request: APIRequestContext;
    protected readonly bearerToken: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.bearerToken = this.extractBearerToken();
    }

    private extractBearerToken(): string {
        const authFilePath = path.join(process.cwd(), 'playwright/.auth/user.json');
        const storageState = JSON.parse(fs.readFileSync(authFilePath, 'utf-8'));

        for (const origin of storageState.origins) {
            for (const item of origin.localStorage) {
                if (item.name === 'okta-token-storage') {
                    const tokenStorage = JSON.parse(item.value);
                    return tokenStorage.accessToken.accessToken;
                }
            }
        }
        throw new Error('Bearer token not found in okta-token-storage');
    }
}