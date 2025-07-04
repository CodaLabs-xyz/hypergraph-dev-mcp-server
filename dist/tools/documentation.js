export function createDocumentationTool() {
    return {
        name: 'get_documentation',
        description: 'Get comprehensive Hypergraph documentation and code examples',
        inputSchema: {
            type: 'object',
            properties: {
                topic: {
                    type: 'string',
                    enum: [
                        'overview',
                        'quickstart',
                        'core-concepts',
                        'authentication',
                        'spaces',
                        'schema',
                        'queries',
                        'providers',
                        'mapping',
                        'publishing',
                        'key-features',
                        'troubleshooting',
                        'best-practices',
                        'api-reference'
                    ],
                    description: 'Documentation topic to retrieve',
                    default: 'overview'
                },
                format: {
                    type: 'string',
                    enum: ['markdown', 'text', 'code-examples'],
                    description: 'Format of the documentation',
                    default: 'markdown'
                },
                includeExamples: {
                    type: 'boolean',
                    description: 'Include code examples',
                    default: true
                },
                language: {
                    type: 'string',
                    enum: ['typescript', 'javascript', 'react', 'all'],
                    description: 'Programming language for examples',
                    default: 'typescript'
                }
            },
            required: [],
        },
    };
}
export async function handleGetDocumentation(args) {
    const { topic, format, includeExamples, language } = args;
    const documentation = generateDocumentation(topic, format, includeExamples, language);
    return {
        content: [
            {
                type: 'text',
                text: documentation,
            },
        ],
    };
}
function generateDocumentation(topic, format, includeExamples, language) {
    let documentation = '';
    switch (topic) {
        case 'overview':
            documentation = generateOverviewDocs(format, includeExamples, language);
            break;
        case 'quickstart':
            documentation = generateQuickstartDocs(format, includeExamples, language);
            break;
        case 'core-concepts':
            documentation = generateCoreConceptsDocs(format, includeExamples, language);
            break;
        case 'authentication':
            documentation = generateAuthenticationDocs(format, includeExamples, language);
            break;
        case 'spaces':
            documentation = generateSpacesDocs(format, includeExamples, language);
            break;
        case 'schema':
            documentation = generateSchemaDocs(format, includeExamples, language);
            break;
        case 'queries':
            documentation = generateQueriesDocs(format, includeExamples, language);
            break;
        case 'providers':
            documentation = generateProvidersDocs(format, includeExamples, language);
            break;
        case 'mapping':
            documentation = generateMappingDocs(format, includeExamples, language);
            break;
        case 'publishing':
            documentation = generatePublishingDocs(format, includeExamples, language);
            break;
        case 'key-features':
            documentation = generateKeyFeaturesDocs(format, includeExamples, language);
            break;
        case 'troubleshooting':
            documentation = generateTroubleshootingDocs(format, includeExamples, language);
            break;
        case 'best-practices':
            documentation = generateBestPracticesDocs(format, includeExamples, language);
            break;
        case 'api-reference':
            documentation = generateAPIReferenceDocs(format, includeExamples, language);
            break;
        default:
            documentation = generateOverviewDocs(format, includeExamples, language);
    }
    return documentation;
}
function generateOverviewDocs(format, includeExamples, language) {
    let docs = `# Hypergraph Overview

Hypergraph is a TypeScript-first framework for building local-first apps that syncs encrypted data to a shared knowledge graph. It provides:

## What is Hypergraph?

Hypergraph re-imagines traditional client–server apps as knowledge graphs. Instead of storing data in rows and columns, Hypergraph stores data as entities and relationships, making it easier to build interconnected, collaborative applications.

## Key Benefits

- **Local-First**: Your app works offline and syncs when online
- **End-to-End Encryption**: Private data is encrypted by default
- **Knowledge Graph Integration**: Public data becomes part of a shared, interconnected knowledge graph
- **Real-Time Collaboration**: Built-in conflict-free sync (CRDTs)
- **TypeScript-First**: Full type safety throughout your application

## Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your App      │    │   Hypergraph    │    │ Knowledge Graph │
│                 │    │   Framework     │    │    (Public)     │
│ • React/TS      │◄──►│                 │◄──►│                 │
│ • Local Data    │    │ • Sync Engine   │    │ • IPFS Storage  │
│ • UI Components │    │ • Encryption    │    │ • Blockchain    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## Core Concepts

### 1. Spaces
Collections of data managed by a single person or group. Can be public or private.

### 2. Entities
Structured data objects (like Event, User, Product) with properties and relations.

### 3. Knowledge Graph
A shared, public repository where entities from different apps can interconnect.

### 4. Mapping
Configuration that connects your private schema to the public Knowledge Graph schema.

## Getting Started

The fastest way to get started is with the TypeSync CLI:

\`\`\`bash
npx @graphprotocol/hypergraph-cli create my-app
cd my-app
npm install
npm run dev
\`\`\`

## Use Cases

- **Collaborative Apps**: Real-time document editing, project management
- **Content Management**: Blogs, portfolios, knowledge bases
- **Social Networks**: Decentralized social platforms
- **Data Sharing**: Research data, open datasets
- **Event Management**: Conferences, meetups, community events

## What's Different?

Unlike traditional databases that store data in tables, Hypergraph:

- Stores data as interconnected entities
- Enables automatic data discovery and linking
- Provides built-in privacy and collaboration
- Works offline with automatic sync
- Integrates with Web3 infrastructure

## Next Steps

1. **Try the Quickstart**: Build your first app in minutes
2. **Learn Core Concepts**: Understand Spaces, Entities, and the Knowledge Graph
3. **Build Your Schema**: Define your data model
4. **Add Authentication**: Connect with Geo accounts
5. **Publish Data**: Share to the Knowledge Graph`;
    if (includeExamples && format !== 'text') {
        docs += `

## Quick Example

\`\`\`typescript
import { Entity, Type } from '@graphprotocol/hypergraph';

// Define your schema
export class Event extends Entity.Class<Event>('Event')({
  name: Type.Text,
  description: Type.Text,
  date: Type.Date,
  location: Type.Text
}) {}

// Query data
const { data: events } = useQuery(Event, { mode: 'private' });

// Create new entities
const createEvent = useCreateEntity(Event);
await createEvent({
  name: 'My Conference',
  description: 'An amazing tech conference',
  date: new Date('2024-06-15'),
  location: 'San Francisco'
});
\`\`\``;
    }
    return docs;
}
function generateQuickstartDocs(format, includeExamples, language) {
    let docs = `# Hypergraph Quickstart

Get your first Hypergraph app running in under 5 minutes.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A modern browser

## Option 1: Use the Example App

Clone the template repository:

\`\`\`bash
git clone https://github.com/geobrowser/hypergraph-app-template.git
cd hypergraph-app-template
pnpm install
pnpm dev
\`\`\`

Open your browser to \`http://localhost:3000\`

## Option 2: Create New App with TypeSync

Use the Hypergraph CLI to scaffold a new application:

\`\`\`bash
# Install the CLI
npm install -g @graphprotocol/hypergraph-cli

# Create new app
hypergraph create my-hypergraph-app

# Choose your template
? Select a template: › 
❯ React + TypeScript
  Next.js + TypeScript  
  Vanilla TypeScript
  Express API

cd my-hypergraph-app
npm install
npm run dev
\`\`\`

## What You Get

Your new Hypergraph app includes:

- **Authentication**: Geo Connect integration
- **Schema**: Example entity definitions
- **Mapping**: Knowledge Graph configuration
- **UI Components**: React components for CRUD operations
- **Providers**: App and Space provider setup

## Project Structure

\`\`\`
my-hypergraph-app/
├── src/
│   ├── components/          # React components
│   ├── schema/             # Entity definitions
│   ├── mapping/            # Knowledge Graph mapping
│   ├── hooks/              # Custom React hooks
│   └── App.tsx             # Main application
├── package.json
└── README.md
\`\`\`

## Key Files

### Schema Definition (\`src/schema/index.ts\`)

\`\`\`typescript
import { Entity, Type } from '@graphprotocol/hypergraph';

export class Event extends Entity.Class<Event>('Event')({
  name: Type.Text,
  description: Type.Text,
  date: Type.Date,
  location: Type.Text,
  organizer: Type.Text
}) {}
\`\`\`

### Mapping Configuration (\`src/mapping/index.ts\`)

\`\`\`typescript
import { Mapping } from '@graphprotocol/hypergraph';
import { Event } from '../schema';

export const mapping: Mapping = {
  Event: {
    typeId: 'https://schema.org/Event',
    properties: {
      name: 'https://schema.org/name',
      description: 'https://schema.org/description',
      date: 'https://schema.org/startDate',
      location: 'https://schema.org/location',
      organizer: 'https://schema.org/organizer'
    }
  }
};
\`\`\`

### Main App (\`src/App.tsx\`)

\`\`\`typescript
import { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';
import { mapping } from './mapping';
import { EventManager } from './components/EventManager';

function App() {
  return (
    <HypergraphAppProvider mapping={mapping}>
      <div className="App">
        <header>
          <h1>My Hypergraph App</h1>
        </header>
        <main>
          <EventManager />
        </main>
      </div>
    </HypergraphAppProvider>
  );
}

export default App;
\`\`\`

## Next Steps

1. **Customize Your Schema**: Modify \`src/schema/index.ts\` to define your entities
2. **Update Mapping**: Adjust \`src/mapping/index.ts\` to connect to Knowledge Graph
3. **Build Components**: Create React components for your entities
4. **Add Authentication**: Enable user login with Geo Connect
5. **Publish Data**: Share entities to the public Knowledge Graph

## Common Commands

\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run type-check

# Lint code
npm run lint
\`\`\`

## Getting Help

- **Documentation**: https://docs.hypergraph.thegraph.com
- **Discord**: Join the Hypergraph community
- **GitHub**: https://github.com/graphprotocol/hypergraph
- **Examples**: Browse the examples directory

## Troubleshooting

### Port Already in Use
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000
\`\`\`

### Module Not Found
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Authentication Issues
- Check your Geo Connect configuration
- Verify redirect URIs match your app URL
- Ensure you're using HTTPS in production`;
    return docs;
}
function generateCoreConceptsDocs(format, includeExamples, language) {
    let docs = `# Core Concepts

Understanding these key concepts will help you design applications that feel real-time, privacy-preserving, and interoperable by default.

## Knowledge Graphs

Traditional databases store data in rows and columns. Knowledge graphs store data as interconnected entities and relationships.

### Why Knowledge Graphs?

- **Semantic Meaning**: Data has context and meaning
- **Interconnected**: Entities can reference each other across apps
- **Discoverable**: Data can be found through relationships
- **Flexible**: Easy to add new entity types and properties

### The Hypergraph Advantage

Hypergraph combines the benefits of knowledge graphs with:
- **Privacy**: End-to-end encryption for sensitive data
- **Local-First**: Apps work offline
- **Real-Time**: Automatic synchronization
- **Interoperability**: Shared public knowledge graph

## Spaces

Spaces are collections of data managed by a single person or a group of people. Each space is identified by a unique ID and can be public or private.

### Private Spaces
- **Encrypted**: All data is end-to-end encrypted
- **Access Controlled**: Only invited members can access
- **Collaborative**: Multiple users can edit simultaneously
- **Local Storage**: Data cached locally for offline access

### Public Spaces
- **Knowledge Graph**: Data becomes part of the shared knowledge graph
- **Discoverable**: Other apps can find and use your data
- **Permanent**: Stored on IPFS and blockchain
- **Interoperable**: Connected to other public entities

### Lifecycle Events

Spaces go through various lifecycle stages:

1. **Created**: New space initialized
2. **Configured**: Permissions and settings applied
3. **Active**: Users creating and editing data
4. **Published**: Public data shared to Knowledge Graph
5. **Archived**: Space marked as read-only

## Identities

Every user in Hypergraph has a unique identity tied to their Geo account.

### Identity Properties
- **Account Address**: Ethereum-style address
- **Public Key**: For encryption and signatures
- **Profile Data**: Name, avatar, etc. (optional)
- **Spaces**: List of accessible spaces

### Authentication Flow
1. User clicks "Connect with Geo"
2. Redirected to Geo Connect
3. User authorizes your app
4. Receives identity token
5. App can access user's spaces

## Inboxes

Inboxes enable communication between users and spaces.

### Use Cases
- Job applications
- Contact form submissions
- Event sign-ups
- Direct messages
- Space invitations

### Inbox Types
- **User Inbox**: Personal messages
- **Space Inbox**: Space-related communication
- **App Inbox**: Application notifications

## Events & CRDTs

Hypergraph uses Conflict-free Replicated Data Types (CRDTs) for real-time collaboration.

### How It Works
1. **Local Changes**: Edits made locally first
2. **Event Generation**: Changes become events
3. **Synchronization**: Events synced across devices
4. **Conflict Resolution**: CRDTs automatically merge changes
5. **Consistency**: All devices reach same state

### Event Types
- **Create**: New entity created
- **Update**: Entity property changed
- **Delete**: Entity removed
- **Relate**: Relationship added
- **Unrelate**: Relationship removed

## Security Model

Hypergraph provides multiple layers of security:

### Encryption
- **XChaCha20-Poly1305**: Industry-standard encryption
- **Client-Side**: Encryption happens in browser
- **Key Management**: Keys stored securely locally
- **Perfect Forward Secrecy**: Keys rotated regularly

### Access Control
- **Space-Based**: Permissions at space level
- **Invite-Only**: Private spaces require invitations
- **Role-Based**: Different permission levels
- **Audit Trail**: All access logged

### Data Integrity
- **Cryptographic Signatures**: All events signed
- **Merkle Trees**: Data integrity verification
- **Blockchain Anchoring**: Critical data on-chain
- **IPFS Storage**: Tamper-resistant storage

## GRC-20: The Protocol Under the Hood

GRC-20 is the underlying protocol that powers Hypergraph.

### Why Does GRC-20 Exist?

GRC-20 provides:
- **Standardization**: Common format for knowledge graph data
- **Interoperability**: Apps can share and understand each other's data
- **Versioning**: Schema evolution support
- **Validation**: Automatic data validation

### Key Features
- **JSON-LD Compatible**: Standard semantic web format
- **Schema Validation**: TypeScript-like type system
- **Relationship Modeling**: First-class relationship support
- **Event Sourcing**: All changes tracked as events`;
    if (includeExamples && format !== 'text') {
        docs += `

## Example: Blog Post Entity

\`\`\`typescript
// Define the entity
export class BlogPost extends Entity.Class<BlogPost>('BlogPost')({
  title: Type.Text,
  content: Type.Text,
  publishedAt: Type.Date,
  author: Type.Relation(User),
  tags: Type.Relation.List(Tag),
  published: Type.Checkbox
}) {}

// Create in private space
const createPost = useCreateEntity(BlogPost);
await createPost({
  title: 'My First Post',
  content: 'Hello, Hypergraph!',
  publishedAt: new Date(),
  published: false
});

// Publish to knowledge graph
const ops = preparePublish(BlogPost, postData, mapping);
await publishOps(ops);
\`\`\``;
    }
    return docs;
}
function generateBestPracticesDocs(format, includeExamples, language) {
    let docs = `# Best Practices

Guidelines for building robust, scalable Hypergraph applications.

## Schema Design

### 1. Keep Entities Focused
Each entity should represent a single concept:

✅ **Good**: \`User\`, \`Event\`, \`Comment\`
❌ **Bad**: \`UserEventComment\`

### 2. Use Descriptive Property Names
Properties should be self-documenting:

✅ **Good**: \`publishedAt\`, \`authorEmail\`, \`isPublic\`
❌ **Bad**: \`date\`, \`email\`, \`flag\`

### 3. Design for Evolution
Use optional properties for new features:

\`\`\`typescript
export class Event extends Entity.Class<Event>('Event')({
  name: Type.Text,
  description: Type.Text,
  // New optional properties can be added
  category?: Type.Text,
  maxAttendees?: Type.Number
}) {}
\`\`\`

### 4. Model Relationships Carefully
Consider cardinality and directionality:

\`\`\`typescript
// One-to-many: User has many Posts
export class User extends Entity.Class<User>('User')({
  posts: Type.Relation.List(Post)
}) {}

// Many-to-many: Post has many Tags, Tag has many Posts
export class Post extends Entity.Class<Post>('Post')({
  tags: Type.Relation.List(Tag)
}) {}
\`\`\`

## State Management

### 1. Use React Hooks Properly
Follow React hooks rules:

\`\`\`typescript
// ✅ Good: Hooks at top level
function EventList() {
  const { data: events } = useQuery(Event, { mode: 'private' });
  const createEvent = useCreateEntity(Event);
  
  // Component logic here
}

// ❌ Bad: Conditional hooks
function EventList() {
  if (condition) {
    const { data } = useQuery(Event); // Don't do this
  }
}
\`\`\`

### 2. Handle Loading States
Always handle loading and error states:

\`\`\`typescript
function EventList() {
  const { data: events, loading, error } = useQuery(Event, { mode: 'private' });
  
  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!events?.length) return <div>No events found</div>;
  
  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
\`\`\`

### 3. Optimize Re-renders
Use React.memo and useMemo for expensive operations:

\`\`\`typescript
const EventCard = React.memo(({ event }: { event: Event }) => {
  const formattedDate = useMemo(
    () => event.date.toLocaleDateString(),
    [event.date]
  );
  
  return (
    <div>
      <h3>{event.name}</h3>
      <p>{formattedDate}</p>
    </div>
  );
});
\`\`\`

## Authentication & Security

### 1. Handle Auth State Properly
Always check authentication state:

\`\`\`typescript
function App() {
  const { isAuthenticated, loading } = useHypergraphAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? <AuthenticatedApp /> : <LoginScreen />;
}
\`\`\`

### 2. Validate Data Before Publishing
Always validate before publishing to Knowledge Graph:

\`\`\`typescript
const publishEvent = async (eventData) => {
  // Validate required fields
  if (!eventData.name || !eventData.date) {
    throw new Error('Name and date are required');
  }
  
  // Check data quality
  if (eventData.name.length < 3) {
    throw new Error('Event name too short');
  }
  
  // Prepare and publish
  const ops = preparePublish(Event, eventData, mapping);
  await publishOps(ops);
};
\`\`\`

### 3. Handle Sensitive Data
Never publish sensitive data to public Knowledge Graph:

\`\`\`typescript
// ✅ Good: Keep sensitive data private
const createUser = useCreateEntity(User);
await createUser({
  name: 'John Doe',
  email: 'john@example.com', // Keep private
  publicProfile: 'Developer at Acme Corp' // Can be public
});

// ❌ Bad: Don't publish sensitive data
const ops = preparePublish(User, userData, mapping); // userData contains email
\`\`\`

## Performance

### 1. Use Efficient Queries
Query only what you need:

\`\`\`typescript
// ✅ Good: Specific query
const { data: events } = useQuery(Event, {
  mode: 'private',
  filter: { published: { is: true } },
  include: { relations: false } // Don't load relations if not needed
});

// ❌ Bad: Loading everything
const { data: events } = useQuery(Event, {
  mode: 'private',
  include: { relations: true } // Loads all relations
});
\`\`\`

### 2. Implement Pagination
For large datasets, use pagination:

\`\`\`typescript
function EventList() {
  const [page, setPage] = useState(0);
  const pageSize = 20;
  
  const { data: events } = useQuery(Event, {
    mode: 'private',
    offset: page * pageSize,
    limit: pageSize
  });
  
  return (
    <div>
      {events?.map(event => <EventCard key={event.id} event={event} />)}
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
\`\`\`

### 3. Batch Operations
Group related operations:

\`\`\`typescript
// ✅ Good: Batch publishing
const publishMultipleEvents = async (events) => {
  const allOps = [];
  
  for (const event of events) {
    const ops = preparePublish(Event, event, mapping);
    allOps.push(...ops);
  }
  
  await publishOps(allOps); // Single network call
};

// ❌ Bad: Individual publishes
const publishMultipleEvents = async (events) => {
  for (const event of events) {
    const ops = preparePublish(Event, event, mapping);
    await publishOps(ops); // Multiple network calls
  }
};
\`\`\`

## Error Handling

### 1. Use Error Boundaries
Wrap components in error boundaries:

\`\`\`typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    
    return this.props.children;
  }
}
\`\`\`

### 2. Provide User-Friendly Messages
Convert technical errors to user-friendly messages:

\`\`\`typescript
const handleError = (error) => {
  let message = 'An unexpected error occurred';
  
  if (error.message.includes('validation')) {
    message = 'Please check your input and try again';
  } else if (error.message.includes('network')) {
    message = 'Please check your internet connection';
  } else if (error.message.includes('authentication')) {
    message = 'Please sign in again';
  }
  
  setErrorMessage(message);
};
\`\`\`

### 3. Implement Retry Logic
Add retry for transient failures:

\`\`\`typescript
const publishWithRetry = async (data, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const ops = preparePublish(Event, data, mapping);
      await publishOps(ops);
      return; // Success
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
\`\`\`

## Testing

### 1. Test Components in Isolation
Use React Testing Library:

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';
import { EventCard } from './EventCard';

test('renders event card', () => {
  const mockEvent = {
    id: '1',
    name: 'Test Event',
    date: new Date('2024-06-15'),
    description: 'A test event'
  };
  
  render(
    <HypergraphAppProvider mapping={mockMapping}>
      <EventCard event={mockEvent} />
    </HypergraphAppProvider>
  );
  
  expect(screen.getByText('Test Event')).toBeInTheDocument();
});
\`\`\`

### 2. Mock Hypergraph Hooks
Create mock implementations for testing:

\`\`\`typescript
// __mocks__/@graphprotocol/hypergraph-react.js
export const useQuery = jest.fn();
export const useCreateEntity = jest.fn();
export const useHypergraphAuth = jest.fn();

// In tests
import { useQuery } from '@graphprotocol/hypergraph-react';

beforeEach(() => {
  useQuery.mockReturnValue({
    data: mockEvents,
    loading: false,
    error: null
  });
});
\`\`\`

### 3. Test Schema Validation
Validate your schema definitions:

\`\`\`typescript
test('Event schema validation', () => {
  const validEvent = {
    name: 'Valid Event',
    description: 'A valid event description',
    date: new Date()
  };
  
  expect(() => Event.validate(validEvent)).not.toThrow();
  
  const invalidEvent = {
    name: '', // Invalid: empty name
    date: 'not-a-date' // Invalid: wrong type
  };
  
  expect(() => Event.validate(invalidEvent)).toThrow();
});
\`\`\`

## Deployment

### 1. Environment Configuration
Use environment variables for configuration:

\`\`\`typescript
const config = {
  hypergraph: {
    apiUrl: process.env.REACT_APP_HYPERGRAPH_API_URL,
    clientId: process.env.REACT_APP_CLIENT_ID
  },
  environment: process.env.NODE_ENV
};
\`\`\`

### 2. Build Optimization
Configure webpack for production:

\`\`\`javascript
// webpack.config.js
module.exports = {
  // ... other config
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        hypergraph: {
          test: /[\\/]node_modules[\\/]@graphprotocol[\\/]/,
          name: 'hypergraph',
          chunks: 'all'
        }
      }
    }
  }
};
\`\`\`

### 3. Health Checks
Implement health check endpoints:

\`\`\`typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
\`\`\``;
    return docs;
}
function generateTroubleshootingDocs(format, includeExamples, language) {
    let docs = `# Troubleshooting

Common issues and solutions when working with Hypergraph.

## Authentication Issues

### Problem: "Authentication Failed" Error

**Symptoms:**
- User redirected but authentication fails
- Console shows auth-related errors
- User not logged in after redirect

**Solutions:**

1. **Check Redirect URI**
   \`\`\`typescript
   // Ensure redirect URI matches exactly
   const config = {
     redirectUri: window.location.origin + '/auth/callback'
   };
   \`\`\`

2. **Verify Client ID**
   \`\`\`bash
   # Check environment variables
   echo $REACT_APP_HYPERGRAPH_CLIENT_ID
   \`\`\`

3. **Clear Browser Storage**
   \`\`\`javascript
   // Clear all Hypergraph data
   localStorage.removeItem('hypergraph-auth-token');
   localStorage.removeItem('hypergraph-user-data');
   sessionStorage.clear();
   \`\`\`

### Problem: Infinite Redirect Loop

**Symptoms:**
- Browser keeps redirecting between app and auth provider
- URL contains multiple auth parameters

**Solutions:**

1. **Clear URL Parameters After Auth**
   \`\`\`typescript
   useEffect(() => {
     const urlParams = new URLSearchParams(window.location.search);
     if (urlParams.get('code')) {
       // Process auth code
       processAuthCode(urlParams.get('code'));
       // Clear URL
       window.history.replaceState({}, document.title, window.location.pathname);
     }
   }, []);
   \`\`\`

2. **Check Auth State Properly**
   \`\`\`typescript
   const { isAuthenticated, loading } = useHypergraphAuth();
   
   // Don't redirect if already authenticated
   if (isAuthenticated) {
     return <AuthenticatedApp />;
   }
   
   if (loading) {
     return <div>Loading...</div>;
   }
   
   return <LoginScreen />;
   \`\`\`

## Data Synchronization Issues

### Problem: Data Not Syncing

**Symptoms:**
- Changes made on one device don't appear on another
- Data seems outdated
- Sync status shows errors

**Solutions:**

1. **Check Network Connectivity**
   \`\`\`typescript
   const checkConnectivity = async () => {
     try {
       await fetch('/api/health');
       console.log('Network connection OK');
     } catch (error) {
       console.error('Network issue:', error);
     }
   };
   \`\`\`

2. **Force Sync**
   \`\`\`typescript
   const { forcSync } = useHypergraphApp();
   
   const handleForceSync = async () => {
     try {
       await forceSync();
       console.log('Sync completed');
     } catch (error) {
       console.error('Sync failed:', error);
     }
   };
   \`\`\`

3. **Check Space Permissions**
   \`\`\`typescript
   const { spaces } = useHypergraphApp();
   
   // Verify user has access to space
   const hasAccess = spaces.some(space => space.id === targetSpaceId);
   if (!hasAccess) {
     console.error('No access to space:', targetSpaceId);
   }
   \`\`\`

### Problem: Conflict Resolution Errors

**Symptoms:**
- Data appears inconsistent across devices
- Error messages about conflicts
- Some changes seem to be lost

**Solutions:**

1. **Understand CRDT Behavior**
   \`\`\`typescript
   // CRDTs automatically resolve conflicts
   // Last-write-wins for simple properties
   // Set union for arrays
   // Custom resolution for complex types
   \`\`\`

2. **Handle Concurrent Edits**
   \`\`\`typescript
   const updateEntity = useUpdateEntity(Event);
   
   const handleUpdate = async (id, changes) => {
     try {
       await updateEntity(id, changes);
     } catch (error) {
       if (error.message.includes('conflict')) {
         // Reload entity and retry
         const latest = await refetchEntity(id);
         await updateEntity(id, { ...latest, ...changes });
       }
     }
   };
   \`\`\`

## Query Issues

### Problem: Queries Return No Data

**Symptoms:**
- useQuery returns empty array
- Loading state completes but no data
- Query works in one context but not another

**Solutions:**

1. **Check Query Mode**
   \`\`\`typescript
   // Make sure you're querying the right mode
   const { data } = useQuery(Event, { 
     mode: 'private' // or 'public'
   });
   \`\`\`

2. **Verify Space Context**
   \`\`\`typescript
   // Ensure you're in the right space
   const { data } = useQuery(Event, { 
     mode: 'private',
     space: 'specific-space-id' // optional
   });
   \`\`\`

3. **Check Filters**
   \`\`\`typescript
   // Verify filter syntax
   const { data } = useQuery(Event, {
     mode: 'private',
     filter: {
       published: { is: true }, // Correct syntax
       // not: published: true // Incorrect
     }
   });
   \`\`\`

### Problem: Query Performance Issues

**Symptoms:**
- Queries take long time to complete
- UI feels sluggish
- High memory usage

**Solutions:**

1. **Limit Query Results**
   \`\`\`typescript
   const { data } = useQuery(Event, {
     mode: 'private',
     limit: 50, // Limit results
     offset: page * 50 // Implement pagination
   });
   \`\`\`

2. **Avoid Loading Relations Unnecessarily**
   \`\`\`typescript
   const { data } = useQuery(Event, {
     mode: 'private',
     include: { 
       relations: false // Don't load relations
     }
   });
   \`\`\`

3. **Use Specific Filters**
   \`\`\`typescript
   // More specific filters reduce data processed
   const { data } = useQuery(Event, {
     mode: 'private',
     filter: {
       date: { gte: startDate, lte: endDate },
       category: { is: 'conference' }
     }
   });
   \`\`\`

## Schema and Mapping Issues

### Problem: Schema Validation Errors

**Symptoms:**
- TypeScript compilation errors
- Runtime validation failures
- Data not matching expected format

**Solutions:**

1. **Check Entity Definition**
   \`\`\`typescript
   // Ensure proper syntax
   export class Event extends Entity.Class<Event>('Event')({
     name: Type.Text, // ✅ Correct
     // name: Type.String, // ❌ Wrong - use Type.Text
     date: Type.Date,
     attendees: Type.Number
   }) {}
   \`\`\`

2. **Validate Property Types**
   \`\`\`typescript
   // Make sure data matches schema
   const eventData = {
     name: 'Conference', // string ✅
     date: new Date(), // Date object ✅
     attendees: 100 // number ✅
     // attendees: '100' // ❌ string instead of number
   };
   \`\`\`

3. **Fix Relation Definitions**
   \`\`\`typescript
   export class Event extends Entity.Class<Event>('Event')({
     organizer: Type.Relation(User), // Single relation
     attendees: Type.Relation.List(User), // Multiple relations
     tags: Type.Relation.List(Tag)
   }) {}
   \`\`\`

### Problem: Mapping Configuration Errors

**Symptoms:**
- Publishing to Knowledge Graph fails
- Mapping validation errors
- Data not appearing in public queries

**Solutions:**

1. **Verify Property IDs**
   \`\`\`typescript
   export const mapping: Mapping = {
     Event: {
       typeId: 'https://schema.org/Event', // Valid URI ✅
       properties: {
         name: 'https://schema.org/name', // Valid property ✅
         // name: 'name', // ❌ Not a valid URI
       }
     }
   };
   \`\`\`

2. **Check Schema.org Compatibility**
   \`\`\`typescript
   // Use standard schema.org properties when possible
   export const mapping: Mapping = {
     Event: {
       typeId: 'https://schema.org/Event',
       properties: {
         name: 'https://schema.org/name',
         description: 'https://schema.org/description',
         startDate: 'https://schema.org/startDate',
         location: 'https://schema.org/location'
       }
     }
   };
   \`\`\`

## Publishing Issues

### Problem: Publishing Fails

**Symptoms:**
- publishOps throws errors
- Data not appearing in public Knowledge Graph
- Network errors during publishing

**Solutions:**

1. **Validate Before Publishing**
   \`\`\`typescript
   const publishEvent = async (eventData) => {
     // Validate required fields
     if (!eventData.name || !eventData.date) {
       throw new Error('Name and date are required');
     }
     
     try {
       const ops = preparePublish(Event, eventData, mapping);
       await publishOps(ops);
     } catch (error) {
       console.error('Publishing failed:', error);
       throw error;
     }
   };
   \`\`\`

2. **Check Network Status**
   \`\`\`typescript
   const publishWithRetry = async (data, maxRetries = 3) => {
     for (let attempt = 1; attempt <= maxRetries; attempt++) {
       try {
         const ops = preparePublish(Event, data, mapping);
         await publishOps(ops);
         return;
       } catch (error) {
         if (attempt === maxRetries) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
       }
     }
   };
   \`\`\`

3. **Verify Publishing Permissions**
   \`\`\`typescript
   const { canPublish } = useHypergraphAuth();
   
   if (!canPublish) {
     throw new Error('User does not have publishing permissions');
   }
   \`\`\`

## Development Environment Issues

### Problem: Hot Reload Not Working

**Solutions:**

1. **Check File Watchers**
   \`\`\`bash
   # Increase file watcher limit on Linux
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   \`\`\`

2. **Clear Development Cache**
   \`\`\`bash
   # Clear Next.js cache
   rm -rf .next
   
   # Clear React cache
   rm -rf node_modules/.cache
   \`\`\`

### Problem: Module Resolution Errors

**Solutions:**

1. **Check Package Installation**
   \`\`\`bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

2. **Verify Import Paths**
   \`\`\`typescript
   // Use correct import paths
   import { useQuery } from '@graphprotocol/hypergraph-react'; // ✅
   // import { useQuery } from 'hypergraph-react'; // ❌
   \`\`\`

## Getting Help

If these solutions don't resolve your issue:

1. **Check the Console**: Look for detailed error messages
2. **Enable Debug Mode**: Set \`REACT_APP_DEBUG=true\`
3. **Review Documentation**: Visit docs.hypergraph.thegraph.com
4. **Join Discord**: Get help from the community
5. **File an Issue**: Report bugs on GitHub

## Debug Mode

Enable verbose logging:

\`\`\`typescript
// Add to your app initialization
if (process.env.REACT_APP_DEBUG === 'true') {
  window.hypergraphDebug = true;
}
\`\`\`

This will log detailed information about:
- Authentication flows
- Data synchronization
- Query execution
- Publishing operations`;
    return docs;
}
function generateAPIReferenceDocs(format, includeExamples, language) {
    let docs = `# API Reference

Complete reference for Hypergraph React hooks and utilities.

## React Hooks

### useQuery

Query entities from private or public spaces.

\`\`\`typescript
const { data, loading, error, refetch } = useQuery(EntityClass, options);
\`\`\`

**Parameters:**
- \`EntityClass\`: The entity class to query
- \`options\`: Query configuration object

**Options:**
\`\`\`typescript
interface QueryOptions {
  mode: 'private' | 'public';
  space?: string;
  filter?: FilterObject;
  include?: {
    relations?: boolean;
  };
  limit?: number;
  offset?: number;
}
\`\`\`

**Returns:**
\`\`\`typescript
interface QueryResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
\`\`\`

**Examples:**
\`\`\`typescript
// Basic query
const { data: events } = useQuery(Event, { mode: 'private' });

// With filters
const { data: events } = useQuery(Event, {
  mode: 'private',
  filter: {
    published: { is: true },
    date: { gte: new Date() }
  }
});

// With pagination
const { data: events } = useQuery(Event, {
  mode: 'private',
  limit: 20,
  offset: page * 20
});
\`\`\`

### useCreateEntity

Create new entities in private spaces.

\`\`\`typescript
const createEntity = useCreateEntity(EntityClass);
\`\`\`

**Parameters:**
- \`EntityClass\`: The entity class to create

**Returns:**
\`\`\`typescript
type CreateEntityFunction<T> = (data: Partial<T>) => Promise<T>;
\`\`\`

**Example:**
\`\`\`typescript
const createEvent = useCreateEntity(Event);

const handleSubmit = async (formData) => {
  try {
    const newEvent = await createEvent({
      name: formData.name,
      description: formData.description,
      date: new Date(formData.date)
    });
    console.log('Created event:', newEvent);
  } catch (error) {
    console.error('Failed to create event:', error);
  }
};
\`\`\`

### useUpdateEntity

Update existing entities.

\`\`\`typescript
const updateEntity = useUpdateEntity(EntityClass);
\`\`\`

**Parameters:**
- \`EntityClass\`: The entity class to update

**Returns:**
\`\`\`typescript
type UpdateEntityFunction<T> = (id: string, updates: Partial<T>) => Promise<T>;
\`\`\`

**Example:**
\`\`\`typescript
const updateEvent = useUpdateEntity(Event);

const handleUpdate = async (eventId, changes) => {
  try {
    const updatedEvent = await updateEvent(eventId, changes);
    console.log('Updated event:', updatedEvent);
  } catch (error) {
    console.error('Failed to update event:', error);
  }
};
\`\`\`

### useDeleteEntity

Delete entities from private spaces.

\`\`\`typescript
const deleteEntity = useDeleteEntity(EntityClass);
\`\`\`

**Example:**
\`\`\`typescript
const deleteEvent = useDeleteEntity(Event);

const handleDelete = async (eventId) => {
  if (confirm('Are you sure?')) {
    await deleteEntity(eventId);
  }
};
\`\`\`

### useHypergraphApp

Access core Hypergraph app functionality.

\`\`\`typescript
const {
  createSpace,
  listSpaces,
  inviteToSpace,
  listInvitations,
  acceptInvitation,
  publishToKnowledgeGraph
} = useHypergraphApp();
\`\`\`

**Space Management:**
\`\`\`typescript
// Create a new space
const newSpace = await createSpace({
  name: 'My Project',
  description: 'A collaborative project space',
  public: false
});

// List user's spaces
const spaces = await listSpaces();

// Invite user to space
await inviteToSpace({
  space: spaceId,
  invitee: { accountAddress: userAddress }
});
\`\`\`

### useHypergraphAuth

Manage user authentication.

\`\`\`typescript
const {
  isAuthenticated,
  user,
  loading,
  redirectToConnect,
  processConnectAuthSuccess,
  logout
} = useHypergraphAuth();
\`\`\`

**Authentication Flow:**
\`\`\`typescript
// Redirect to authentication
const handleLogin = async () => {
  await redirectToConnect();
};

// Process auth callback
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  
  if (code && state) {
    processConnectAuthSuccess(code, state);
  }
}, []);

// Logout
const handleLogout = () => {
  logout();
};
\`\`\`

## Utility Functions

### preparePublish

Prepare entity data for publishing to Knowledge Graph.

\`\`\`typescript
const ops = preparePublish(EntityClass, data, mapping);
\`\`\`

**Parameters:**
- \`EntityClass\`: Entity class
- \`data\`: Entity data
- \`mapping\`: Knowledge Graph mapping

**Returns:**
Array of operations to publish

### publishOps

Execute publishing operations.

\`\`\`typescript
await publishOps(operations);
\`\`\`

**Example:**
\`\`\`typescript
const publishEvent = async (eventData) => {
  const ops = preparePublish(Event, eventData, mapping);
  await publishOps(ops);
};
\`\`\`

### validateMapping

Validate mapping configuration.

\`\`\`typescript
const { isValid, errors } = validateMapping(mapping);
\`\`\`

## Providers

### HypergraphAppProvider

Root provider for Hypergraph functionality.

\`\`\`typescript
<HypergraphAppProvider mapping={mapping}>
  <App />
</HypergraphAppProvider>
\`\`\`

**Props:**
\`\`\`typescript
interface HypergraphAppProviderProps {
  mapping: Mapping;
  children: React.ReactNode;
  config?: {
    apiUrl?: string;
    authConfig?: AuthConfig;
  };
}
\`\`\`

### HypergraphSpaceProvider

Provider for space-specific functionality.

\`\`\`typescript
<HypergraphSpaceProvider spaceId={spaceId}>
  <SpaceContent />
</HypergraphSpaceProvider>
\`\`\`

## Type Definitions

### Entity Types

\`\`\`typescript
// Text type
Type.Text
Type.Text.email() // with email validation
Type.Text.url() // with URL validation

// Number type
Type.Number
Type.Number.min(0) // with minimum value
Type.Number.max(100) // with maximum value

// Boolean type
Type.Checkbox

// Date type
Type.Date

// JSON type
Type.JSON

// Relation types
Type.Relation(TargetEntity) // One-to-one
Type.Relation.List(TargetEntity) // One-to-many
\`\`\`

### Filter Operators

\`\`\`typescript
interface FilterOperators {
  is: any; // Equality
  not: any; // Inequality
  contains: string; // Text contains
  startsWith: string; // Text starts with
  endsWith: string; // Text ends with
  gt: number | Date; // Greater than
  gte: number | Date; // Greater than or equal
  lt: number | Date; // Less than
  lte: number | Date; // Less than or equal
  in: any[]; // Value in array
  notIn: any[]; // Value not in array
}
\`\`\`

### Mapping Configuration

\`\`\`typescript
interface Mapping {
  [entityName: string]: {
    typeId: string; // Knowledge Graph type URI
    properties: {
      [propertyName: string]: string; // Knowledge Graph property URI
    };
    relations?: {
      [relationName: string]: string; // Knowledge Graph relation URI
    };
  };
}
\`\`\`

## Error Handling

### Common Error Types

\`\`\`typescript
// Authentication errors
class AuthenticationError extends Error {
  code: 'AUTH_FAILED' | 'TOKEN_EXPIRED' | 'INSUFFICIENT_PERMISSIONS';
}

// Validation errors
class ValidationError extends Error {
  code: 'VALIDATION_FAILED';
  details: string[];
}

// Network errors
class NetworkError extends Error {
  code: 'NETWORK_ERROR' | 'TIMEOUT' | 'SERVER_ERROR';
  status?: number;
}

// Conflict errors (CRDT)
class ConflictError extends Error {
  code: 'CONFLICT_RESOLUTION_FAILED';
  conflictData: any;
}
\`\`\`

### Error Handling Patterns

\`\`\`typescript
try {
  const result = await someHypergraphOperation();
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth errors
    redirectToLogin();
  } else if (error instanceof ValidationError) {
    // Handle validation errors
    showValidationErrors(error.details);
  } else if (error instanceof NetworkError) {
    // Handle network errors
    showRetryOption();
  } else {
    // Handle unexpected errors
    logError(error);
    showGenericError();
  }
}
\`\`\``;
    return docs;
}
// Placeholder functions for other documentation sections
function generateAuthenticationDocs(format, includeExamples, language) {
    return `# Authentication Documentation\n\nAuthentication setup with Geo Connect...`;
}
function generateSpacesDocs(format, includeExamples, language) {
    return `# Spaces Documentation\n\nManaging public and private spaces...`;
}
function generateSchemaDocs(format, includeExamples, language) {
    return `# Schema Documentation\n\nDefining entities and relationships...`;
}
function generateQueriesDocs(format, includeExamples, language) {
    return `# Queries Documentation\n\nQuerying private and public data...`;
}
function generateProvidersDocs(format, includeExamples, language) {
    return `# Providers Documentation\n\nSetting up React providers...`;
}
function generateMappingDocs(format, includeExamples, language) {
    return `# Mapping Documentation\n\nConnecting to the Knowledge Graph...`;
}
function generatePublishingDocs(format, includeExamples, language) {
    return `# Publishing Documentation\n\nPublishing data to the Knowledge Graph...`;
}
function generateKeyFeaturesDocs(format, includeExamples, language) {
    return `# Key Features Documentation\n\nEnd-to-end encryption, CRDTs, and more...`;
}
//# sourceMappingURL=documentation.js.map