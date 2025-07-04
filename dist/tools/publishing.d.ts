export declare function createPublishingHelperTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            entityType: {
                type: string;
                description: string;
            };
            publishingStrategy: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            includeValidation: {
                type: string;
                description: string;
                default: boolean;
            };
            includePreview: {
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
            batchSize: {
                type: string;
                description: string;
                default: number;
            };
        };
        required: string[];
    };
};
export declare function handleCreatePublishingFlow(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=publishing.d.ts.map