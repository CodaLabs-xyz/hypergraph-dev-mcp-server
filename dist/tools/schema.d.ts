export declare function createSchemaHelperTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            entityName: {
                type: string;
                description: string;
            };
            properties: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        type: {
                            type: string;
                            enum: string[];
                        };
                        required: {
                            type: string;
                            default: boolean;
                        };
                    };
                    required: string[];
                };
                description: string;
            };
            relations: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        target: {
                            type: string;
                        };
                        type: {
                            type: string;
                            enum: string[];
                        };
                    };
                    required: string[];
                };
                description: string;
                default: never[];
            };
            includeValidation: {
                type: string;
                description: string;
                default: boolean;
            };
            generateExample: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
export declare function handleCreateSchema(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=schema.d.ts.map