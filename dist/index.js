#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Import tools
import { createSpaceTool } from './tools/spaces.js';
import { createSchemaHelperTool } from './tools/schema.js';
import { createQueryHelperTool } from './tools/queries.js';
import { createAuthenticationHelperTool } from './tools/authentication.js';
import { createMappingHelperTool } from './tools/mapping.js';
import { createProviderHelperTool } from './tools/providers.js';
import { createPublishingHelperTool } from './tools/publishing.js';
import { createDocumentationTool } from './tools/documentation.js';
import { createQuickstartTool } from './tools/quickstart.js';
import { createAdvancedTool } from './tools/advanced.js';
class HypergraphMCPServer {
    server;
    knowledgeBase = {};
    constructor() {
        this.server = new Server({
            name: 'hypergraph-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        this.setupErrorHandling();
    }
    async loadKnowledgeBase() {
        try {
            const knowledgeDir = path.join(__dirname, '..', 'knowledge');
            const dataPath = path.join(knowledgeDir, 'hypergraph_data.json');
            const mdPath = path.join(knowledgeDir, 'hypergraph_knowledge_base.md');
            // Load JSON data if it exists
            try {
                const jsonData = await fs.readFile(dataPath, 'utf-8');
                this.knowledgeBase.data = JSON.parse(jsonData);
            }
            catch (error) {
                console.warn('Could not load hypergraph_data.json:', error);
            }
            // Load markdown knowledge base
            try {
                this.knowledgeBase.markdown = await fs.readFile(mdPath, 'utf-8');
            }
            catch (error) {
                console.warn('Could not load hypergraph_knowledge_base.md:', error);
            }
        }
        catch (error) {
            console.error('Error loading knowledge base:', error);
        }
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    // Core Hypergraph tools
                    createSpaceTool(),
                    createSchemaHelperTool(),
                    createQueryHelperTool(),
                    createAuthenticationHelperTool(),
                    createMappingHelperTool(),
                    createProviderHelperTool(),
                    createPublishingHelperTool(),
                    // Documentation and learning tools
                    createDocumentationTool(),
                    createQuickstartTool(),
                    createAdvancedTool(),
                    // General knowledge tool
                    {
                        name: 'search_knowledge',
                        description: 'Search the Hypergraph knowledge base for specific information',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: 'Search query for the knowledge base',
                                },
                                category: {
                                    type: 'string',
                                    enum: ['quickstart', 'core-concepts', 'authentication', 'spaces', 'schema', 'queries', 'providers', 'mapping', 'publishing', 'advanced', 'all'],
                                    description: 'Category to search within',
                                    default: 'all'
                                }
                            },
                            required: ['query'],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'create_space':
                        return await this.handleCreateSpace(args);
                    case 'create_schema':
                        return await this.handleCreateSchema(args);
                    case 'generate_query':
                        return await this.handleGenerateQuery(args);
                    case 'setup_authentication':
                        return await this.handleSetupAuthentication(args);
                    case 'create_mapping':
                        return await this.handleCreateMapping(args);
                    case 'setup_providers':
                        return await this.handleSetupProviders(args);
                    case 'create_publishing_flow':
                        return await this.handleCreatePublishingFlow(args);
                    case 'get_documentation':
                        return await this.handleGetDocumentation(args);
                    case 'generate_quickstart':
                        return await this.handleGenerateQuickstart(args);
                    case 'advanced_setup':
                        return await this.handleAdvancedSetup(args);
                    case 'search_knowledge':
                        return await this.handleSearchKnowledge(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        },
                    ],
                };
            }
        });
    }
    async handleSearchKnowledge(args) {
        const { query, category = 'all' } = args;
        let searchResults = '';
        if (this.knowledgeBase.markdown) {
            const lines = this.knowledgeBase.markdown.split('\n');
            const relevantLines = lines.filter((line) => line.toLowerCase().includes(query.toLowerCase()) ||
                (category !== 'all' && line.toLowerCase().includes(category.toLowerCase())));
            if (relevantLines.length > 0) {
                searchResults += `Found ${relevantLines.length} relevant entries:\n\n`;
                searchResults += relevantLines.slice(0, 10).join('\n');
                if (relevantLines.length > 10) {
                    searchResults += '\n\n... (showing first 10 results)';
                }
            }
            else {
                searchResults = `No results found for "${query}" in category "${category}"`;
            }
        }
        else {
            searchResults = 'Knowledge base not loaded';
        }
        return {
            content: [
                {
                    type: 'text',
                    text: searchResults,
                },
            ],
        };
    }
    // Tool handlers will be implemented in separate files
    async handleCreateSpace(args) {
        // Implementation will be imported from tools/spaces.js
        return { content: [{ type: 'text', text: 'Space creation handler placeholder' }] };
    }
    async handleCreateSchema(args) {
        // Implementation will be imported from tools/schema.js
        return { content: [{ type: 'text', text: 'Schema creation handler placeholder' }] };
    }
    async handleGenerateQuery(args) {
        // Implementation will be imported from tools/queries.js
        return { content: [{ type: 'text', text: 'Query generation handler placeholder' }] };
    }
    async handleSetupAuthentication(args) {
        // Implementation will be imported from tools/authentication.js
        return { content: [{ type: 'text', text: 'Authentication setup handler placeholder' }] };
    }
    async handleCreateMapping(args) {
        // Implementation will be imported from tools/mapping.js
        return { content: [{ type: 'text', text: 'Mapping creation handler placeholder' }] };
    }
    async handleSetupProviders(args) {
        // Implementation will be imported from tools/providers.js
        return { content: [{ type: 'text', text: 'Provider setup handler placeholder' }] };
    }
    async handleCreatePublishingFlow(args) {
        // Implementation will be imported from tools/publishing.js
        return { content: [{ type: 'text', text: 'Publishing flow handler placeholder' }] };
    }
    async handleGetDocumentation(args) {
        // Implementation will be imported from tools/documentation.js
        return { content: [{ type: 'text', text: 'Documentation handler placeholder' }] };
    }
    async handleGenerateQuickstart(args) {
        // Implementation will be imported from tools/quickstart.js
        return { content: [{ type: 'text', text: 'Quickstart generation handler placeholder' }] };
    }
    async handleAdvancedSetup(args) {
        // Implementation will be imported from tools/advanced.js
        return { content: [{ type: 'text', text: 'Advanced setup handler placeholder' }] };
    }
    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error('[MCP Error]', error);
        };
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    async run() {
        await this.loadKnowledgeBase();
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Hypergraph MCP server running on stdio');
    }
}
const server = new HypergraphMCPServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map