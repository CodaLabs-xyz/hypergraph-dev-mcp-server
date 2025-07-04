# Hypergraph MCP Server

A comprehensive Model Context Protocol (MCP) server that provides intelligent assistance for building applications with the Hypergraph framework. This server offers specialized tools for creating local-first applications with end-to-end encryption and seamless data synchronization.

## Features

The Hypergraph MCP Server includes 10 specialized tools organized by functionality:

### Core Tools
- **Spaces Management** - Create and manage public/private spaces with invitations
- **Schema Definition** - Generate entity schemas with validation and relationships
- **Query Generation** - Build queries for private and public data with filters
- **Authentication** - Set up Geo Connect and custom authentication providers

### Advanced Tools
- **Knowledge Graph Mapping** - Configure Schema.org property mapping
- **Publishing Workflows** - Implement data publishing to public Knowledge Graph
- **React Providers** - Generate context providers and custom hooks
- **Documentation** - Access comprehensive guides and API references

### Development Tools
- **Quickstart Templates** - Complete project templates for React, Next.js, and TypeScript
- **Advanced Configurations** - Local servers, performance optimization, enterprise deployment

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Build the MCP Server

1. Clone or navigate to the hypergraph-mcp-server directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the server:
   ```bash
   npm run build
   ```

## Integration with Claude Code

### Installation

1. **Install Claude Code CLI:**
   ```bash
   npm install -g @anthropic/claude-code
   ```

2. **Configure the MCP Server:**
   Add the following to your Claude Code configuration file (`~/.claude-code/mcp.json`):
   ```json
   {
     "mcpServers": {
       "hypergraph": {
         "command": "node",
         "args": ["/path/to/hypergraph-mcp-server/dist/index.js"],
         "env": {}
       }
     }
   }
   ```

3. **Start Claude Code:**
   ```bash
   claude-code
   ```

### Usage in Claude Code

Once connected, you can use the following tools:

```
# Generate a new Hypergraph space
/mcp hypergraph generate_space

# Create entity schema
/mcp hypergraph create_schema

# Generate queries
/mcp hypergraph create_query

# Setup authentication
/mcp hypergraph setup_auth

# Get documentation
/mcp hypergraph get_documentation

# Create quickstart project
/mcp hypergraph generate_quickstart

# And more...
```

## Integration with Cursor

### Installation

1. **Install Cursor** from [cursor.sh](https://cursor.sh)

2. **Add MCP Server to Cursor:**
   - Open Cursor Settings
   - Navigate to "Extensions" � "MCP"
   - Add new server configuration:
     ```json
     {
       "name": "hypergraph",
       "command": "node",
       "args": ["/path/to/hypergraph-mcp-server/dist/index.js"]
     }
     ```

3. **Enable the Server:**
   - Toggle the Hypergraph MCP server to "enabled"
   - Restart Cursor

### Usage in Cursor

In Cursor, you can access Hypergraph tools through the MCP panel or by using the `@hypergraph` prefix in your prompts:

```
@hypergraph help me create a new space for my project
@hypergraph generate a schema for user profiles
@hypergraph show me how to implement authentication
```

## Available Tools

### 1. Space Management (`generate_space`)
Create and configure Hypergraph spaces with proper access controls.

**Parameters:**
- `spaceName`: Name of the space
- `spaceType`: public, private, or invite-only
- `framework`: react, typescript, or vanilla-js

### 2. Schema Definition (`create_schema`)
Generate entity schemas with validation and relationships.

**Parameters:**
- `entityName`: Name of the entity
- `fields`: Array of field definitions
- `relationships`: Entity relationships
- `includeValidation`: Add validation rules

### 3. Query Generation (`create_query`)
Build queries for data retrieval with filtering and pagination.

**Parameters:**
- `entityType`: Target entity type
- `queryType`: all, filtered, or paginated
- `filters`: Query filters
- `framework`: Implementation framework

### 4. Authentication Setup (`setup_auth`)
Configure authentication providers and user management.

**Parameters:**
- `authProvider`: geo-connect or custom
- `includeRegistration`: Include user registration
- `framework`: Implementation framework

### 5. Knowledge Graph Mapping (`create_mapping`)
Map private schemas to public Knowledge Graph properties.

**Parameters:**
- `entityType`: Entity to map
- `schemaOrg`: Use Schema.org mappings
- `customMappings`: Custom property mappings

### 6. Publishing Workflows (`create_publishing_flow`)
Implement data publishing to public Knowledge Graph.

**Parameters:**
- `entityType`: Entity type to publish
- `publishingStrategy`: immediate, batch, scheduled, or conditional
- `includeValidation`: Add validation before publishing

### 7. React Providers (`setup_providers`)
Generate React context providers and custom hooks.

**Parameters:**
- `providerType`: app, space, or both
- `includeAuth`: Include authentication provider
- `includeCustomHooks`: Generate custom hooks

### 8. Documentation (`get_documentation`)
Access comprehensive documentation and examples.

**Parameters:**
- `topic`: Documentation topic
- `format`: markdown, text, or code-examples
- `language`: typescript, javascript, react, or all

### 9. Quickstart Templates (`generate_quickstart`)
Generate complete project templates with examples.

**Parameters:**
- `projectName`: Project name
- `framework`: react, nextjs, vanilla-ts, or express-api
- `entityTypes`: Entity types to include
- `includeAuth`: Include authentication setup

### 10. Advanced Configuration (`advanced_setup`)
Configure advanced features like local servers and performance optimization.

**Parameters:**
- `setupType`: local-server, custom-auth, performance-optimization, etc.
- `complexity`: intermediate, advanced, or expert
- `framework`: node, docker, kubernetes, or serverless

## Knowledge Base

The server is powered by a comprehensive knowledge base containing 56 scraped pages from the official Hypergraph documentation, including:

- Core concepts and architecture
- Authentication and security
- Data modeling and schemas
- Query patterns and optimization
- Publishing workflows
- React integration patterns
- Performance best practices
- Troubleshooting guides

## Development

### Project Structure
```
hypergraph-mcp-server/
   src/
      index.ts          # Main server implementation
      tools/            # Tool implementations
          spaces.ts     # Space management
          schema.ts     # Schema definition
          queries.ts    # Query generation
          auth.ts       # Authentication
          mapping.ts    # Knowledge Graph mapping
          publishing.ts # Publishing workflows
          providers.ts  # React providers
          docs.ts       # Documentation
          quickstart.ts # Quickstart templates
          advanced.ts   # Advanced configurations
   knowledge/            # Knowledge base
      hypergraph_knowledge_base.md
      hypergraph_data.json
   package.json
   tsconfig.json
   README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues related to:
- **Hypergraph Framework**: Visit [hypergraph.dev](https://hypergraph.dev)
- **MCP Server**: Create an issue in this repository
- **Claude Code**: Visit [Claude Code documentation](https://docs.anthropic.com/claude-code)
- **Cursor**: Visit [Cursor documentation](https://cursor.sh/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details.