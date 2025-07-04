export declare function createAdvancedTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            setupType: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            complexity: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            includeDocumentation: {
                type: string;
                description: string;
                default: boolean;
            };
            includeExamples: {
                type: string;
                description: string;
                default: boolean;
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
export declare function handleAdvancedSetup(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=advanced.d.ts.map