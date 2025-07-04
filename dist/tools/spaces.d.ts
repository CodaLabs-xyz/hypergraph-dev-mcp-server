export declare function createSpaceTool(): {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            spaceType: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            spaceName: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            includeInvitations: {
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
        required: string[];
    };
};
export declare function handleCreateSpace(args: any): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=spaces.d.ts.map