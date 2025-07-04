export declare function createQuickstartTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            projectName: {
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
            entityTypes: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
                default: string[];
            };
            includeAuth: {
                type: string;
                description: string;
                default: boolean;
            };
            includeExamples: {
                type: string;
                description: string;
                default: boolean;
            };
            useTypeScript: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
export declare function handleGenerateQuickstart(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=quickstart.d.ts.map