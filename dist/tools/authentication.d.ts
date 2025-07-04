export declare function createAuthenticationHelperTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            authMethod: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            framework: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            includeRedirect: {
                type: string;
                description: string;
                default: boolean;
            };
            includeErrorHandling: {
                type: string;
                description: string;
                default: boolean;
            };
            customDomain: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare function handleSetupAuthentication(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=authentication.d.ts.map