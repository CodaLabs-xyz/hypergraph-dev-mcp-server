export declare function createDocumentationTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            topic: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            format: {
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
            language: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
        };
        required: never[];
    };
};
export declare function handleGetDocumentation(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=documentation.d.ts.map