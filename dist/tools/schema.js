export function createSchemaHelperTool() {
    return {
        name: 'create_schema',
        description: 'Generate Hypergraph schema definitions with entities, types, and relations',
        inputSchema: {
            type: 'object',
            properties: {
                entityName: {
                    type: 'string',
                    description: 'Name of the main entity (e.g., Event, User, Product)'
                },
                properties: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            type: {
                                type: 'string',
                                enum: ['Text', 'Number', 'Checkbox', 'Date', 'Email', 'URL', 'JSON']
                            },
                            required: { type: 'boolean', default: false }
                        },
                        required: ['name', 'type']
                    },
                    description: 'Entity properties with their types'
                },
                relations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            target: { type: 'string' },
                            type: {
                                type: 'string',
                                enum: ['one-to-one', 'one-to-many', 'many-to-many']
                            }
                        },
                        required: ['name', 'target', 'type']
                    },
                    description: 'Entity relations to other entities',
                    default: []
                },
                includeValidation: {
                    type: 'boolean',
                    description: 'Include property validation',
                    default: true
                },
                generateExample: {
                    type: 'boolean',
                    description: 'Generate usage examples',
                    default: true
                }
            },
            required: ['entityName', 'properties'],
        },
    };
}
export async function handleCreateSchema(args) {
    const { entityName, properties, relations, includeValidation, generateExample } = args;
    const schemaCode = generateSchemaCode(entityName, properties, relations, includeValidation, generateExample);
    return {
        content: [
            {
                type: 'text',
                text: schemaCode,
            },
        ],
    };
}
function generateSchemaCode(entityName, properties, relations = [], includeValidation = true, generateExample = true) {
    const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    let schemaCode = `// Hypergraph Schema: ${capitalizedName}
import { Entity, Type } from '@graphprotocol/hypergraph';

export class ${capitalizedName} extends Entity.Class<${capitalizedName}>('${capitalizedName}')({
`;
    // Add properties
    properties.forEach((prop, index) => {
        const comma = index < properties.length - 1 || relations.length > 0 ? ',' : '';
        if (includeValidation && prop.type === 'Email') {
            schemaCode += `  ${prop.name}: Type.Text.email()${comma} // Email validation\n`;
        }
        else if (includeValidation && prop.type === 'URL') {
            schemaCode += `  ${prop.name}: Type.Text.url()${comma} // URL validation\n`;
        }
        else if (prop.type === 'Number') {
            schemaCode += `  ${prop.name}: Type.Number${comma}\n`;
        }
        else if (prop.type === 'Checkbox') {
            schemaCode += `  ${prop.name}: Type.Checkbox${comma}\n`;
        }
        else if (prop.type === 'Date') {
            schemaCode += `  ${prop.name}: Type.Date${comma}\n`;
        }
        else if (prop.type === 'JSON') {
            schemaCode += `  ${prop.name}: Type.JSON${comma}\n`;
        }
        else {
            schemaCode += `  ${prop.name}: Type.Text${comma}\n`;
        }
    });
    // Add relations
    relations.forEach((relation, index) => {
        const comma = index < relations.length - 1 ? ',' : '';
        if (relation.type === 'one-to-one') {
            schemaCode += `  ${relation.name}: Type.Relation(${relation.target})${comma} // One-to-one relation\n`;
        }
        else if (relation.type === 'one-to-many') {
            schemaCode += `  ${relation.name}: Type.Relation.List(${relation.target})${comma} // One-to-many relation\n`;
        }
        else if (relation.type === 'many-to-many') {
            schemaCode += `  ${relation.name}: Type.Relation.List(${relation.target})${comma} // Many-to-many relation\n`;
        }
    });
    schemaCode += `}) {}\n\n`;
    // Add type definitions
    schemaCode += `// TypeScript interface for ${capitalizedName}\nexport interface I${capitalizedName} {\n`;
    properties.forEach((prop) => {
        const typeMapping = {
            'Text': 'string',
            'Number': 'number',
            'Checkbox': 'boolean',
            'Date': 'Date',
            'Email': 'string',
            'URL': 'string',
            'JSON': 'any'
        };
        const tsType = typeMapping[prop.type] || 'string';
        const optional = prop.required ? '' : '?';
        schemaCode += `  ${prop.name}${optional}: ${tsType};\n`;
    });
    relations.forEach(relation => {
        if (relation.type === 'one-to-one') {
            schemaCode += `  ${relation.name}?: ${relation.target};\n`;
        }
        else {
            schemaCode += `  ${relation.name}?: ${relation.target}[];\n`;
        }
    });
    schemaCode += `}\n\n`;
    if (generateExample) {
        schemaCode += generateExampleUsage(capitalizedName, properties, relations);
    }
    // Add validation helpers if requested
    if (includeValidation) {
        schemaCode += generateValidationHelpers(capitalizedName, properties);
    }
    return schemaCode;
}
function generateExampleUsage(entityName, properties, relations) {
    let exampleCode = `// Example usage of ${entityName} schema\n\n`;
    exampleCode += `// Creating a new ${entityName}\nconst new${entityName} = {\n`;
    properties.forEach(prop => {
        let exampleValue = '';
        switch (prop.type) {
            case 'Text':
                exampleValue = `'Sample ${prop.name}'`;
                break;
            case 'Number':
                exampleValue = '42';
                break;
            case 'Checkbox':
                exampleValue = 'true';
                break;
            case 'Date':
                exampleValue = 'new Date()';
                break;
            case 'Email':
                exampleValue = "'user@example.com'";
                break;
            case 'URL':
                exampleValue = "'https://example.com'";
                break;
            case 'JSON':
                exampleValue = '{ key: "value" }';
                break;
            default:
                exampleValue = `'Sample ${prop.name}'`;
        }
        exampleCode += `  ${prop.name}: ${exampleValue},\n`;
    });
    relations.forEach(relation => {
        if (relation.type === 'one-to-one') {
            exampleCode += `  ${relation.name}: 'related-${relation.target.toLowerCase()}-id',\n`;
        }
        else {
            exampleCode += `  ${relation.name}: ['related-${relation.target.toLowerCase()}-id-1', 'related-${relation.target.toLowerCase()}-id-2'],\n`;
        }
    });
    exampleCode += `};\n\n`;
    // Add React hook example
    exampleCode += `// Using with React hooks\nimport { useCreateEntity, useQuery } from '@graphprotocol/hypergraph-react';\n\n`;
    exampleCode += `function ${entityName}Component() {\n`;
    exampleCode += `  const create${entityName} = useCreateEntity(${entityName});\n`;
    exampleCode += `  const { data: ${entityName.toLowerCase()}s } = useQuery(${entityName}, { mode: 'private' });\n\n`;
    exampleCode += `  const handleCreate = async () => {\n`;
    exampleCode += `    try {\n`;
    exampleCode += `      await create${entityName}(new${entityName});\n`;
    exampleCode += `      console.log('${entityName} created successfully!');\n`;
    exampleCode += `    } catch (error) {\n`;
    exampleCode += `      console.error('Error creating ${entityName}:', error);\n`;
    exampleCode += `    }\n`;
    exampleCode += `  };\n\n`;
    exampleCode += `  return (\n`;
    exampleCode += `    <div>\n`;
    exampleCode += `      <h2>${entityName} Management</h2>\n`;
    exampleCode += `      <button onClick={handleCreate}>Create ${entityName}</button>\n`;
    exampleCode += `      \n`;
    exampleCode += `      <div>\n`;
    exampleCode += `        <h3>Existing ${entityName}s:</h3>\n`;
    exampleCode += `        {${entityName.toLowerCase()}s?.map((${entityName.toLowerCase()}) => (\n`;
    exampleCode += `          <div key={${entityName.toLowerCase()}.id}>\n`;
    // Show first text property as title
    const firstTextProp = properties.find(p => p.type === 'Text');
    if (firstTextProp) {
        exampleCode += `            <h4>{${entityName.toLowerCase()}.${firstTextProp.name}}</h4>\n`;
    }
    exampleCode += `            {/* Add more ${entityName.toLowerCase()} details here */}\n`;
    exampleCode += `          </div>\n`;
    exampleCode += `        ))}\n`;
    exampleCode += `      </div>\n`;
    exampleCode += `    </div>\n`;
    exampleCode += `  );\n`;
    exampleCode += `}\n\n`;
    return exampleCode;
}
function generateValidationHelpers(entityName, properties) {
    let validationCode = `// Validation helpers for ${entityName}\n\n`;
    validationCode += `export function validate${entityName}(data: Partial<I${entityName}>): { isValid: boolean; errors: string[] } {\n`;
    validationCode += `  const errors: string[] = [];\n\n`;
    properties.forEach(prop => {
        if (prop.required) {
            validationCode += `  if (!data.${prop.name}) {\n`;
            validationCode += `    errors.push('${prop.name} is required');\n`;
            validationCode += `  }\n\n`;
        }
        if (prop.type === 'Email') {
            validationCode += `  if (data.${prop.name} && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.${prop.name})) {\n`;
            validationCode += `    errors.push('${prop.name} must be a valid email');\n`;
            validationCode += `  }\n\n`;
        }
        if (prop.type === 'URL') {
            validationCode += `  if (data.${prop.name}) {\n`;
            validationCode += `    try {\n`;
            validationCode += `      new URL(data.${prop.name});\n`;
            validationCode += `    } catch {\n`;
            validationCode += `      errors.push('${prop.name} must be a valid URL');\n`;
            validationCode += `    }\n`;
            validationCode += `  }\n\n`;
        }
    });
    validationCode += `  return {\n`;
    validationCode += `    isValid: errors.length === 0,\n`;
    validationCode += `    errors\n`;
    validationCode += `  };\n`;
    validationCode += `}\n\n`;
    // Add form validation hook
    validationCode += `// React hook for form validation\nexport function use${entityName}Validation() {\n`;
    validationCode += `  const [errors, setErrors] = useState<string[]>([]);\n\n`;
    validationCode += `  const validate = (data: Partial<I${entityName}>) => {\n`;
    validationCode += `    const result = validate${entityName}(data);\n`;
    validationCode += `    setErrors(result.errors);\n`;
    validationCode += `    return result.isValid;\n`;
    validationCode += `  };\n\n`;
    validationCode += `  return { validate, errors, hasErrors: errors.length > 0 };\n`;
    validationCode += `}\n`;
    return validationCode;
}
//# sourceMappingURL=schema.js.map