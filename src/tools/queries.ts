export function createQueryHelperTool() {
  return {
    name: 'generate_query',
    description: 'Generate Hypergraph query code for public and private data',
    inputSchema: {
      type: 'object',
      properties: {
        entityName: {
          type: 'string',
          description: 'Entity to query (e.g., Event, User, Product)'
        },
        queryType: {
          type: 'string',
          enum: ['private', 'public', 'both'],
          description: 'Type of data to query',
          default: 'private'
        },
        includeRelations: {
          type: 'boolean',
          description: 'Include related entities in query',
          default: false
        },
        filters: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              property: { type: 'string' },
              operator: { 
                type: 'string',
                enum: ['is', 'not', 'contains', 'startsWith', 'endsWith', 'gt', 'gte', 'lt', 'lte']
              },
              value: { type: 'string' }
            },
            required: ['property', 'operator', 'value']
          },
          description: 'Query filters',
          default: []
        },
        spaceId: {
          type: 'string',
          description: 'Specific space ID to query from (optional)'
        },
        framework: {
          type: 'string',
          enum: ['react', 'typescript', 'vanilla-js'],
          description: 'Framework for the implementation',
          default: 'react'
        },
        includeExamples: {
          type: 'boolean',
          description: 'Include usage examples',
          default: true
        }
      },
      required: ['entityName'],
    },
  };
}

export async function handleGenerateQuery(args: any) {
  const { entityName, queryType, includeRelations, filters, spaceId, framework, includeExamples } = args;
  
  const queryCode = generateQueryCode(entityName, queryType, includeRelations, filters, spaceId, framework, includeExamples);

  return {
    content: [
      {
        type: 'text',
        text: queryCode,
      },
    ],
  };
}

function generateQueryCode(
  entityName: string,
  queryType: string,
  includeRelations: boolean,
  filters: any[],
  spaceId: string,
  framework: string,
  includeExamples: boolean
) {
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  
  let queryCode = `// Hypergraph Query for ${capitalizedName}\n`;
  
  if (framework === 'react') {
    queryCode += generateReactQueryCode(capitalizedName, queryType, includeRelations, filters, spaceId, includeExamples);
  } else if (framework === 'typescript') {
    queryCode += generateTypescriptQueryCode(capitalizedName, queryType, includeRelations, filters, spaceId, includeExamples);
  } else {
    queryCode += generateVanillaJSQueryCode(capitalizedName, queryType, includeRelations, filters, spaceId, includeExamples);
  }

  return queryCode;
}

function generateReactQueryCode(
  entityName: string,
  queryType: string,
  includeRelations: boolean,
  filters: any[],
  spaceId: string,
  includeExamples: boolean
) {
  let code = `\nimport { useQuery } from '@graphprotocol/hypergraph-react';\nimport { ${entityName} } from './schema';\n\n`;

  if (queryType === 'both') {
    // Generate both private and public queries
    code += `// Component for querying both private and public ${entityName} data\n`;
    code += `export function ${entityName}QueryComponent() {\n`;
    
    // Private query
    code += generateSingleQuery('private', entityName, includeRelations, filters, spaceId, '  ');
    
    // Public query
    code += generateSingleQuery('public', entityName, includeRelations, filters, spaceId, '  ');
    
    code += `\n  return (\n`;
    code += `    <div className="${entityName.toLowerCase()}-queries">\n`;
    code += `      <div className="private-data">\n`;
    code += `        <h3>Private ${entityName}s</h3>\n`;
    code += `        {privateLoading && <p>Loading private data...</p>}\n`;
    code += `        {privateError && <p>Error loading private data: {privateError.message}</p>}\n`;
    code += `        {privateData?.map((item) => (\n`;
    code += `          <div key={item.id} className="private-item">\n`;
    code += `            {/* Render private ${entityName.toLowerCase()} */}\n`;
    code += `            <pre>{JSON.stringify(item, null, 2)}</pre>\n`;
    code += `          </div>\n`;
    code += `        ))}\n`;
    code += `      </div>\n\n`;
    code += `      <div className="public-data">\n`;
    code += `        <h3>Public ${entityName}s</h3>\n`;
    code += `        {publicLoading && <p>Loading public data...</p>}\n`;
    code += `        {publicError && <p>Error loading public data: {publicError.message}</p>}\n`;
    code += `        {publicData?.map((item) => (\n`;
    code += `          <div key={item.id} className="public-item">\n`;
    code += `            {/* Render public ${entityName.toLowerCase()} */}\n`;
    code += `            <pre>{JSON.stringify(item, null, 2)}</pre>\n`;
    code += `          </div>\n`;
    code += `        ))}\n`;
    code += `      </div>\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;
  } else {
    // Single query type
    code += `// Component for querying ${queryType} ${entityName} data\n`;
    code += `export function ${entityName}${queryType.charAt(0).toUpperCase() + queryType.slice(1)}QueryComponent() {\n`;
    
    code += generateSingleQuery(queryType, entityName, includeRelations, filters, spaceId, '  ');
    
    code += `\n  return (\n`;
    code += `    <div className="${entityName.toLowerCase()}-${queryType}-query">\n`;
    code += `      <h3>${queryType.charAt(0).toUpperCase() + queryType.slice(1)} ${entityName}s</h3>\n`;
    code += `      {loading && <p>Loading...</p>}\n`;
    code += `      {error && <p>Error: {error.message}</p>}\n`;
    code += `      {data?.map((item) => (\n`;
    code += `        <div key={item.id} className="${queryType}-item">\n`;
    code += `          {/* Render ${entityName.toLowerCase()} data */}\n`;
    code += `          <pre>{JSON.stringify(item, null, 2)}</pre>\n`;
    code += `        </div>\n`;
    code += `      ))}\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;
  }

  if (includeExamples) {
    code += generateReactExamples(entityName, queryType, includeRelations, filters);
  }

  return code;
}

function generateSingleQuery(
  mode: string,
  entityName: string,
  includeRelations: boolean,
  filters: any[],
  spaceId: string,
  indent: string
) {
  const prefix = mode === 'both' ? mode : '';
  const variablePrefix = prefix ? `${prefix}` : '';
  
  let queryOptions = `{ mode: '${mode}'`;
  
  if (includeRelations) {
    queryOptions += `, include: { relations: true }`;
  }
  
  if (spaceId) {
    queryOptions += `, space: '${spaceId}'`;
  }
  
  if (filters.length > 0) {
    queryOptions += `, filter: {\n`;
    filters.forEach((filter, index) => {
      const comma = index < filters.length - 1 ? ',' : '';
      queryOptions += `${indent}    ${filter.property}: { ${filter.operator}: ${getFilterValue(filter.value, filter.operator)} }${comma}\n`;
    });
    queryOptions += `${indent}  }`;
  }
  
  queryOptions += ` }`;

  return `${indent}const { data: ${variablePrefix}Data, loading: ${variablePrefix}Loading, error: ${variablePrefix}Error } = useQuery(\n${indent}  ${entityName},\n${indent}  ${queryOptions}\n${indent});\n`;
}

function getFilterValue(value: string, operator: string) {
  // If it's a number, don't quote it
  if (!isNaN(Number(value))) {
    return value;
  }
  
  // If it's a boolean, don't quote it
  if (value === 'true' || value === 'false') {
    return value;
  }
  
  // Quote string values
  return `'${value}'`;
}

function generateTypescriptQueryCode(
  entityName: string,
  queryType: string,
  includeRelations: boolean,
  filters: any[],
  spaceId: string,
  includeExamples: boolean
) {
  let code = `\nimport { HypergraphApp } from '@graphprotocol/hypergraph';\nimport { ${entityName} } from './schema';\n\n`;

  code += `interface QueryOptions {\n`;
  code += `  mode: 'private' | 'public';\n`;
  code += `  include?: { relations?: boolean };\n`;
  code += `  space?: string;\n`;
  code += `  filter?: Record<string, any>;\n`;
  code += `}\n\n`;

  code += `export class ${entityName}QueryManager {\n`;
  code += `  private hypergraphApp: HypergraphApp;\n\n`;
  
  code += `  constructor(hypergraphApp: HypergraphApp) {\n`;
  code += `    this.hypergraphApp = hypergraphApp;\n`;
  code += `  }\n\n`;

  if (queryType === 'both') {
    code += generateTypescriptMethod('private', entityName, includeRelations, filters, spaceId);
    code += generateTypescriptMethod('public', entityName, includeRelations, filters, spaceId);
    
    code += `  async queryBoth(): Promise<{ private: any[]; public: any[] }> {\n`;
    code += `    const [privateData, publicData] = await Promise.all([\n`;
    code += `      this.queryPrivate(),\n`;
    code += `      this.queryPublic()\n`;
    code += `    ]);\n\n`;
    code += `    return { private: privateData, public: publicData };\n`;
    code += `  }\n`;
  } else {
    code += generateTypescriptMethod(queryType, entityName, includeRelations, filters, spaceId);
  }

  code += `}\n\n`;

  if (includeExamples) {
    code += generateTypescriptExamples(entityName, queryType);
  }

  return code;
}

function generateTypescriptMethod(
  mode: string,
  entityName: string,
  includeRelations: boolean,
  filters: any[],
  spaceId: string
) {
  let method = `  async query${mode.charAt(0).toUpperCase() + mode.slice(1)}(): Promise<any[]> {\n`;
  method += `    try {\n`;
  method += `      const options: QueryOptions = {\n`;
  method += `        mode: '${mode}'`;
  
  if (includeRelations) {
    method += `,\n        include: { relations: true }`;
  }
  
  if (spaceId) {
    method += `,\n        space: '${spaceId}'`;
  }
  
  if (filters.length > 0) {
    method += `,\n        filter: {\n`;
    filters.forEach((filter, index) => {
      const comma = index < filters.length - 1 ? ',' : '';
      method += `          ${filter.property}: { ${filter.operator}: ${getFilterValue(filter.value, filter.operator)} }${comma}\n`;
    });
    method += `        }`;
  }
  
  method += `\n      };\n\n`;
  method += `      const result = await this.hypergraphApp.query(${entityName}, options);\n`;
  method += `      return result;\n`;
  method += `    } catch (error) {\n`;
  method += `      console.error('Error querying ${mode} ${entityName}:', error);\n`;
  method += `      throw error;\n`;
  method += `    }\n`;
  method += `  }\n\n`;
  
  return method;
}

function generateVanillaJSQueryCode(
  entityName: string,
  queryType: string,
  includeRelations: boolean,
  filters: any[],
  spaceId: string,
  includeExamples: boolean
) {
  let code = `\n// Vanilla JavaScript Query Manager for ${entityName}\n\n`;

  code += `class ${entityName}QueryManager {\n`;
  code += `  constructor(hypergraphApp) {\n`;
  code += `    this.hypergraphApp = hypergraphApp;\n`;
  code += `  }\n\n`;

  if (queryType === 'both') {
    code += generateJSMethod('private', entityName, includeRelations, filters, spaceId);
    code += generateJSMethod('public', entityName, includeRelations, filters, spaceId);
    
    code += `  async queryBoth() {\n`;
    code += `    try {\n`;
    code += `      const [privateData, publicData] = await Promise.all([\n`;
    code += `        this.queryPrivate(),\n`;
    code += `        this.queryPublic()\n`;
    code += `      ]);\n\n`;
    code += `      return { private: privateData, public: publicData };\n`;
    code += `    } catch (error) {\n`;
    code += `      console.error('Error querying both:', error);\n`;
    code += `      throw error;\n`;
    code += `    }\n`;
    code += `  }\n`;
  } else {
    code += generateJSMethod(queryType, entityName, includeRelations, filters, spaceId);
  }

  code += `}\n\n`;

  if (includeExamples) {
    code += generateVanillaJSExamples(entityName, queryType);
  }

  return code;
}

function generateJSMethod(
  mode: string,
  entityName: string,
  includeRelations: boolean,
  filters: any[],
  spaceId: string
) {
  let method = `  async query${mode.charAt(0).toUpperCase() + mode.slice(1)}() {\n`;
  method += `    try {\n`;
  method += `      const options = {\n`;
  method += `        mode: '${mode}'`;
  
  if (includeRelations) {
    method += `,\n        include: { relations: true }`;
  }
  
  if (spaceId) {
    method += `,\n        space: '${spaceId}'`;
  }
  
  if (filters.length > 0) {
    method += `,\n        filter: {\n`;
    filters.forEach((filter, index) => {
      const comma = index < filters.length - 1 ? ',' : '';
      method += `          ${filter.property}: { ${filter.operator}: ${getFilterValue(filter.value, filter.operator)} }${comma}\n`;
    });
    method += `        }`;
  }
  
  method += `\n      };\n\n`;
  method += `      const result = await this.hypergraphApp.query(${entityName}, options);\n`;
  method += `      return result;\n`;
  method += `    } catch (error) {\n`;
  method += `      console.error('Error querying ${mode} ${entityName}:', error);\n`;
  method += `      throw error;\n`;
  method += `    }\n`;
  method += `  }\n\n`;
  
  return method;
}

function generateReactExamples(entityName: string, queryType: string, includeRelations: boolean, filters: any[]) {
  let examples = `// Advanced Query Examples\n\n`;
  
  examples += `// Custom hook for ${entityName} queries\nexport function use${entityName}Query(options = {}) {\n`;
  examples += `  const defaultOptions = {\n`;
  examples += `    mode: '${queryType === 'both' ? 'private' : queryType}',\n`;
  examples += `    include: { relations: ${includeRelations} },\n`;
  examples += `    ...options\n`;
  examples += `  };\n\n`;
  examples += `  return useQuery(${entityName}, defaultOptions);\n`;
  examples += `}\n\n`;

  examples += `// Filtered query example\nexport function Filtered${entityName}Component() {\n`;
  examples += `  const [searchTerm, setSearchTerm] = useState('');\n`;
  examples += `  \n`;
  examples += `  const { data, loading, error } = useQuery(${entityName}, {\n`;
  examples += `    mode: 'private',\n`;
  examples += `    filter: searchTerm ? {\n`;
  examples += `      name: { contains: searchTerm }\n`;
  examples += `    } : undefined\n`;
  examples += `  });\n\n`;
  examples += `  return (\n`;
  examples += `    <div>\n`;
  examples += `      <input\n`;
  examples += `        type="text"\n`;
  examples += `        placeholder="Search ${entityName.toLowerCase()}s..."\n`;
  examples += `        value={searchTerm}\n`;
  examples += `        onChange={(e) => setSearchTerm(e.target.value)}\n`;
  examples += `      />\n`;
  examples += `      \n`;
  examples += `      {loading && <p>Loading...</p>}\n`;
  examples += `      {error && <p>Error: {error.message}</p>}\n`;
  examples += `      {data?.map((item) => (\n`;
  examples += `        <div key={item.id}>\n`;
  examples += `          {/* Render filtered ${entityName.toLowerCase()} */}\n`;
  examples += `        </div>\n`;
  examples += `      ))}\n`;
  examples += `    </div>\n`;
  examples += `  );\n`;
  examples += `}\n`;

  return examples;
}

function generateTypescriptExamples(entityName: string, queryType: string) {
  let examples = `// Usage Examples\n\n`;
  
  examples += `async function example() {\n`;
  examples += `  const hypergraphApp = new HypergraphApp(config);\n`;
  examples += `  const queryManager = new ${entityName}QueryManager(hypergraphApp);\n\n`;
  
  if (queryType === 'both') {
    examples += `  // Query both private and public data\n`;
    examples += `  const { private: privateData, public: publicData } = await queryManager.queryBoth();\n`;
    examples += `  console.log('Private ${entityName}s:', privateData);\n`;
    examples += `  console.log('Public ${entityName}s:', publicData);\n`;
  } else {
    examples += `  // Query ${queryType} data\n`;
    examples += `  const data = await queryManager.query${queryType.charAt(0).toUpperCase() + queryType.slice(1)}();\n`;
    examples += `  console.log('${queryType.charAt(0).toUpperCase() + queryType.slice(1)} ${entityName}s:', data);\n`;
  }
  
  examples += `}\n`;

  return examples;
}

function generateVanillaJSExamples(entityName: string, queryType: string) {
  let examples = `// Usage Examples\n\n`;
  
  examples += `// Initialize and use\nconst hypergraphApp = new HypergraphApp(config);\n`;
  examples += `const queryManager = new ${entityName}QueryManager(hypergraphApp);\n\n`;
  
  if (queryType === 'both') {
    examples += `// Query both private and public data\n`;
    examples += `queryManager.queryBoth()\n`;
    examples += `  .then(({ private: privateData, public: publicData }) => {\n`;
    examples += `    console.log('Private ${entityName}s:', privateData);\n`;
    examples += `    console.log('Public ${entityName}s:', publicData);\n`;
    examples += `  })\n`;
    examples += `  .catch(error => console.error('Query error:', error));\n`;
  } else {
    examples += `// Query ${queryType} data\n`;
    examples += `queryManager.query${queryType.charAt(0).toUpperCase() + queryType.slice(1)}()\n`;
    examples += `  .then(data => {\n`;
    examples += `    console.log('${queryType.charAt(0).toUpperCase() + queryType.slice(1)} ${entityName}s:', data);\n`;
    examples += `    // Process data here\n`;
    examples += `  })\n`;
    examples += `  .catch(error => console.error('Query error:', error));\n`;
  }

  return examples;
}