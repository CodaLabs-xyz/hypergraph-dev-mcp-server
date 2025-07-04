export declare function createProviderHelperTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            providerType: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            includeAuth: {
                type: string;
                description: string;
                default: boolean;
            };
            includeCustomHooks: {
                type: string;
                description: string;
                default: boolean;
            };
            appName: {
                type: string;
                description: string;
                default: string;
            };
            framework: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
        };
        required: never[];
    };
};
export declare function handleSetupProviders(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=providers.d.ts.map