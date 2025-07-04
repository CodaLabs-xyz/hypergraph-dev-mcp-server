export function createQuickstartTool() {
  return {
    name: 'generate_quickstart',
    description: 'Generate complete quickstart project template for Hypergraph',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: 'Name of the project',
          default: 'my-hypergraph-app'
        },
        framework: {
          type: 'string',
          enum: ['react', 'nextjs', 'vanilla-ts', 'express-api'],
          description: 'Framework template to generate',
          default: 'react'
        },
        entityTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Entity types to include in the quickstart',
          default: ['Event', 'User']
        },
        includeAuth: {
          type: 'boolean',
          description: 'Include authentication setup',
          default: true
        },
        includeExamples: {
          type: 'boolean',
          description: 'Include example components and data',
          default: true
        },
        useTypeScript: {
          type: 'boolean',
          description: 'Use TypeScript',
          default: true
        }
      },
      required: ['projectName'],
    },
  };
}

export async function handleGenerateQuickstart(args: any) {
  const { projectName, framework, entityTypes, includeAuth, includeExamples, useTypeScript } = args;
  
  const quickstartProject = generateQuickstartProject(
    projectName, 
    framework, 
    entityTypes, 
    includeAuth, 
    includeExamples, 
    useTypeScript
  );

  return {
    content: [
      {
        type: 'text',
        text: quickstartProject,
      },
    ],
  };
}

function generateQuickstartProject(
  projectName: string,
  framework: string,
  entityTypes: string[],
  includeAuth: boolean,
  includeExamples: boolean,
  useTypeScript: boolean
) {
  let project = `# ${projectName} - Hypergraph Quickstart\n\n`;
  project += `Generated Hypergraph project with ${framework} framework.\n\n`;

  // Project structure
  project += generateProjectStructure(projectName, framework, useTypeScript);
  
  // Package.json
  project += generatePackageJson(projectName, framework, useTypeScript);
  
  // Configuration files
  project += generateConfigFiles(framework, useTypeScript);
  
  // Schema definitions
  project += generateSchemaFiles(entityTypes, useTypeScript);
  
  // Mapping configuration
  project += generateMappingFile(entityTypes, useTypeScript);
  
  // Main application files
  if (framework === 'react') {
    project += generateReactApp(projectName, entityTypes, includeAuth, includeExamples, useTypeScript);
  } else if (framework === 'nextjs') {
    project += generateNextjsApp(projectName, entityTypes, includeAuth, includeExamples, useTypeScript);
  } else if (framework === 'vanilla-ts') {
    project += generateVanillaApp(projectName, entityTypes, includeAuth, includeExamples);
  } else if (framework === 'express-api') {
    project += generateExpressAPI(projectName, entityTypes, includeAuth, useTypeScript);
  }
  
  // Example data and components
  if (includeExamples) {
    project += generateExampleContent(entityTypes, framework, useTypeScript);
  }
  
  // Setup instructions
  project += generateSetupInstructions(projectName, framework);
  
  return project;
}

function generateProjectStructure(projectName: string, framework: string, useTypeScript: boolean) {
  const ext = useTypeScript ? 'ts' : 'js';
  const extx = useTypeScript ? 'tsx' : 'jsx';
  
  let structure = `## Project Structure\n\n\`\`\`\n${projectName}/\n`;
  
  if (framework === 'react') {
    structure += `├── public/\n│   ├── index.html\n│   └── favicon.ico\n`;
    structure += `├── src/\n`;
    structure += `│   ├── components/\n│   │   ├── Layout.${extx}\n│   │   ├── Auth/\n│   │   │   ├── AuthButton.${extx}\n│   │   │   └── AuthCallback.${extx}\n│   │   └── Entities/\n│   │       ├── EventList.${extx}\n│   │       └── UserProfile.${extx}\n`;
    structure += `│   ├── schema/\n│   │   └── index.${ext}\n`;
    structure += `│   ├── mapping/\n│   │   └── index.${ext}\n`;
    structure += `│   ├── hooks/\n│   │   └── useEntityOperations.${ext}\n`;
    structure += `│   ├── utils/\n│   │   └── constants.${ext}\n`;
    structure += `│   ├── App.${extx}\n`;
    structure += `│   └── index.${extx}\n`;
  } else if (framework === 'nextjs') {
    structure += `├── pages/\n│   ├── _app.${extx}\n│   ├── index.${extx}\n│   ├── auth/\n│   │   └── callback.${extx}\n│   └── api/\n│       └── health.${ext}\n`;
    structure += `├── components/\n│   ├── Layout.${extx}\n│   └── entities/\n│       ├── EventCard.${extx}\n│       └── UserCard.${extx}\n`;
    structure += `├── lib/\n│   ├── schema.${ext}\n│   ├── mapping.${ext}\n│   └── hypergraph.${ext}\n`;
    structure += `├── public/\n│   └── favicon.ico\n`;
  } else if (framework === 'vanilla-ts') {
    structure += `├── src/\n│   ├── lib/\n│   │   ├── schema.ts\n│   │   ├── mapping.ts\n│   │   └── hypergraph.ts\n│   ├── components/\n│   │   ├── app.ts\n│   │   └── auth.ts\n│   ├── styles/\n│   │   └── main.css\n│   └── index.ts\n`;
    structure += `├── public/\n│   └── index.html\n`;
  } else if (framework === 'express-api') {
    structure += `├── src/\n│   ├── routes/\n│   │   ├── auth.${ext}\n│   │   ├── entities.${ext}\n│   │   └── spaces.${ext}\n│   ├── middleware/\n│   │   ├── auth.${ext}\n│   │   └── validation.${ext}\n│   ├── models/\n│   │   └── schema.${ext}\n│   ├── services/\n│   │   ├── hypergraph.${ext}\n│   │   └── publishing.${ext}\n│   ├── utils/\n│   │   └── config.${ext}\n│   └── index.${ext}\n`;
  }
  
  structure += `├── package.json\n`;
  if (useTypeScript) {
    structure += `├── tsconfig.json\n`;
  }
  structure += `├── .env.example\n`;
  structure += `├── .gitignore\n`;
  structure += `└── README.md\n\`\`\`\n\n`;
  
  return structure;
}

function generatePackageJson(projectName: string, framework: string, useTypeScript: boolean) {
  let packageJson = `## package.json\n\n\`\`\`json\n{\n`;
  packageJson += `  "name": "${projectName}",\n`;
  packageJson += `  "version": "1.0.0",\n`;
  packageJson += `  "private": true,\n`;
  
  // Dependencies based on framework
  packageJson += `  "dependencies": {\n`;
  packageJson += `    "@graphprotocol/hypergraph": "^1.0.0",\n`;
  
  if (framework === 'react') {
    packageJson += `    "@graphprotocol/hypergraph-react": "^1.0.0",\n`;
    packageJson += `    "react": "^18.2.0",\n`;
    packageJson += `    "react-dom": "^18.2.0",\n`;
    packageJson += `    "react-router-dom": "^6.8.0"\n`;
  } else if (framework === 'nextjs') {
    packageJson += `    "@graphprotocol/hypergraph-react": "^1.0.0",\n`;
    packageJson += `    "next": "^14.0.0",\n`;
    packageJson += `    "react": "^18.2.0",\n`;
    packageJson += `    "react-dom": "^18.2.0"\n`;
  } else if (framework === 'express-api') {
    packageJson += `    "express": "^4.18.0",\n`;
    packageJson += `    "cors": "^2.8.5",\n`;
    packageJson += `    "helmet": "^6.0.0",\n`;
    packageJson += `    "dotenv": "^16.0.0"\n`;
  }
  
  packageJson += `  },\n`;
  
  // Dev dependencies
  packageJson += `  "devDependencies": {\n`;
  
  if (useTypeScript) {
    packageJson += `    "typescript": "^5.0.0",\n`;
    packageJson += `    "@types/node": "^20.0.0",\n`;
    
    if (framework === 'react') {
      packageJson += `    "@types/react": "^18.0.0",\n`;
      packageJson += `    "@types/react-dom": "^18.0.0",\n`;
      packageJson += `    "@vitejs/plugin-react": "^4.0.0",\n`;
      packageJson += `    "vite": "^4.0.0"\n`;
    } else if (framework === 'express-api') {
      packageJson += `    "@types/express": "^4.17.0",\n`;
      packageJson += `    "@types/cors": "^2.8.0",\n`;
      packageJson += `    "tsx": "^4.0.0",\n`;
      packageJson += `    "nodemon": "^3.0.0"\n`;
    }
  } else {
    if (framework === 'react') {
      packageJson += `    "@vitejs/plugin-react": "^4.0.0",\n`;
      packageJson += `    "vite": "^4.0.0"\n`;
    }
  }
  
  packageJson += `  },\n`;
  
  // Scripts
  packageJson += `  "scripts": {\n`;
  
  if (framework === 'react') {
    packageJson += `    "dev": "vite",\n`;
    packageJson += `    "build": "vite build",\n`;
    packageJson += `    "preview": "vite preview",\n`;
    if (useTypeScript) {
      packageJson += `    "type-check": "tsc --noEmit",\n`;
    }
  } else if (framework === 'nextjs') {
    packageJson += `    "dev": "next dev",\n`;
    packageJson += `    "build": "next build",\n`;
    packageJson += `    "start": "next start",\n`;
    if (useTypeScript) {
      packageJson += `    "type-check": "next build --no-lint",\n`;
    }
  } else if (framework === 'vanilla-ts') {
    packageJson += `    "dev": "vite",\n`;
    packageJson += `    "build": "tsc && vite build",\n`;
    packageJson += `    "preview": "vite preview",\n`;
    packageJson += `    "type-check": "tsc --noEmit",\n`;
  } else if (framework === 'express-api') {
    if (useTypeScript) {
      packageJson += `    "dev": "tsx watch src/index.ts",\n`;
      packageJson += `    "build": "tsc",\n`;
      packageJson += `    "start": "node dist/index.js",\n`;
      packageJson += `    "type-check": "tsc --noEmit",\n`;
    } else {
      packageJson += `    "dev": "nodemon src/index.js",\n`;
      packageJson += `    "start": "node src/index.js",\n`;
    }
  }
  
  packageJson += `    "lint": "eslint src/",\n`;
  packageJson += `    "test": "echo \\"No tests specified\\" && exit 0"\n`;
  packageJson += `  }\n`;
  packageJson += `}\n\`\`\`\n\n`;
  
  return packageJson;
}

function generateConfigFiles(framework: string, useTypeScript: boolean) {
  let configs = '';
  
  if (useTypeScript) {
    configs += `## tsconfig.json\n\n\`\`\`json\n{\n`;
    configs += `  "compilerOptions": {\n`;
    configs += `    "target": "ES2020",\n`;
    configs += `    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n`;
    configs += `    "module": "ESNext",\n`;
    configs += `    "skipLibCheck": true,\n`;
    configs += `    "moduleResolution": "bundler",\n`;
    configs += `    "allowImportingTsExtensions": true,\n`;
    configs += `    "resolveJsonModule": true,\n`;
    configs += `    "isolatedModules": true,\n`;
    configs += `    "noEmit": true,\n`;
    
    if (framework === 'react' || framework === 'nextjs') {
      configs += `    "jsx": "react-jsx",\n`;
    }
    
    configs += `    "strict": true,\n`;
    configs += `    "noUnusedLocals": true,\n`;
    configs += `    "noUnusedParameters": true,\n`;
    configs += `    "noFallthroughCasesInSwitch": true\n`;
    configs += `  },\n`;
    configs += `  "include": ["src"],\n`;
    configs += `  "references": [{ "path": "./tsconfig.node.json" }]\n`;
    configs += `}\n\`\`\`\n\n`;
  }
  
  // Vite config for React and Vanilla TS
  if (framework === 'react' || framework === 'vanilla-ts') {
    const ext = useTypeScript ? 'ts' : 'js';
    configs += `## vite.config.${ext}\n\n\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
    
    if (useTypeScript) {
      configs += `import { defineConfig } from 'vite';\n`;
      if (framework === 'react') {
        configs += `import react from '@vitejs/plugin-react';\n\n`;
        configs += `export default defineConfig({\n`;
        configs += `  plugins: [react()],\n`;
      } else {
        configs += `\nexport default defineConfig({\n`;
      }
    } else {
      if (framework === 'react') {
        configs += `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\n`;
        configs += `export default defineConfig({\n`;
        configs += `  plugins: [react()],\n`;
      } else {
        configs += `import { defineConfig } from 'vite';\n\nexport default defineConfig({\n`;
      }
    }
    
    configs += `  server: {\n`;
    configs += `    port: 3000,\n`;
    configs += `    open: true\n`;
    configs += `  },\n`;
    configs += `  build: {\n`;
    configs += `    outDir: 'dist',\n`;
    configs += `    sourcemap: true\n`;
    configs += `  }\n`;
    configs += `});\n\`\`\`\n\n`;
  }
  
  // Environment variables
  configs += `## .env.example\n\n\`\`\`bash\n`;
  configs += `# Hypergraph Configuration\n`;
  configs += `REACT_APP_HYPERGRAPH_CLIENT_ID=your-client-id\n`;
  configs += `REACT_APP_HYPERGRAPH_API_URL=https://api.hypergraph.thegraph.com\n`;
  configs += `REACT_APP_AUTH_REDIRECT_URI=http://localhost:3000/auth/callback\n\n`;
  configs += `# Development\n`;
  configs += `NODE_ENV=development\n`;
  configs += `REACT_APP_DEBUG=true\n\`\`\`\n\n`;
  
  // .gitignore
  configs += `## .gitignore\n\n\`\`\`\n`;
  configs += `# Dependencies\n`;
  configs += `node_modules/\n`;
  configs += `npm-debug.log*\n`;
  configs += `yarn-debug.log*\n`;
  configs += `yarn-error.log*\n\n`;
  configs += `# Production builds\n`;
  configs += `dist/\n`;
  configs += `build/\n`;
  configs += `.next/\n\n`;
  configs += `# Environment variables\n`;
  configs += `.env\n`;
  configs += `.env.local\n`;
  configs += `.env.development.local\n`;
  configs += `.env.test.local\n`;
  configs += `.env.production.local\n\n`;
  configs += `# IDE\n`;
  configs += `.vscode/\n`;
  configs += `.idea/\n\n`;
  configs += `# OS\n`;
  configs += `.DS_Store\n`;
  configs += `Thumbs.db\n\`\`\`\n\n`;
  
  return configs;
}

function generateSchemaFiles(entityTypes: string[], useTypeScript: boolean) {
  const ext = useTypeScript ? 'ts' : 'js';
  
  let schema = `## src/schema/index.${ext}\n\n`;
  schema += `\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
  schema += `import { Entity, Type } from '@graphprotocol/hypergraph';\n\n`;
  
  entityTypes.forEach(entityType => {
    schema += generateEntitySchema(entityType, useTypeScript);
    schema += `\n`;
  });
  
  // Export all entities
  schema += `// Export all entities\n`;
  schema += `export {\n`;
  entityTypes.forEach((entityType, index) => {
    const comma = index < entityTypes.length - 1 ? ',' : '';
    schema += `  ${entityType}${comma}\n`;
  });
  schema += `};\n`;
  
  schema += `\`\`\`\n\n`;
  
  return schema;
}

function generateEntitySchema(entityType: string, useTypeScript: boolean) {
  let schema = `// ${entityType} Entity\n`;
  schema += `export class ${entityType} extends Entity.Class<${entityType}>('${entityType}')({\n`;
  
  // Generate properties based on entity type
  if (entityType === 'Event') {
    schema += `  name: Type.Text,\n`;
    schema += `  description: Type.Text,\n`;
    schema += `  date: Type.Date,\n`;
    schema += `  location: Type.Text,\n`;
    schema += `  organizer: Type.Text,\n`;
    schema += `  capacity: Type.Number,\n`;
    schema += `  isPublic: Type.Checkbox,\n`;
    schema += `  tags: Type.Text // Comma-separated tags\n`;
  } else if (entityType === 'User') {
    schema += `  name: Type.Text,\n`;
    schema += `  email: Type.Text.email(),\n`;
    schema += `  bio: Type.Text,\n`;
    schema += `  website: Type.Text.url(),\n`;
    schema += `  location: Type.Text,\n`;
    schema += `  joinedAt: Type.Date,\n`;
    schema += `  isActive: Type.Checkbox\n`;
  } else if (entityType === 'Post') {
    schema += `  title: Type.Text,\n`;
    schema += `  content: Type.Text,\n`;
    schema += `  summary: Type.Text,\n`;
    schema += `  publishedAt: Type.Date,\n`;
    schema += `  isPublished: Type.Checkbox,\n`;
    schema += `  viewCount: Type.Number,\n`;
    schema += `  tags: Type.Text\n`;
  } else if (entityType === 'Product') {
    schema += `  name: Type.Text,\n`;
    schema += `  description: Type.Text,\n`;
    schema += `  price: Type.Number,\n`;
    schema += `  category: Type.Text,\n`;
    schema += `  inStock: Type.Checkbox,\n`;
    schema += `  sku: Type.Text,\n`;
    schema += `  createdAt: Type.Date\n`;
  } else {
    // Generic entity
    schema += `  name: Type.Text,\n`;
    schema += `  description: Type.Text,\n`;
    schema += `  createdAt: Type.Date,\n`;
    schema += `  isActive: Type.Checkbox\n`;
  }
  
  schema += `}) {}\n`;
  
  return schema;
}

function generateMappingFile(entityTypes: string[], useTypeScript: boolean) {
  const ext = useTypeScript ? 'ts' : 'js';
  
  let mapping = `## src/mapping/index.${ext}\n\n`;
  mapping += `\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
  mapping += `import { Mapping } from '@graphprotocol/hypergraph';\n`;
  
  // Import entities
  mapping += `import {\n`;
  entityTypes.forEach((entityType, index) => {
    const comma = index < entityTypes.length - 1 ? ',' : '';
    mapping += `  ${entityType}${comma}\n`;
  });
  mapping += `} from '../schema';\n\n`;
  
  mapping += `// Knowledge Graph mapping configuration\n`;
  mapping += `export const mapping: Mapping = {\n`;
  
  entityTypes.forEach((entityType, index) => {
    const comma = index < entityTypes.length - 1 ? ',' : '';
    mapping += generateEntityMapping(entityType);
    mapping += comma + '\n';
  });
  
  mapping += `};\n\n`;
  
  // Add validation function
  mapping += `// Validate mapping configuration\n`;
  mapping += `export function validateMapping() {\n`;
  mapping += `  const errors = [];\n\n`;
  
  entityTypes.forEach(entityType => {
    mapping += `  // Validate ${entityType} mapping\n`;
    mapping += `  if (!mapping.${entityType}) {\n`;
    mapping += `    errors.push('Missing mapping for ${entityType}');\n`;
    mapping += `  }\n\n`;
  });
  
  mapping += `  return {\n`;
  mapping += `    isValid: errors.length === 0,\n`;
  mapping += `    errors\n`;
  mapping += `  };\n`;
  mapping += `}\n`;
  
  mapping += `\`\`\`\n\n`;
  
  return mapping;
}

function generateEntityMapping(entityType: string) {
  let mapping = `  ${entityType}: {\n`;
  
  if (entityType === 'Event') {
    mapping += `    typeId: 'https://schema.org/Event',\n`;
    mapping += `    properties: {\n`;
    mapping += `      name: 'https://schema.org/name',\n`;
    mapping += `      description: 'https://schema.org/description',\n`;
    mapping += `      date: 'https://schema.org/startDate',\n`;
    mapping += `      location: 'https://schema.org/location',\n`;
    mapping += `      organizer: 'https://schema.org/organizer',\n`;
    mapping += `      capacity: 'https://schema.org/maximumAttendeeCapacity',\n`;
    mapping += `      isPublic: 'https://schema.org/isAccessibleForFree',\n`;
    mapping += `      tags: 'https://schema.org/keywords'\n`;
    mapping += `    }\n`;
  } else if (entityType === 'User') {
    mapping += `    typeId: 'https://schema.org/Person',\n`;
    mapping += `    properties: {\n`;
    mapping += `      name: 'https://schema.org/name',\n`;
    mapping += `      email: 'https://schema.org/email',\n`;
    mapping += `      bio: 'https://schema.org/description',\n`;
    mapping += `      website: 'https://schema.org/url',\n`;
    mapping += `      location: 'https://schema.org/address',\n`;
    mapping += `      joinedAt: 'https://schema.org/dateCreated',\n`;
    mapping += `      isActive: 'https://schema.org/isActive'\n`;
    mapping += `    }\n`;
  } else if (entityType === 'Post') {
    mapping += `    typeId: 'https://schema.org/BlogPosting',\n`;
    mapping += `    properties: {\n`;
    mapping += `      title: 'https://schema.org/headline',\n`;
    mapping += `      content: 'https://schema.org/articleBody',\n`;
    mapping += `      summary: 'https://schema.org/abstract',\n`;
    mapping += `      publishedAt: 'https://schema.org/datePublished',\n`;
    mapping += `      isPublished: 'https://schema.org/isAccessibleForFree',\n`;
    mapping += `      viewCount: 'https://schema.org/interactionCount',\n`;
    mapping += `      tags: 'https://schema.org/keywords'\n`;
    mapping += `    }\n`;
  } else if (entityType === 'Product') {
    mapping += `    typeId: 'https://schema.org/Product',\n`;
    mapping += `    properties: {\n`;
    mapping += `      name: 'https://schema.org/name',\n`;
    mapping += `      description: 'https://schema.org/description',\n`;
    mapping += `      price: 'https://schema.org/price',\n`;
    mapping += `      category: 'https://schema.org/category',\n`;
    mapping += `      inStock: 'https://schema.org/availability',\n`;
    mapping += `      sku: 'https://schema.org/sku',\n`;
    mapping += `      createdAt: 'https://schema.org/dateCreated'\n`;
    mapping += `    }\n`;
  } else {
    // Generic mapping
    mapping += `    typeId: 'https://schema.org/Thing',\n`;
    mapping += `    properties: {\n`;
    mapping += `      name: 'https://schema.org/name',\n`;
    mapping += `      description: 'https://schema.org/description',\n`;
    mapping += `      createdAt: 'https://schema.org/dateCreated',\n`;
    mapping += `      isActive: 'https://schema.org/isActive'\n`;
    mapping += `    }\n`;
  }
  
  mapping += `  }`;
  
  return mapping;
}

function generateReactApp(projectName: string, entityTypes: string[], includeAuth: boolean, includeExamples: boolean, useTypeScript: boolean) {
  const ext = useTypeScript ? 'tsx' : 'jsx';
  
  let app = `## src/App.${ext}\n\n`;
  app += `\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
  app += `import React from 'react';\n`;
  app += `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\n`;
  app += `import { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';\n`;
  app += `import { mapping } from './mapping';\n`;
  
  if (includeAuth) {
    app += `import AuthButton from './components/Auth/AuthButton';\n`;
    app += `import AuthCallback from './components/Auth/AuthCallback';\n`;
  }
  
  app += `import Layout from './components/Layout';\n`;
  
  entityTypes.forEach(entityType => {
    app += `import ${entityType}List from './components/Entities/${entityType}List';\n`;
  });
  
  app += `import './App.css';\n\n`;
  
  app += `function App() {\n`;
  app += `  return (\n`;
  app += `    <HypergraphAppProvider mapping={mapping}>\n`;
  app += `      <Router>\n`;
  app += `        <Layout>\n`;
  app += `          <Routes>\n`;
  app += `            <Route path="/" element={<Home />} />\n`;
  
  entityTypes.forEach(entityType => {
    app += `            <Route path="/${entityType.toLowerCase()}s" element={<${entityType}List />} />\n`;
  });
  
  if (includeAuth) {
    app += `            <Route path="/auth/callback" element={<AuthCallback />} />\n`;
  }
  
  app += `          </Routes>\n`;
  app += `        </Layout>\n`;
  app += `      </Router>\n`;
  app += `    </HypergraphAppProvider>\n`;
  app += `  );\n`;
  app += `}\n\n`;
  
  // Home component
  app += `function Home() {\n`;
  app += `  return (\n`;
  app += `    <div className="home">\n`;
  app += `      <h1>Welcome to ${projectName}</h1>\n`;
  app += `      <p>A Hypergraph-powered application for managing:\n`;
  
  entityTypes.forEach((entityType, index) => {
    if (index === entityTypes.length - 1 && entityTypes.length > 1) {
      app += ` and ${entityType}s`;
    } else if (index === 0) {
      app += ` ${entityType}s`;
    } else {
      app += `, ${entityType}s`;
    }
  });
  
  app += `</p>\n`;
  
  if (includeAuth) {
    app += `      <AuthButton />\n`;
  }
  
  app += `      <div className="quick-links">\n`;
  
  entityTypes.forEach(entityType => {
    app += `        <a href="/${entityType.toLowerCase()}s">${entityType}s</a>\n`;
  });
  
  app += `      </div>\n`;
  app += `    </div>\n`;
  app += `  );\n`;
  app += `}\n\n`;
  
  app += `export default App;\n`;
  app += `\`\`\`\n\n`;
  
  // Layout component
  app += generateLayoutComponent(projectName, entityTypes, includeAuth, useTypeScript);
  
  // Entity components
  entityTypes.forEach(entityType => {
    app += generateEntityListComponent(entityType, useTypeScript);
  });
  
  if (includeAuth) {
    app += generateAuthComponents(useTypeScript);
  }
  
  return app;
}

function generateLayoutComponent(projectName: string, entityTypes: string[], includeAuth: boolean, useTypeScript: boolean) {
  const ext = useTypeScript ? 'tsx' : 'jsx';
  
  let layout = `## src/components/Layout.${ext}\n\n`;
  layout += `\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
  layout += `import React from 'react';\n`;
  layout += `import { Link } from 'react-router-dom';\n`;
  
  if (includeAuth) {
    layout += `import { useHypergraphAuth } from '@graphprotocol/hypergraph-react';\n`;
  }
  
  if (useTypeScript) {
    layout += `\ninterface LayoutProps {\n`;
    layout += `  children: React.ReactNode;\n`;
    layout += `}\n\n`;
    layout += `function Layout({ children }: LayoutProps) {\n`;
  } else {
    layout += `\nfunction Layout({ children }) {\n`;
  }
  
  if (includeAuth) {
    layout += `  const { isAuthenticated, user } = useHypergraphAuth();\n\n`;
  }
  
  layout += `  return (\n`;
  layout += `    <div className="app-layout">\n`;
  layout += `      <header className="app-header">\n`;
  layout += `        <nav className="nav">\n`;
  layout += `          <Link to="/" className="logo">\n`;
  layout += `            ${projectName}\n`;
  layout += `          </Link>\n`;
  layout += `          \n`;
  layout += `          <div className="nav-links">\n`;
  
  entityTypes.forEach(entityType => {
    layout += `            <Link to="/${entityType.toLowerCase()}s">${entityType}s</Link>\n`;
  });
  
  layout += `          </div>\n`;
  
  if (includeAuth) {
    layout += `          \n`;
    layout += `          <div className="auth-section">\n`;
    layout += `            {isAuthenticated ? (\n`;
    layout += `              <span>Welcome, {user?.name || 'User'}!</span>\n`;
    layout += `            ) : (\n`;
    layout += `              <span>Please sign in</span>\n`;
    layout += `            )}\n`;
    layout += `          </div>\n`;
  }
  
  layout += `        </nav>\n`;
  layout += `      </header>\n`;
  layout += `      \n`;
  layout += `      <main className="app-main">\n`;
  layout += `        {children}\n`;
  layout += `      </main>\n`;
  layout += `      \n`;
  layout += `      <footer className="app-footer">\n`;
  layout += `        <p>Powered by Hypergraph</p>\n`;
  layout += `      </footer>\n`;
  layout += `    </div>\n`;
  layout += `  );\n`;
  layout += `}\n\n`;
  layout += `export default Layout;\n`;
  layout += `\`\`\`\n\n`;
  
  return layout;
}

function generateEntityListComponent(entityType: string, useTypeScript: boolean) {
  const ext = useTypeScript ? 'tsx' : 'jsx';
  
  let component = `## src/components/Entities/${entityType}List.${ext}\n\n`;
  component += `\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
  component += `import React, { useState } from 'react';\n`;
  component += `import { useQuery, useCreateEntity } from '@graphprotocol/hypergraph-react';\n`;
  component += `import { ${entityType} } from '../../schema';\n\n`;
  
  component += `function ${entityType}List() {\n`;
  component += `  const { data: ${entityType.toLowerCase()}s, loading, error } = useQuery(${entityType}, { mode: 'private' });\n`;
  component += `  const create${entityType} = useCreateEntity(${entityType});\n`;
  component += `  const [showForm, setShowForm] = useState(false);\n\n`;
  
  component += `  const handleCreate = async (formData) => {\n`;
  component += `    try {\n`;
  component += `      await create${entityType}(formData);\n`;
  component += `      setShowForm(false);\n`;
  component += `    } catch (error) {\n`;
  component += `      console.error('Failed to create ${entityType.toLowerCase()}:', error);\n`;
  component += `    }\n`;
  component += `  };\n\n`;
  
  component += `  if (loading) return <div>Loading ${entityType.toLowerCase()}s...</div>;\n`;
  component += `  if (error) return <div>Error: {error.message}</div>;\n\n`;
  
  component += `  return (\n`;
  component += `    <div className="${entityType.toLowerCase()}-list">\n`;
  component += `      <div className="list-header">\n`;
  component += `        <h2>${entityType}s</h2>\n`;
  component += `        <button \n`;
  component += `          onClick={() => setShowForm(!showForm)}\n`;
  component += `          className="create-btn"\n`;
  component += `        >\n`;
  component += `          {showForm ? 'Cancel' : 'Create ${entityType}'}\n`;
  component += `        </button>\n`;
  component += `      </div>\n\n`;
  
  component += `      {showForm && (\n`;
  component += `        <${entityType}Form onSubmit={handleCreate} onCancel={() => setShowForm(false)} />\n`;
  component += `      )}\n\n`;
  
  component += `      <div className="list-content">\n`;
  component += `        {${entityType.toLowerCase()}s?.length ? (\n`;
  component += `          ${entityType.toLowerCase()}s.map((${entityType.toLowerCase()}) => (\n`;
  component += `            <${entityType}Card key={${entityType.toLowerCase()}.id} ${entityType.toLowerCase()}={${entityType.toLowerCase()}} />\n`;
  component += `          ))\n`;
  component += `        ) : (\n`;
  component += `          <div className="empty-state">\n`;
  component += `            <p>No ${entityType.toLowerCase()}s found. Create your first one!</p>\n`;
  component += `          </div>\n`;
  component += `        )}\n`;
  component += `      </div>\n`;
  component += `    </div>\n`;
  component += `  );\n`;
  component += `}\n\n`;
  
  // Generate form component
  component += generateEntityForm(entityType, useTypeScript);
  
  // Generate card component
  component += generateEntityCard(entityType, useTypeScript);
  
  component += `export default ${entityType}List;\n`;
  component += `\`\`\`\n\n`;
  
  return component;
}

function generateEntityForm(entityType: string, useTypeScript: boolean) {
  let form = `// ${entityType} Form Component\n`;
  
  if (useTypeScript) {
    form += `interface ${entityType}FormProps {\n`;
    form += `  onSubmit: (data: any) => void;\n`;
    form += `  onCancel: () => void;\n`;
    form += `}\n\n`;
    form += `function ${entityType}Form({ onSubmit, onCancel }: ${entityType}FormProps) {\n`;
  } else {
    form += `function ${entityType}Form({ onSubmit, onCancel }) {\n`;
  }
  
  form += `  const [formData, setFormData] = useState({\n`;
  
  // Generate form fields based on entity type
  if (entityType === 'Event') {
    form += `    name: '',\n`;
    form += `    description: '',\n`;
    form += `    date: '',\n`;
    form += `    location: '',\n`;
    form += `    organizer: '',\n`;
    form += `    capacity: 0,\n`;
    form += `    isPublic: false,\n`;
    form += `    tags: ''\n`;
  } else if (entityType === 'User') {
    form += `    name: '',\n`;
    form += `    email: '',\n`;
    form += `    bio: '',\n`;
    form += `    website: '',\n`;
    form += `    location: '',\n`;
    form += `    isActive: true\n`;
  } else {
    form += `    name: '',\n`;
    form += `    description: '',\n`;
    form += `    isActive: true\n`;
  }
  
  form += `  });\n\n`;
  
  form += `  const handleSubmit = (e) => {\n`;
  form += `    e.preventDefault();\n`;
  form += `    const submitData = { ...formData };\n`;
  
  if (entityType === 'Event') {
    form += `    submitData.date = new Date(formData.date);\n`;
    form += `    submitData.capacity = parseInt(formData.capacity);\n`;
  } else if (entityType === 'User') {
    form += `    submitData.joinedAt = new Date();\n`;
  } else {
    form += `    submitData.createdAt = new Date();\n`;
  }
  
  form += `    onSubmit(submitData);\n`;
  form += `  };\n\n`;
  
  form += `  return (\n`;
  form += `    <form onSubmit={handleSubmit} className="${entityType.toLowerCase()}-form">\n`;
  form += `      <h3>Create ${entityType}</h3>\n`;
  
  // Generate form inputs
  if (entityType === 'Event') {
    form += `      <input\n`;
    form += `        type="text"\n`;
    form += `        placeholder="Event name"\n`;
    form += `        value={formData.name}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}\n`;
    form += `        required\n`;
    form += `      />\n`;
    form += `      <textarea\n`;
    form += `        placeholder="Description"\n`;
    form += `        value={formData.description}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}\n`;
    form += `      />\n`;
    form += `      <input\n`;
    form += `        type="datetime-local"\n`;
    form += `        value={formData.date}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}\n`;
    form += `        required\n`;
    form += `      />\n`;
    form += `      <input\n`;
    form += `        type="text"\n`;
    form += `        placeholder="Location"\n`;
    form += `        value={formData.location}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}\n`;
    form += `      />\n`;
    form += `      <input\n`;
    form += `        type="text"\n`;
    form += `        placeholder="Organizer"\n`;
    form += `        value={formData.organizer}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}\n`;
    form += `      />\n`;
    form += `      <input\n`;
    form += `        type="number"\n`;
    form += `        placeholder="Capacity"\n`;
    form += `        value={formData.capacity}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}\n`;
    form += `      />\n`;
    form += `      <label>\n`;
    form += `        <input\n`;
    form += `          type="checkbox"\n`;
    form += `          checked={formData.isPublic}\n`;
    form += `          onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}\n`;
    form += `        />\n`;
    form += `        Public Event\n`;
    form += `      </label>\n`;
  } else {
    form += `      <input\n`;
    form += `        type="text"\n`;
    form += `        placeholder="Name"\n`;
    form += `        value={formData.name}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}\n`;
    form += `        required\n`;
    form += `      />\n`;
    form += `      <textarea\n`;
    form += `        placeholder="Description"\n`;
    form += `        value={formData.description}\n`;
    form += `        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}\n`;
    form += `      />\n`;
  }
  
  form += `      \n`;
  form += `      <div className="form-actions">\n`;
  form += `        <button type="submit">Create</button>\n`;
  form += `        <button type="button" onClick={onCancel}>Cancel</button>\n`;
  form += `      </div>\n`;
  form += `    </form>\n`;
  form += `  );\n`;
  form += `}\n\n`;
  
  return form;
}

function generateEntityCard(entityType: string, useTypeScript: boolean) {
  let card = `// ${entityType} Card Component\n`;
  
  if (useTypeScript) {
    card += `interface ${entityType}CardProps {\n`;
    card += `  ${entityType.toLowerCase()}: any;\n`;
    card += `}\n\n`;
    card += `function ${entityType}Card({ ${entityType.toLowerCase()} }: ${entityType}CardProps) {\n`;
  } else {
    card += `function ${entityType}Card({ ${entityType.toLowerCase()} }) {\n`;
  }
  
  card += `  return (\n`;
  card += `    <div className="${entityType.toLowerCase()}-card">\n`;
  
  if (entityType === 'Event') {
    card += `      <h3>{${entityType.toLowerCase()}.name}</h3>\n`;
    card += `      <p className="description">{${entityType.toLowerCase()}.description}</p>\n`;
    card += `      <div className="event-details">\n`;
    card += `        <p><strong>Date:</strong> {new Date(${entityType.toLowerCase()}.date).toLocaleDateString()}</p>\n`;
    card += `        <p><strong>Location:</strong> {${entityType.toLowerCase()}.location}</p>\n`;
    card += `        <p><strong>Organizer:</strong> {${entityType.toLowerCase()}.organizer}</p>\n`;
    card += `        <p><strong>Capacity:</strong> {${entityType.toLowerCase()}.capacity}</p>\n`;
    card += `        <p><strong>Type:</strong> {${entityType.toLowerCase()}.isPublic ? 'Public' : 'Private'}</p>\n`;
    card += `      </div>\n`;
  } else if (entityType === 'User') {
    card += `      <h3>{${entityType.toLowerCase()}.name}</h3>\n`;
    card += `      <p className="bio">{${entityType.toLowerCase()}.bio}</p>\n`;
    card += `      <div className="user-details">\n`;
    card += `        <p><strong>Email:</strong> {${entityType.toLowerCase()}.email}</p>\n`;
    card += `        <p><strong>Location:</strong> {${entityType.toLowerCase()}.location}</p>\n`;
    card += `        {${entityType.toLowerCase()}.website && (\n`;
    card += `          <p><strong>Website:</strong> <a href={${entityType.toLowerCase()}.website} target="_blank" rel="noopener noreferrer">{${entityType.toLowerCase()}.website}</a></p>\n`;
    card += `        )}\n`;
    card += `        <p><strong>Joined:</strong> {new Date(${entityType.toLowerCase()}.joinedAt).toLocaleDateString()}</p>\n`;
    card += `      </div>\n`;
  } else {
    card += `      <h3>{${entityType.toLowerCase()}.name}</h3>\n`;
    card += `      <p className="description">{${entityType.toLowerCase()}.description}</p>\n`;
    card += `      <div className="entity-details">\n`;
    card += `        <p><strong>Created:</strong> {new Date(${entityType.toLowerCase()}.createdAt).toLocaleDateString()}</p>\n`;
    card += `        <p><strong>Status:</strong> {${entityType.toLowerCase()}.isActive ? 'Active' : 'Inactive'}</p>\n`;
    card += `      </div>\n`;
  }
  
  card += `    </div>\n`;
  card += `  );\n`;
  card += `}\n\n`;
  
  return card;
}

function generateAuthComponents(useTypeScript: boolean) {
  const ext = useTypeScript ? 'tsx' : 'jsx';
  
  let auth = `## src/components/Auth/AuthButton.${ext}\n\n`;
  auth += `\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
  auth += `import React from 'react';\n`;
  auth += `import { useHypergraphAuth } from '@graphprotocol/hypergraph-react';\n\n`;
  
  auth += `function AuthButton() {\n`;
  auth += `  const { isAuthenticated, user, redirectToConnect, logout } = useHypergraphAuth();\n\n`;
  
  auth += `  const handleLogin = async () => {\n`;
  auth += `    try {\n`;
  auth += `      await redirectToConnect();\n`;
  auth += `    } catch (error) {\n`;
  auth += `      console.error('Login failed:', error);\n`;
  auth += `    }\n`;
  auth += `  };\n\n`;
  
  auth += `  if (isAuthenticated) {\n`;
  auth += `    return (\n`;
  auth += `      <div className="auth-user">\n`;
  auth += `        <span>Welcome, {user?.name || 'User'}!</span>\n`;
  auth += `        <button onClick={logout}>Logout</button>\n`;
  auth += `      </div>\n`;
  auth += `    );\n`;
  auth += `  }\n\n`;
  
  auth += `  return (\n`;
  auth += `    <button onClick={handleLogin} className="auth-login">\n`;
  auth += `      Connect with Geo\n`;
  auth += `    </button>\n`;
  auth += `  );\n`;
  auth += `}\n\n`;
  auth += `export default AuthButton;\n`;
  auth += `\`\`\`\n\n`;
  
  // Auth callback component
  auth += `## src/components/Auth/AuthCallback.${ext}\n\n`;
  auth += `\`\`\`${useTypeScript ? 'typescript' : 'javascript'}\n`;
  auth += `import React, { useEffect } from 'react';\n`;
  auth += `import { useNavigate } from 'react-router-dom';\n`;
  auth += `import { useHypergraphAuth } from '@graphprotocol/hypergraph-react';\n\n`;
  
  auth += `function AuthCallback() {\n`;
  auth += `  const navigate = useNavigate();\n`;
  auth += `  const { processConnectAuthSuccess } = useHypergraphAuth();\n\n`;
  
  auth += `  useEffect(() => {\n`;
  auth += `    const handleAuthCallback = async () => {\n`;
  auth += `      const urlParams = new URLSearchParams(window.location.search);\n`;
  auth += `      const code = urlParams.get('code');\n`;
  auth += `      const state = urlParams.get('state');\n\n`;
  
  auth += `      if (code && state) {\n`;
  auth += `        try {\n`;
  auth += `          await processConnectAuthSuccess(code, state);\n`;
  auth += `          navigate('/');\n`;
  auth += `        } catch (error) {\n`;
  auth += `          console.error('Auth callback failed:', error);\n`;
  auth += `          navigate('/?auth=failed');\n`;
  auth += `        }\n`;
  auth += `      } else {\n`;
  auth += `        navigate('/?auth=invalid');\n`;
  auth += `      }\n`;
  auth += `    };\n\n`;
  
  auth += `    handleAuthCallback();\n`;
  auth += `  }, [processConnectAuthSuccess, navigate]);\n\n`;
  
  auth += `  return (\n`;
  auth += `    <div className="auth-callback">\n`;
  auth += `      <p>Processing authentication...</p>\n`;
  auth += `    </div>\n`;
  auth += `  );\n`;
  auth += `}\n\n`;
  auth += `export default AuthCallback;\n`;
  auth += `\`\`\`\n\n`;
  
  return auth;
}

function generateNextjsApp(projectName: string, entityTypes: string[], includeAuth: boolean, includeExamples: boolean, useTypeScript: boolean) {
  // Similar to React but with Next.js specific structure
  return `## Next.js App Structure\n\nNext.js implementation with pages and API routes...\n\n`;
}

function generateVanillaApp(projectName: string, entityTypes: string[], includeAuth: boolean, includeExamples: boolean) {
  return `## Vanilla TypeScript App\n\nVanilla TypeScript implementation...\n\n`;
}

function generateExpressAPI(projectName: string, entityTypes: string[], includeAuth: boolean, useTypeScript: boolean) {
  return `## Express API Server\n\nExpress.js API implementation...\n\n`;
}

function generateExampleContent(entityTypes: string[], framework: string, useTypeScript: boolean) {
  let examples = `## Example Data and Usage\n\n`;
  
  entityTypes.forEach(entityType => {
    examples += `### Example ${entityType} Data\n\n`;
    examples += `\`\`\`json\n`;
    examples += generateExampleData(entityType);
    examples += `\n\`\`\`\n\n`;
  });
  
  return examples;
}

function generateExampleData(entityType: string) {
  if (entityType === 'Event') {
    return `{
  "name": "Tech Conference 2024",
  "description": "Annual technology conference featuring the latest innovations",
  "date": "2024-09-15T09:00:00Z",
  "location": "Convention Center, San Francisco",
  "organizer": "Tech Events Inc.",
  "capacity": 500,
  "isPublic": true,
  "tags": "technology, conference, networking"
}`;
  } else if (entityType === 'User') {
    return `{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "bio": "Full-stack developer passionate about Web3 and decentralized applications",
  "website": "https://janedoe.dev",
  "location": "San Francisco, CA",
  "joinedAt": "2024-01-15T10:30:00Z",
  "isActive": true
}`;
  } else if (entityType === 'Post') {
    return `{
  "title": "Getting Started with Hypergraph",
  "content": "Hypergraph is a revolutionary framework for building local-first applications...",
  "summary": "Learn the basics of Hypergraph development",
  "publishedAt": "2024-06-01T14:00:00Z",
  "isPublished": true,
  "viewCount": 1250,
  "tags": "hypergraph, tutorial, web3"
}`;
  } else {
    return `{
  "name": "Example ${entityType}",
  "description": "This is an example ${entityType.toLowerCase()} entity",
  "createdAt": "2024-06-01T12:00:00Z",
  "isActive": true
}`;
  }
}

function generateSetupInstructions(projectName: string, framework: string) {
  let instructions = `## Setup Instructions\n\n`;
  instructions += `### 1. Install Dependencies\n\n`;
  instructions += `\`\`\`bash\ncd ${projectName}\nnpm install\n\`\`\`\n\n`;
  
  instructions += `### 2. Environment Configuration\n\n`;
  instructions += `Copy the example environment file and configure your settings:\n\n`;
  instructions += `\`\`\`bash\ncp .env.example .env\n\`\`\`\n\n`;
  instructions += `Edit \`.env\` with your Hypergraph configuration:\n\n`;
  instructions += `- \`REACT_APP_HYPERGRAPH_CLIENT_ID\`: Your application client ID\n`;
  instructions += `- \`REACT_APP_AUTH_REDIRECT_URI\`: Authentication callback URL\n\n`;
  
  instructions += `### 3. Start Development Server\n\n`;
  instructions += `\`\`\`bash\nnpm run dev\n\`\`\`\n\n`;
  instructions += `Your app will be available at \`http://localhost:3000\`\n\n`;
  
  instructions += `### 4. Authentication Setup\n\n`;
  instructions += `1. Visit [Geo Connect](https://connect.geo.com) to register your application\n`;
  instructions += `2. Add your redirect URI: \`http://localhost:3000/auth/callback\`\n`;
  instructions += `3. Copy your client ID to the \`.env\` file\n\n`;
  
  instructions += `### 5. Available Scripts\n\n`;
  instructions += `- \`npm run dev\`: Start development server\n`;
  instructions += `- \`npm run build\`: Build for production\n`;
  instructions += `- \`npm run type-check\`: Run TypeScript type checking\n`;
  instructions += `- \`npm run lint\`: Run ESLint\n\n`;
  
  instructions += `### 6. Next Steps\n\n`;
  instructions += `1. **Customize Entities**: Modify \`src/schema/index.ts\` to define your data model\n`;
  instructions += `2. **Update Mapping**: Adjust \`src/mapping/index.ts\` for Knowledge Graph integration\n`;
  instructions += `3. **Style Your App**: Add CSS to customize the appearance\n`;
  instructions += `4. **Add Features**: Implement additional functionality like search, filters, etc.\n`;
  instructions += `5. **Deploy**: Build and deploy your app to your preferred hosting platform\n\n`;
  
  instructions += `### 7. Learn More\n\n`;
  instructions += `- [Hypergraph Documentation](https://docs.hypergraph.thegraph.com)\n`;
  instructions += `- [React Integration Guide](https://docs.hypergraph.thegraph.com/react)\n`;
  instructions += `- [Schema Design Best Practices](https://docs.hypergraph.thegraph.com/schema)\n`;
  instructions += `- [Knowledge Graph Mapping](https://docs.hypergraph.thegraph.com/mapping)\n\n`;
  
  instructions += `## Troubleshooting\n\n`;
  instructions += `### Common Issues\n\n`;
  instructions += `**Port already in use:**\n`;
  instructions += `\`\`\`bash\nnpx kill-port 3000\n\`\`\`\n\n`;
  instructions += `**Module not found errors:**\n`;
  instructions += `\`\`\`bash\nrm -rf node_modules package-lock.json\nnpm install\n\`\`\`\n\n`;
  instructions += `**Authentication not working:**\n`;
  instructions += `- Check your client ID in \`.env\`\n`;
  instructions += `- Verify redirect URI matches your Geo Connect configuration\n`;
  instructions += `- Ensure you're using HTTPS in production\n\n`;
  
  instructions += `### Getting Help\n\n`;
  instructions += `- [GitHub Issues](https://github.com/graphprotocol/hypergraph/issues)\n`;
  instructions += `- [Discord Community](https://discord.gg/hypergraph)\n`;
  instructions += `- [Documentation](https://docs.hypergraph.thegraph.com)\n\n`;
  
  return instructions;
}