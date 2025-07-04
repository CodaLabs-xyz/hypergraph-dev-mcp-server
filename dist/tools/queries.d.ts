export declare function createQueryHelperTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            entityName: {
                type: string;
                description: string;
            };
            queryType: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            includeRelations: {
                type: string;
                description: string;
                default: boolean;
            };
            filters: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        property: {
                            type: string;
                        };
                        operator: {
                            type: string;
                            enum: string[];
                        };
                        value: {
                            type: string;
                        };
                    };
                    required: string[];
                };
                description: string;
                default: never[];
            };
            spaceId: {
                type: string;
                description: string;
            };
            framework: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            includeExamples: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
export declare function handleGenerateQuery(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=queries.d.ts.map