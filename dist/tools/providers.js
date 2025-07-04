export function createProviderHelperTool() {
    return {
        name: 'setup_providers',
        description: 'Generate Hypergraph provider components and hooks setup',
        inputSchema: {
            type: 'object',
            properties: {
                providerType: {
                    type: 'string',
                    enum: ['app', 'space', 'both'],
                    description: 'Type of provider to setup',
                    default: 'both'
                },
                includeAuth: {
                    type: 'boolean',
                    description: 'Include authentication provider',
                    default: true
                },
                includeCustomHooks: {
                    type: 'boolean',
                    description: 'Generate custom hooks',
                    default: true
                },
                appName: {
                    type: 'string',
                    description: 'Application name',
                    default: 'MyHypergraphApp'
                },
                framework: {
                    type: 'string',
                    enum: ['react', 'typescript'],
                    description: 'Framework for implementation',
                    default: 'react'
                }
            },
            required: [],
        },
    };
}
export async function handleSetupProviders(args) {
    const { providerType, includeAuth, includeCustomHooks, appName, framework } = args;
    const providerCode = generateProviderCode(providerType, includeAuth, includeCustomHooks, appName, framework);
    return {
        content: [
            {
                type: 'text',
                text: providerCode,
            },
        ],
    };
}
function generateProviderCode(providerType, includeAuth, includeCustomHooks, appName, framework) {
    let providerCode = `// Hypergraph Provider Setup\n`;
    if (framework === 'react') {
        providerCode += generateReactProviderCode(providerType, includeAuth, includeCustomHooks, appName);
    }
    else {
        providerCode += generateTypescriptProviderCode(providerType, includeAuth, includeCustomHooks, appName);
    }
    return providerCode;
}
function generateReactProviderCode(providerType, includeAuth, includeCustomHooks, appName) {
    let code = `\nimport React, { createContext, useContext, useState, useEffect } from 'react';\nimport { \n  HypergraphAppProvider,\n  HypergraphSpaceProvider,\n  useHypergraphApp,\n  useHypergraphAuth\n} from '@graphprotocol/hypergraph-react';\nimport { mapping } from './mapping';\n\n`;
    // Generate App Provider setup
    if (providerType === 'app' || providerType === 'both') {
        code += generateAppProviderCode(includeAuth, appName);
    }
    // Generate Space Provider setup
    if (providerType === 'space' || providerType === 'both') {
        code += generateSpaceProviderCode();
    }
    // Generate main provider wrapper
    code += generateMainProviderWrapper(providerType, includeAuth, appName);
    if (includeCustomHooks) {
        code += generateCustomHooks(providerType, includeAuth);
    }
    // Generate usage examples
    code += generateProviderUsageExamples(providerType, appName);
    return code;
}
function generateAppProviderCode(includeAuth, appName) {
    let code = `// Main App Provider Configuration\nexport function ${appName}Provider({ children }: { children: React.ReactNode }) {\n`;
    if (includeAuth) {
        code += `  const [isInitialized, setIsInitialized] = useState(false);\n`;
        code += `  const [authConfig, setAuthConfig] = useState(null);\n\n`;
        code += `  useEffect(() => {\n`;
        code += `    // Initialize authentication configuration\n`;
        code += `    const initAuth = async () => {\n`;
        code += `      try {\n`;
        code += `        // Setup auth configuration here\n`;
        code += `        const config = {\n`;
        code += `          // Add your auth configuration\n`;
        code += `          redirectUri: window.location.origin + '/auth/callback',\n`;
        code += `          clientId: process.env.REACT_APP_HYPERGRAPH_CLIENT_ID,\n`;
        code += `        };\n`;
        code += `        setAuthConfig(config);\n`;
        code += `        setIsInitialized(true);\n`;
        code += `      } catch (error) {\n`;
        code += `        console.error('Failed to initialize auth:', error);\n`;
        code += `      }\n`;
        code += `    };\n\n`;
        code += `    initAuth();\n`;
        code += `  }, []);\n\n`;
        code += `  if (!isInitialized) {\n`;
        code += `    return (\n`;
        code += `      <div className="app-loading">\n`;
        code += `        <p>Initializing ${appName}...</p>\n`;
        code += `      </div>\n`;
        code += `    );\n`;
        code += `  }\n\n`;
    }
    code += `  return (\n`;
    code += `    <HypergraphAppProvider \n`;
    code += `      mapping={mapping}\n`;
    if (includeAuth) {
        code += `      authConfig={authConfig}\n`;
    }
    code += `    >\n`;
    if (includeAuth) {
        code += `      <AuthenticationWrapper>\n`;
        code += `        {children}\n`;
        code += `      </AuthenticationWrapper>\n`;
    }
    else {
        code += `      {children}\n`;
    }
    code += `    </HypergraphAppProvider>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    if (includeAuth) {
        code += generateAuthWrapper();
    }
    return code;
}
function generateAuthWrapper() {
    let code = `// Authentication Wrapper Component\nfunction AuthenticationWrapper({ children }: { children: React.ReactNode }) {\n`;
    code += `  const { isAuthenticated, user, loading } = useHypergraphAuth();\n`;
    code += `  const [showAuth, setShowAuth] = useState(false);\n\n`;
    code += `  useEffect(() => {\n`;
    code += `    // Auto-show auth modal if not authenticated\n`;
    code += `    if (!loading && !isAuthenticated) {\n`;
    code += `      setShowAuth(true);\n`;
    code += `    }\n`;
    code += `  }, [loading, isAuthenticated]);\n\n`;
    code += `  if (loading) {\n`;
    code += `    return (\n`;
    code += `      <div className="auth-loading">\n`;
    code += `        <p>Checking authentication...</p>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;
    code += `  if (!isAuthenticated) {\n`;
    code += `    return (\n`;
    code += `      <div className="auth-required">\n`;
    code += `        <AuthenticationModal \n`;
    code += `          show={showAuth} \n`;
    code += `          onClose={() => setShowAuth(false)}\n`;
    code += `        />\n`;
    code += `        <div className="app-unauthorized">\n`;
    code += `          <h2>Authentication Required</h2>\n`;
    code += `          <p>Please sign in to access the application.</p>\n`;
    code += `          <button onClick={() => setShowAuth(true)}>\n`;
    code += `            Sign In\n`;
    code += `          </button>\n`;
    code += `        </div>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;
    code += `  return (\n`;
    code += `    <div className="app-authenticated">\n`;
    code += `      <UserInfoBar user={user} />\n`;
    code += `      {children}\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    // User info bar
    code += `// User Info Bar Component\nfunction UserInfoBar({ user }: { user: any }) {\n`;
    code += `  const { logout } = useHypergraphAuth();\n\n`;
    code += `  return (\n`;
    code += `    <div className="user-info-bar">\n`;
    code += `      <div className="user-details">\n`;
    code += `        <span className="user-name">{user?.name || 'User'}</span>\n`;
    code += `        <span className="user-address">{user?.accountAddress}</span>\n`;
    code += `      </div>\n`;
    code += `      <button onClick={logout} className="logout-btn">\n`;
    code += `        Logout\n`;
    code += `      </button>\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    // Auth modal
    code += `// Authentication Modal Component\nfunction AuthenticationModal({ show, onClose }: { show: boolean; onClose: () => void }) {\n`;
    code += `  const { redirectToConnect } = useHypergraphAuth();\n`;
    code += `  const [loading, setLoading] = useState(false);\n\n`;
    code += `  const handleConnect = async () => {\n`;
    code += `    setLoading(true);\n`;
    code += `    try {\n`;
    code += `      await redirectToConnect();\n`;
    code += `    } catch (error) {\n`;
    code += `      console.error('Connect failed:', error);\n`;
    code += `    } finally {\n`;
    code += `      setLoading(false);\n`;
    code += `    }\n`;
    code += `  };\n\n`;
    code += `  if (!show) return null;\n\n`;
    code += `  return (\n`;
    code += `    <div className="modal-overlay">\n`;
    code += `      <div className="modal-content">\n`;
    code += `        <div className="modal-header">\n`;
    code += `          <h3>Connect to Hypergraph</h3>\n`;
    code += `          <button onClick={onClose} className="close-btn">×</button>\n`;
    code += `        </div>\n`;
    code += `        <div className="modal-body">\n`;
    code += `          <p>Connect your Geo account to access your spaces and data.</p>\n`;
    code += `          <button \n`;
    code += `            onClick={handleConnect}\n`;
    code += `            disabled={loading}\n`;
    code += `            className="connect-btn"\n`;
    code += `          >\n`;
    code += `            {loading ? 'Connecting...' : 'Connect with Geo'}\n`;
    code += `          </button>\n`;
    code += `        </div>\n`;
    code += `      </div>\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    return code;
}
function generateSpaceProviderCode() {
    let code = `// Space Provider Configuration\nexport function SpaceProviderWrapper({ \n`;
    code += `  spaceId, \n`;
    code += `  children \n`;
    code += `}: { \n`;
    code += `  spaceId: string;\n`;
    code += `  children: React.ReactNode;\n`;
    code += `}) {\n`;
    code += `  const [spaceConfig, setSpaceConfig] = useState(null);\n`;
    code += `  const [loading, setLoading] = useState(true);\n`;
    code += `  const [error, setError] = useState(null);\n\n`;
    code += `  useEffect(() => {\n`;
    code += `    const loadSpaceConfig = async () => {\n`;
    code += `      try {\n`;
    code += `        setLoading(true);\n`;
    code += `        setError(null);\n\n`;
    code += `        // Load space configuration\n`;
    code += `        const config = {\n`;
    code += `          spaceId,\n`;
    code += `          // Add any space-specific configuration\n`;
    code += `        };\n\n`;
    code += `        setSpaceConfig(config);\n`;
    code += `      } catch (err) {\n`;
    code += `        setError(err.message);\n`;
    code += `        console.error('Failed to load space config:', err);\n`;
    code += `      } finally {\n`;
    code += `        setLoading(false);\n`;
    code += `      }\n`;
    code += `    };\n\n`;
    code += `    if (spaceId) {\n`;
    code += `      loadSpaceConfig();\n`;
    code += `    }\n`;
    code += `  }, [spaceId]);\n\n`;
    code += `  if (loading) {\n`;
    code += `    return (\n`;
    code += `      <div className="space-loading">\n`;
    code += `        <p>Loading space...</p>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;
    code += `  if (error) {\n`;
    code += `    return (\n`;
    code += `      <div className="space-error">\n`;
    code += `        <p>Error loading space: {error}</p>\n`;
    code += `        <button onClick={() => window.location.reload()}>\n`;
    code += `          Retry\n`;
    code += `        </button>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;
    code += `  if (!spaceConfig) {\n`;
    code += `    return (\n`;
    code += `      <div className="space-not-found">\n`;
    code += `        <p>Space not found</p>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;
    code += `  return (\n`;
    code += `    <HypergraphSpaceProvider spaceId={spaceId}>\n`;
    code += `      <SpaceContext.Provider value={spaceConfig}>\n`;
    code += `        {children}\n`;
    code += `      </SpaceContext.Provider>\n`;
    code += `    </HypergraphSpaceProvider>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    // Space context
    code += `// Space Context\nconst SpaceContext = createContext(null);\n\n`;
    code += `export function useSpaceConfig() {\n`;
    code += `  const context = useContext(SpaceContext);\n`;
    code += `  if (!context) {\n`;
    code += `    throw new Error('useSpaceConfig must be used within a SpaceProviderWrapper');\n`;
    code += `  }\n`;
    code += `  return context;\n`;
    code += `}\n\n`;
    return code;
}
function generateMainProviderWrapper(providerType, includeAuth, appName) {
    let code = `// Main Provider Wrapper\nexport function ${appName}Providers({ children }: { children: React.ReactNode }) {\n`;
    if (providerType === 'both') {
        code += `  const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(null);\n\n`;
        code += `  return (\n`;
        code += `    <${appName}Provider>\n`;
        code += `      <SpaceManager onSpaceChange={setCurrentSpaceId}>\n`;
        code += `        {currentSpaceId ? (\n`;
        code += `          <SpaceProviderWrapper spaceId={currentSpaceId}>\n`;
        code += `            {children}\n`;
        code += `          </SpaceProviderWrapper>\n`;
        code += `        ) : (\n`;
        code += `          <SpaceSelector onSpaceSelect={setCurrentSpaceId} />\n`;
        code += `        )}\n`;
        code += `      </SpaceManager>\n`;
        code += `    </${appName}Provider>\n`;
        code += `  );\n`;
    }
    else if (providerType === 'app') {
        code += `  return (\n`;
        code += `    <${appName}Provider>\n`;
        code += `      {children}\n`;
        code += `    </${appName}Provider>\n`;
        code += `  );\n`;
    }
    else if (providerType === 'space') {
        code += `  const [spaceId, setSpaceId] = useState<string | null>(null);\n\n`;
        code += `  return (\n`;
        code += `    <HypergraphAppProvider mapping={mapping}>\n`;
        code += `      {spaceId ? (\n`;
        code += `        <SpaceProviderWrapper spaceId={spaceId}>\n`;
        code += `          {children}\n`;
        code += `        </SpaceProviderWrapper>\n`;
        code += `      ) : (\n`;
        code += `        <SpaceSelector onSpaceSelect={setSpaceId} />\n`;
        code += `      )}\n`;
        code += `    </HypergraphAppProvider>\n`;
        code += `  );\n`;
    }
    code += `}\n\n`;
    // Space Manager Component
    if (providerType === 'both') {
        code += generateSpaceManagerComponent();
    }
    // Space Selector Component
    code += generateSpaceSelectorComponent();
    return code;
}
function generateSpaceManagerComponent() {
    let code = `// Space Manager Component\nfunction SpaceManager({ \n`;
    code += `  children, \n`;
    code += `  onSpaceChange \n`;
    code += `}: { \n`;
    code += `  children: React.ReactNode;\n`;
    code += `  onSpaceChange: (spaceId: string | null) => void;\n`;
    code += `}) {\n`;
    code += `  const { createSpace, listSpaces } = useHypergraphApp();\n`;
    code += `  const [spaces, setSpaces] = useState([]);\n`;
    code += `  const [loading, setLoading] = useState(true);\n\n`;
    code += `  useEffect(() => {\n`;
    code += `    const loadSpaces = async () => {\n`;
    code += `      try {\n`;
    code += `        const userSpaces = await listSpaces();\n`;
    code += `        setSpaces(userSpaces);\n`;
    code += `      } catch (error) {\n`;
    code += `        console.error('Failed to load spaces:', error);\n`;
    code += `      } finally {\n`;
    code += `        setLoading(false);\n`;
    code += `      }\n`;
    code += `    };\n\n`;
    code += `    loadSpaces();\n`;
    code += `  }, [listSpaces]);\n\n`;
    code += `  const handleCreateSpace = async (spaceName: string) => {\n`;
    code += `    try {\n`;
    code += `      const newSpace = await createSpace({ name: spaceName });\n`;
    code += `      setSpaces(prev => [...prev, newSpace]);\n`;
    code += `      onSpaceChange(newSpace.id);\n`;
    code += `    } catch (error) {\n`;
    code += `      console.error('Failed to create space:', error);\n`;
    code += `    }\n`;
    code += `  };\n\n`;
    code += `  return (\n`;
    code += `    <SpaceManagerContext.Provider value={{\n`;
    code += `      spaces,\n`;
    code += `      loading,\n`;
    code += `      onSpaceChange,\n`;
    code += `      onCreateSpace: handleCreateSpace\n`;
    code += `    }}>\n`;
    code += `      {children}\n`;
    code += `    </SpaceManagerContext.Provider>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    // Space Manager Context
    code += `const SpaceManagerContext = createContext(null);\n\n`;
    code += `export function useSpaceManager() {\n`;
    code += `  const context = useContext(SpaceManagerContext);\n`;
    code += `  if (!context) {\n`;
    code += `    throw new Error('useSpaceManager must be used within a SpaceManager');\n`;
    code += `  }\n`;
    code += `  return context;\n`;
    code += `}\n\n`;
    return code;
}
function generateSpaceSelectorComponent() {
    let code = `// Space Selector Component\nfunction SpaceSelector({ onSpaceSelect }: { onSpaceSelect: (spaceId: string) => void }) {\n`;
    code += `  const { spaces, loading, onCreateSpace } = useSpaceManager();\n`;
    code += `  const [showCreateForm, setShowCreateForm] = useState(false);\n`;
    code += `  const [newSpaceName, setNewSpaceName] = useState('');\n\n`;
    code += `  const handleCreateSpace = async () => {\n`;
    code += `    if (newSpaceName.trim()) {\n`;
    code += `      await onCreateSpace(newSpaceName.trim());\n`;
    code += `      setNewSpaceName('');\n`;
    code += `      setShowCreateForm(false);\n`;
    code += `    }\n`;
    code += `  };\n\n`;
    code += `  if (loading) {\n`;
    code += `    return (\n`;
    code += `      <div className="space-selector-loading">\n`;
    code += `        <p>Loading spaces...</p>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;
    code += `  return (\n`;
    code += `    <div className="space-selector">\n`;
    code += `      <h2>Select a Space</h2>\n`;
    code += `      \n`;
    code += `      <div className="spaces-list">\n`;
    code += `        {spaces.map((space) => (\n`;
    code += `          <div key={space.id} className="space-item">\n`;
    code += `            <div className="space-info">\n`;
    code += `              <h3>{space.name}</h3>\n`;
    code += `              <p>{space.description}</p>\n`;
    code += `            </div>\n`;
    code += `            <button \n`;
    code += `              onClick={() => onSpaceSelect(space.id)}\n`;
    code += `              className="select-space-btn"\n`;
    code += `            >\n`;
    code += `              Enter Space\n`;
    code += `            </button>\n`;
    code += `          </div>\n`;
    code += `        ))}\n`;
    code += `      </div>\n\n`;
    code += `      {showCreateForm ? (\n`;
    code += `        <div className="create-space-form">\n`;
    code += `          <h3>Create New Space</h3>\n`;
    code += `          <input\n`;
    code += `            type="text"\n`;
    code += `            placeholder="Space name"\n`;
    code += `            value={newSpaceName}\n`;
    code += `            onChange={(e) => setNewSpaceName(e.target.value)}\n`;
    code += `          />\n`;
    code += `          <div className="form-actions">\n`;
    code += `            <button onClick={handleCreateSpace}>Create</button>\n`;
    code += `            <button onClick={() => setShowCreateForm(false)}>Cancel</button>\n`;
    code += `          </div>\n`;
    code += `        </div>\n`;
    code += `      ) : (\n`;
    code += `        <button \n`;
    code += `          onClick={() => setShowCreateForm(true)}\n`;
    code += `          className="create-space-btn"\n`;
    code += `        >\n`;
    code += `          Create New Space\n`;
    code += `        </button>\n`;
    code += `      )}\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    return code;
}
function generateCustomHooks(providerType, includeAuth) {
    let code = `// Custom Hooks\n\n`;
    // Enhanced app hook
    code += `export function useEnhancedApp() {\n`;
    code += `  const app = useHypergraphApp();\n`;
    if (includeAuth) {
        code += `  const auth = useHypergraphAuth();\n`;
    }
    code += `  const [appState, setAppState] = useState({\n`;
    code += `    initialized: false,\n`;
    code += `    loading: false,\n`;
    code += `    error: null\n`;
    code += `  });\n\n`;
    code += `  useEffect(() => {\n`;
    code += `    const initializeApp = async () => {\n`;
    code += `      setAppState(prev => ({ ...prev, loading: true }));\n`;
    code += `      try {\n`;
    code += `        // Initialize app-specific logic here\n`;
    code += `        setAppState(prev => ({ \n`;
    code += `          ...prev, \n`;
    code += `          initialized: true, \n`;
    code += `          loading: false,\n`;
    code += `          error: null\n`;
    code += `        }));\n`;
    code += `      } catch (error) {\n`;
    code += `        setAppState(prev => ({ \n`;
    code += `          ...prev, \n`;
    code += `          loading: false,\n`;
    code += `          error: error.message\n`;
    code += `        }));\n`;
    code += `      }\n`;
    code += `    };\n\n`;
    code += `    initializeApp();\n`;
    code += `  }, []);\n\n`;
    code += `  return {\n`;
    code += `    ...app,\n`;
    if (includeAuth) {
        code += `    auth,\n`;
    }
    code += `    appState\n`;
    code += `  };\n`;
    code += `}\n\n`;
    // Space management hook
    if (providerType === 'space' || providerType === 'both') {
        code += `export function useSpaceOperations() {\n`;
        code += `  const { createSpace, listSpaces } = useHypergraphApp();\n`;
        code += `  const [operations, setOperations] = useState({\n`;
        code += `    creating: false,\n`;
        code += `    loading: false,\n`;
        code += `    error: null\n`;
        code += `  });\n\n`;
        code += `  const createSpaceWithLoading = async (spaceData) => {\n`;
        code += `    setOperations(prev => ({ ...prev, creating: true, error: null }));\n`;
        code += `    try {\n`;
        code += `      const space = await createSpace(spaceData);\n`;
        code += `      setOperations(prev => ({ ...prev, creating: false }));\n`;
        code += `      return space;\n`;
        code += `    } catch (error) {\n`;
        code += `      setOperations(prev => ({ \n`;
        code += `        ...prev, \n`;
        code += `        creating: false, \n`;
        code += `        error: error.message \n`;
        code += `      }));\n`;
        code += `      throw error;\n`;
        code += `    }\n`;
        code += `  };\n\n`;
        code += `  const listSpacesWithLoading = async () => {\n`;
        code += `    setOperations(prev => ({ ...prev, loading: true, error: null }));\n`;
        code += `    try {\n`;
        code += `      const spaces = await listSpaces();\n`;
        code += `      setOperations(prev => ({ ...prev, loading: false }));\n`;
        code += `      return spaces;\n`;
        code += `    } catch (error) {\n`;
        code += `      setOperations(prev => ({ \n`;
        code += `        ...prev, \n`;
        code += `        loading: false, \n`;
        code += `        error: error.message \n`;
        code += `      }));\n`;
        code += `      throw error;\n`;
        code += `    }\n`;
        code += `  };\n\n`;
        code += `  return {\n`;
        code += `    createSpace: createSpaceWithLoading,\n`;
        code += `    listSpaces: listSpacesWithLoading,\n`;
        code += `    operations\n`;
        code += `  };\n`;
        code += `}\n\n`;
    }
    return code;
}
function generateProviderUsageExamples(providerType, appName) {
    let code = `// Usage Examples\n\n`;
    code += `// Main App Setup\nfunction App() {\n`;
    code += `  return (\n`;
    code += `    <${appName}Providers>\n`;
    code += `      <AppContent />\n`;
    code += `    </${appName}Providers>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    code += `// Example Component Using Providers\nfunction AppContent() {\n`;
    code += `  const { isAuthenticated, user } = useHypergraphAuth();\n`;
    code += `  const app = useEnhancedApp();\n\n`;
    code += `  if (!app.appState.initialized) {\n`;
    code += `    return <div>Initializing...</div>;\n`;
    code += `  }\n\n`;
    code += `  if (app.appState.error) {\n`;
    code += `    return <div>Error: {app.appState.error}</div>;\n`;
    code += `  }\n\n`;
    code += `  return (\n`;
    code += `    <div className="app-content">\n`;
    code += `      <header>\n`;
    code += `        <h1>${appName}</h1>\n`;
    code += `        {isAuthenticated && <p>Welcome, {user?.name}!</p>}\n`;
    code += `      </header>\n`;
    code += `      \n`;
    code += `      <main>\n`;
    code += `        {/* Your app content here */}\n`;
    code += `        <YourAppComponents />\n`;
    code += `      </main>\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;
    // CSS Styles
    code += `// CSS Styles (add to your CSS file)\nconst providerStyles = \`\n`;
    code += `.app-loading, .auth-loading, .space-loading {\n`;
    code += `  display: flex;\n`;
    code += `  justify-content: center;\n`;
    code += `  align-items: center;\n`;
    code += `  min-height: 200px;\n`;
    code += `  font-size: 18px;\n`;
    code += `}\n\n`;
    code += `.user-info-bar {\n`;
    code += `  display: flex;\n`;
    code += `  justify-content: space-between;\n`;
    code += `  align-items: center;\n`;
    code += `  padding: 10px 20px;\n`;
    code += `  background-color: #f8f9fa;\n`;
    code += `  border-bottom: 1px solid #dee2e6;\n`;
    code += `}\n\n`;
    code += `.modal-overlay {\n`;
    code += `  position: fixed;\n`;
    code += `  top: 0;\n`;
    code += `  left: 0;\n`;
    code += `  right: 0;\n`;
    code += `  bottom: 0;\n`;
    code += `  background-color: rgba(0, 0, 0, 0.5);\n`;
    code += `  display: flex;\n`;
    code += `  justify-content: center;\n`;
    code += `  align-items: center;\n`;
    code += `  z-index: 1000;\n`;
    code += `}\n\n`;
    code += `.modal-content {\n`;
    code += `  background: white;\n`;
    code += `  border-radius: 8px;\n`;
    code += `  padding: 0;\n`;
    code += `  max-width: 400px;\n`;
    code += `  width: 90%;\n`;
    code += `  max-height: 90vh;\n`;
    code += `  overflow-y: auto;\n`;
    code += `}\n\n`;
    code += `.space-selector {\n`;
    code += `  max-width: 600px;\n`;
    code += `  margin: 40px auto;\n`;
    code += `  padding: 20px;\n`;
    code += `}\n\n`;
    code += `.space-item {\n`;
    code += `  display: flex;\n`;
    code += `  justify-content: space-between;\n`;
    code += `  align-items: center;\n`;
    code += `  padding: 15px;\n`;
    code += `  border: 1px solid #ddd;\n`;
    code += `  border-radius: 6px;\n`;
    code += `  margin-bottom: 10px;\n`;
    code += `}\n\`;\n`;
    return code;
}
function generateTypescriptProviderCode(providerType, includeAuth, includeCustomHooks, appName) {
    let code = `\nimport { HypergraphApp } from '@graphprotocol/hypergraph';\nimport { mapping } from './mapping';\n\n`;
    code += `interface ProviderConfig {\n`;
    code += `  mapping: any;\n`;
    if (includeAuth) {
        code += `  authConfig?: {\n`;
        code += `    redirectUri: string;\n`;
        code += `    clientId: string;\n`;
        code += `  };\n`;
    }
    code += `}\n\n`;
    code += `export class ${appName}Manager {\n`;
    code += `  private hypergraphApp: HypergraphApp;\n`;
    code += `  private config: ProviderConfig;\n\n`;
    code += `  constructor(config: ProviderConfig) {\n`;
    code += `    this.config = config;\n`;
    code += `    this.hypergraphApp = new HypergraphApp({\n`;
    code += `      mapping: config.mapping,\n`;
    if (includeAuth) {
        code += `      auth: config.authConfig\n`;
    }
    code += `    });\n`;
    code += `  }\n\n`;
    code += `  async initialize(): Promise<void> {\n`;
    code += `    try {\n`;
    code += `      await this.hypergraphApp.initialize();\n`;
    code += `      console.log('${appName} initialized successfully');\n`;
    code += `    } catch (error) {\n`;
    code += `      console.error('Failed to initialize ${appName}:', error);\n`;
    code += `      throw error;\n`;
    code += `    }\n`;
    code += `  }\n\n`;
    code += `  getApp(): HypergraphApp {\n`;
    code += `    return this.hypergraphApp;\n`;
    code += `  }\n\n`;
    if (providerType === 'space' || providerType === 'both') {
        code += `  async createSpace(spaceData: { name: string; description?: string }): Promise<any> {\n`;
        code += `    return await this.hypergraphApp.createSpace(spaceData);\n`;
        code += `  }\n\n`;
        code += `  async listSpaces(): Promise<any[]> {\n`;
        code += `    return await this.hypergraphApp.listSpaces();\n`;
        code += `  }\n\n`;
    }
    code += `}\n\n`;
    // Usage example
    code += `// Usage Example\n`;
    code += `/*\n`;
    code += `const appManager = new ${appName}Manager({\n`;
    code += `  mapping,\n`;
    if (includeAuth) {
        code += `  authConfig: {\n`;
        code += `    redirectUri: window.location.origin + '/auth/callback',\n`;
        code += `    clientId: process.env.HYPERGRAPH_CLIENT_ID\n`;
        code += `  }\n`;
    }
    code += `});\n\n`;
    code += `await appManager.initialize();\n`;
    code += `const hypergraphApp = appManager.getApp();\n`;
    code += `*/\n`;
    return code;
}
//# sourceMappingURL=providers.js.map