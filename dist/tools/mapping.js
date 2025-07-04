export function createMappingHelperTool() {
    return {
        name: 'create_mapping',
        description: 'Generate Hypergraph mapping configuration for connecting to the public Knowledge Graph',
        inputSchema: {
            type: 'object',
            properties: {
                entities: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            typeId: { type: 'string' },
                            properties: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        propertyId: { type: 'string' }
                                    }
                                }
                            },
                            relations: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        relationId: { type: 'string' }
                                    }
                                },
                                default: []
                            }
                        },
                        required: ['name', 'typeId', 'properties']
                    },
                    description: 'Entities to map to the Knowledge Graph'
                },
                generateExample: {
                    type: 'boolean',
                    description: 'Generate usage examples',
                    default: true
                },
                includeValidation: {
                    type: 'boolean',
                    description: 'Include mapping validation',
                    default: true
                }
            },
            required: ['entities'],
        },
    };
}
export async function handleCreateMapping(args) {
    const { entities, generateExample, includeValidation } = args;
    const mappingCode = generateMappingCode(entities, generateExample, includeValidation);
    return {
        content: [
            {
                type: 'text',
                text: mappingCode,
            },
        ],
    };
}
function generateMappingCode(entities, generateExample, includeValidation) {
    let mappingCode = `// Hypergraph Mapping Configuration\n`;
    mappingCode += `// Maps your schema to the public Knowledge Graph\n\n`;
    mappingCode += `import { Mapping } from '@graphprotocol/hypergraph';\n`;
    // Import entity types
    const entityNames = entities.map(e => e.name);
    mappingCode += `import { ${entityNames.join(', ')} } from './schema';\n\n`;
    // Generate the mapping object
    mappingCode += `export const mapping: Mapping = {\n`;
    entities.forEach((entity, entityIndex) => {
        const comma = entityIndex < entities.length - 1 ? ',' : '';
        mappingCode += `  ${entity.name}: {\n`;
        mappingCode += `    typeId: '${entity.typeId}',\n`;
        // Properties mapping
        mappingCode += `    properties: {\n`;
        entity.properties.forEach((prop, propIndex) => {
            const propComma = propIndex < entity.properties.length - 1 ? ',' : '';
            mappingCode += `      ${prop.name}: '${prop.propertyId}'${propComma}\n`;
        });
        mappingCode += `    }`;
        // Relations mapping (if any)
        if (entity.relations && entity.relations.length > 0) {
            mappingCode += `,\n    relations: {\n`;
            entity.relations.forEach((rel, relIndex) => {
                const relComma = relIndex < entity.relations.length - 1 ? ',' : '';
                mappingCode += `      ${rel.name}: '${rel.relationId}'${relComma}\n`;
            });
            mappingCode += `    }\n`;
        }
        else {
            mappingCode += `\n`;
        }
        mappingCode += `  }${comma}\n`;
    });
    mappingCode += `};\n\n`;
    // Add type definitions for better TypeScript support
    mappingCode += `// Type definitions for the mapping\nexport interface MappingConfig {\n`;
    entities.forEach(entity => {
        mappingCode += `  ${entity.name}: {\n`;
        mappingCode += `    typeId: string;\n`;
        mappingCode += `    properties: {\n`;
        entity.properties.forEach((prop) => {
            mappingCode += `      ${prop.name}: string;\n`;
        });
        mappingCode += `    };\n`;
        if (entity.relations && entity.relations.length > 0) {
            mappingCode += `    relations: {\n`;
            entity.relations.forEach((rel) => {
                mappingCode += `      ${rel.name}: string;\n`;
            });
            mappingCode += `    };\n`;
        }
        mappingCode += `  };\n`;
    });
    mappingCode += `}\n\n`;
    if (includeValidation) {
        mappingCode += generateMappingValidation(entities);
    }
    if (generateExample) {
        mappingCode += generateMappingExample(entities);
    }
    return mappingCode;
}
function generateMappingValidation(entities) {
    let validationCode = `// Mapping validation functions\n\n`;
    validationCode += `export function validateMapping(mapping: Mapping): { isValid: boolean; errors: string[] } {\n`;
    validationCode += `  const errors: string[] = [];\n\n`;
    entities.forEach(entity => {
        validationCode += `  // Validate ${entity.name} mapping\n`;
        validationCode += `  if (!mapping.${entity.name}) {\n`;
        validationCode += `    errors.push('Missing mapping for ${entity.name}');\n`;
        validationCode += `  } else {\n`;
        validationCode += `    if (!mapping.${entity.name}.typeId) {\n`;
        validationCode += `      errors.push('Missing typeId for ${entity.name}');\n`;
        validationCode += `    }\n\n`;
        validationCode += `    if (!mapping.${entity.name}.properties) {\n`;
        validationCode += `      errors.push('Missing properties mapping for ${entity.name}');\n`;
        validationCode += `    } else {\n`;
        entity.properties.forEach((prop) => {
            validationCode += `      if (!mapping.${entity.name}.properties.${prop.name}) {\n`;
            validationCode += `        errors.push('Missing property mapping for ${entity.name}.${prop.name}');\n`;
            validationCode += `      }\n`;
        });
        validationCode += `    }\n`;
        if (entity.relations && entity.relations.length > 0) {
            validationCode += `\n    if (mapping.${entity.name}.relations) {\n`;
            entity.relations.forEach((rel) => {
                validationCode += `      if (!mapping.${entity.name}.relations.${rel.name}) {\n`;
                validationCode += `        errors.push('Missing relation mapping for ${entity.name}.${rel.name}');\n`;
                validationCode += `      }\n`;
            });
            validationCode += `    }\n`;
        }
        validationCode += `  }\n\n`;
    });
    validationCode += `  return {\n`;
    validationCode += `    isValid: errors.length === 0,\n`;
    validationCode += `    errors\n`;
    validationCode += `  };\n`;
    validationCode += `}\n\n`;
    // Property ID validation
    validationCode += `export function validatePropertyIds(mapping: Mapping): { isValid: boolean; warnings: string[] } {\n`;
    validationCode += `  const warnings: string[] = [];\n\n`;
    entities.forEach(entity => {
        entity.properties.forEach((prop) => {
            validationCode += `  // Validate ${entity.name}.${prop.name} property ID format\n`;
            validationCode += `  if (mapping.${entity.name}?.properties?.${prop.name}) {\n`;
            validationCode += `    const propertyId = mapping.${entity.name}.properties.${prop.name};\n`;
            validationCode += `    if (!propertyId.startsWith('http://') && !propertyId.startsWith('https://')) {\n`;
            validationCode += `      warnings.push('Property ID for ${entity.name}.${prop.name} should be a valid URI: ' + propertyId);\n`;
            validationCode += `    }\n`;
            validationCode += `  }\n\n`;
        });
    });
    validationCode += `  return {\n`;
    validationCode += `    isValid: warnings.length === 0,\n`;
    validationCode += `    warnings\n`;
    validationCode += `  };\n`;
    validationCode += `}\n\n`;
    return validationCode;
}
function generateMappingExample(entities) {
    let exampleCode = `// Usage Example\n\n`;
    exampleCode += `// Using the mapping with HypergraphAppProvider\nimport { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';\nimport { mapping } from './mapping';\n\n`;
    exampleCode += `function App() {\n`;
    exampleCode += `  return (\n`;
    exampleCode += `    <HypergraphAppProvider mapping={mapping}>\n`;
    exampleCode += `      <YourAppComponents />\n`;
    exampleCode += `    </HypergraphAppProvider>\n`;
    exampleCode += `  );\n`;
    exampleCode += `}\n\n`;
    // Show how to publish data using the mapping
    const firstEntity = entities[0];
    if (firstEntity) {
        exampleCode += `// Publishing data to the Knowledge Graph\nimport { preparePublish, publishOps } from '@graphprotocol/hypergraph';\n\n`;
        exampleCode += `async function publishExample() {\n`;
        exampleCode += `  // Create your entity data\n`;
        exampleCode += `  const ${firstEntity.name.toLowerCase()}Data = {\n`;
        firstEntity.properties.forEach((prop, index) => {
            const comma = index < firstEntity.properties.length - 1 ? ',' : '';
            let exampleValue = `'example ${prop.name}'`;
            // Generate more realistic example values based on property names
            if (prop.name.toLowerCase().includes('email')) {
                exampleValue = "'user@example.com'";
            }
            else if (prop.name.toLowerCase().includes('name')) {
                exampleValue = `'Example ${firstEntity.name}'`;
            }
            else if (prop.name.toLowerCase().includes('url')) {
                exampleValue = "'https://example.com'";
            }
            else if (prop.name.toLowerCase().includes('date')) {
                exampleValue = "new Date().toISOString()";
            }
            exampleCode += `    ${prop.name}: ${exampleValue}${comma}\n`;
        });
        exampleCode += `  };\n\n`;
        exampleCode += `  // Prepare operations for publishing\n`;
        exampleCode += `  const ops = preparePublish(${firstEntity.name}, ${firstEntity.name.toLowerCase()}Data, mapping);\n\n`;
        exampleCode += `  // Publish to the Knowledge Graph\n`;
        exampleCode += `  await publishOps(ops);\n\n`;
        exampleCode += `  console.log('${firstEntity.name} published to Knowledge Graph!');\n`;
        exampleCode += `}\n\n`;
    }
    // Show how to query using the mapping
    exampleCode += `// Querying data from the Knowledge Graph\nimport { useQuery } from '@graphprotocol/hypergraph-react';\n\n`;
    entities.forEach(entity => {
        exampleCode += `function ${entity.name}List() {\n`;
        exampleCode += `  const { data: ${entity.name.toLowerCase()}s, loading, error } = useQuery(${entity.name}, {\n`;
        exampleCode += `    mode: 'public' // Query from the public Knowledge Graph\n`;
        exampleCode += `  });\n\n`;
        exampleCode += `  if (loading) return <div>Loading ${entity.name.toLowerCase()}s...</div>;\n`;
        exampleCode += `  if (error) return <div>Error: {error.message}</div>;\n\n`;
        exampleCode += `  return (\n`;
        exampleCode += `    <div>\n`;
        exampleCode += `      <h2>Public ${entity.name}s</h2>\n`;
        exampleCode += `      {${entity.name.toLowerCase()}s?.map((${entity.name.toLowerCase()}) => (\n`;
        exampleCode += `        <div key={${entity.name.toLowerCase()}.id}>\n`;
        // Show first few properties
        const propsToShow = entity.properties.slice(0, 3);
        propsToShow.forEach((prop) => {
            exampleCode += `          <p><strong>${prop.name}:</strong> {${entity.name.toLowerCase()}.${prop.name}}</p>\n`;
        });
        exampleCode += `        </div>\n`;
        exampleCode += `      ))}\n`;
        exampleCode += `    </div>\n`;
        exampleCode += `  );\n`;
        exampleCode += `}\n\n`;
    });
    // Advanced mapping features
    exampleCode += `// Advanced Mapping Features\n\n`;
    exampleCode += `// Custom property transformations\nexport const advancedMapping: Mapping = {\n`;
    if (entities[0]) {
        const entity = entities[0];
        exampleCode += `  ${entity.name}: {\n`;
        exampleCode += `    typeId: '${entity.typeId}',\n`;
        exampleCode += `    properties: {\n`;
        entity.properties.forEach((prop, index) => {
            const comma = index < entity.properties.length - 1 ? ',' : '';
            exampleCode += `      ${prop.name}: '${prop.propertyId}'${comma}\n`;
        });
        exampleCode += `    },\n`;
        exampleCode += `    // Optional: Custom transformations\n`;
        exampleCode += `    transforms: {\n`;
        if (entity.properties.some((p) => p.name.toLowerCase().includes('date'))) {
            const dateProp = entity.properties.find((p) => p.name.toLowerCase().includes('date'));
            if (dateProp) {
                exampleCode += `      ${dateProp.name}: (value) => new Date(value).toISOString(),\n`;
            }
        }
        exampleCode += `      // Add custom transformations here\n`;
        exampleCode += `    }\n`;
        exampleCode += `  }\n`;
    }
    exampleCode += `};\n\n`;
    // Mapping testing
    exampleCode += `// Testing your mapping\nfunction testMapping() {\n`;
    exampleCode += `  const validationResult = validateMapping(mapping);\n`;
    exampleCode += `  \n`;
    exampleCode += `  if (!validationResult.isValid) {\n`;
    exampleCode += `    console.error('Mapping validation failed:');\n`;
    exampleCode += `    validationResult.errors.forEach(error => console.error('- ' + error));\n`;
    exampleCode += `    return false;\n`;
    exampleCode += `  }\n\n`;
    exampleCode += `  const propertyValidation = validatePropertyIds(mapping);\n`;
    exampleCode += `  \n`;
    exampleCode += `  if (!propertyValidation.isValid) {\n`;
    exampleCode += `    console.warn('Property ID warnings:');\n`;
    exampleCode += `    propertyValidation.warnings.forEach(warning => console.warn('- ' + warning));\n`;
    exampleCode += `  }\n\n`;
    exampleCode += `  console.log('Mapping validation passed!');\n`;
    exampleCode += `  return true;\n`;
    exampleCode += `}\n\n`;
    exampleCode += `// Run validation\ntestMapping();\n`;
    return exampleCode;
}
//# sourceMappingURL=mapping.js.map