export declare function createMappingHelperTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            entities: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        typeId: {
                            type: string;
                        };
                        properties: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    propertyId: {
                                        type: string;
                                    };
                                };
                            };
                        };
                        relations: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    name: {
                                        type: string;
                                    };
                                    relationId: {
                                        type: string;
                                    };
                                };
                            };
                            default: never[];
                        };
                    };
                    required: string[];
                };
                description: string;
            };
            generateExample: {
                type: string;
                description: string;
                default: boolean;
            };
            includeValidation: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
export declare function handleCreateMapping(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=mapping.d.ts.map