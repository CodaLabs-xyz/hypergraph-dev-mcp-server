export function createAuthenticationHelperTool() {
  return {
    name: 'setup_authentication',
    description: 'Generate Hypergraph authentication setup with Geo Connect',
    inputSchema: {
      type: 'object',
      properties: {
        authMethod: {
          type: 'string',
          enum: ['geo-connect', 'custom'],
          description: 'Authentication method to use',
          default: 'geo-connect'
        },
        framework: {
          type: 'string',
          enum: ['react', 'typescript', 'vanilla-js'],
          description: 'Framework for implementation',
          default: 'react'
        },
        includeRedirect: {
          type: 'boolean',
          description: 'Include redirect handling',
          default: true
        },
        includeErrorHandling: {
          type: 'boolean',
          description: 'Include comprehensive error handling',
          default: true
        },
        customDomain: {
          type: 'string',
          description: 'Custom domain for redirect (optional)'
        }
      },
      required: [],
    },
  };
}

export async function handleSetupAuthentication(args: any) {
  const { authMethod, framework, includeRedirect, includeErrorHandling, customDomain } = args;
  
  const authCode = generateAuthenticationCode(authMethod, framework, includeRedirect, includeErrorHandling, customDomain);

  return {
    content: [
      {
        type: 'text',
        text: authCode,
      },
    ],
  };
}

function generateAuthenticationCode(
  authMethod: string,
  framework: string,
  includeRedirect: boolean,
  includeErrorHandling: boolean,
  customDomain?: string
) {
  let authCode = `// Hypergraph Authentication Setup\n`;
  
  if (framework === 'react') {
    authCode += generateReactAuthCode(authMethod, includeRedirect, includeErrorHandling, customDomain);
  } else if (framework === 'typescript') {
    authCode += generateTypescriptAuthCode(authMethod, includeRedirect, includeErrorHandling, customDomain);
  } else {
    authCode += generateVanillaJSAuthCode(authMethod, includeRedirect, includeErrorHandling, customDomain);
  }

  return authCode;
}

function generateReactAuthCode(authMethod: string, includeRedirect: boolean, includeErrorHandling: boolean, customDomain?: string) {
  let code = `\nimport { useHypergraphAuth } from '@graphprotocol/hypergraph-react';\nimport { useState, useEffect } from 'react';\n\n`;

  if (authMethod === 'geo-connect') {
    code += `// Geo Connect Authentication Component\nexport function AuthenticationComponent() {\n`;
    code += `  const { redirectToConnect, processConnectAuthSuccess, isAuthenticated, user } = useHypergraphAuth();\n`;
    code += `  const [loading, setLoading] = useState(false);\n`;
    
    if (includeErrorHandling) {
      code += `  const [error, setError] = useState<string | null>(null);\n`;
    }

    code += `\n  useEffect(() => {\n`;
    code += `    // Check for auth callback on component mount\n`;
    code += `    const urlParams = new URLSearchParams(window.location.search);\n`;
    code += `    const authCode = urlParams.get('code');\n`;
    code += `    const state = urlParams.get('state');\n\n`;
    
    code += `    if (authCode && state) {\n`;
    code += `      handleAuthCallback(authCode, state);\n`;
    code += `    }\n`;
    code += `  }, []);\n\n`;

    code += `  const handleLogin = async () => {\n`;
    code += `    setLoading(true);\n`;
    
    if (includeErrorHandling) {
      code += `    setError(null);\n`;
    }
    
    code += `    \n    try {\n`;
    
    if (customDomain) {
      code += `      await redirectToConnect('${customDomain}');\n`;
    } else {
      code += `      await redirectToConnect();\n`;
    }
    
    code += `    } catch (error) {\n`;
    
    if (includeErrorHandling) {
      code += `      setError('Failed to redirect to authentication');\n`;
      code += `      console.error('Auth redirect error:', error);\n`;
    } else {
      code += `      console.error('Auth redirect error:', error);\n`;
    }
    
    code += `    } finally {\n`;
    code += `      setLoading(false);\n`;
    code += `    }\n`;
    code += `  };\n\n`;

    if (includeRedirect) {
      code += `  const handleAuthCallback = async (authCode: string, state: string) => {\n`;
      code += `    setLoading(true);\n`;
      
      if (includeErrorHandling) {
        code += `    setError(null);\n`;
      }
      
      code += `    \n    try {\n`;
      code += `      await processConnectAuthSuccess(authCode, state);\n`;
      code += `      // Clear URL parameters after successful authentication\n`;
      code += `      window.history.replaceState({}, document.title, window.location.pathname);\n`;
      code += `    } catch (error) {\n`;
      
      if (includeErrorHandling) {
        code += `      setError('Authentication failed');\n`;
        code += `      console.error('Auth callback error:', error);\n`;
      } else {
        code += `      console.error('Auth callback error:', error);\n`;
      }
      
      code += `    } finally {\n`;
      code += `      setLoading(false);\n`;
      code += `    }\n`;
      code += `  };\n\n`;
    }

    code += `  const handleLogout = () => {\n`;
    code += `    // Implement logout logic\n`;
    code += `    // This might involve clearing local storage, redirecting, etc.\n`;
    code += `    localStorage.removeItem('hypergraph-auth-token');\n`;
    code += `    window.location.reload();\n`;
    code += `  };\n\n`;

    code += `  if (loading) {\n`;
    code += `    return (\n`;
    code += `      <div className="auth-loading">\n`;
    code += `        <p>Authenticating...</p>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;

    if (includeErrorHandling) {
      code += `  if (error) {\n`;
      code += `    return (\n`;
      code += `      <div className="auth-error">\n`;
      code += `        <p>Authentication Error: {error}</p>\n`;
      code += `        <button onClick={() => setError(null)}>Try Again</button>\n`;
      code += `      </div>\n`;
      code += `    );\n`;
      code += `  }\n\n`;
    }

    code += `  if (isAuthenticated && user) {\n`;
    code += `    return (\n`;
    code += `      <div className="auth-success">\n`;
    code += `        <h3>Welcome, {user.name || 'User'}!</h3>\n`;
    code += `        <p>Account: {user.accountAddress}</p>\n`;
    code += `        <button onClick={handleLogout} className="logout-btn">\n`;
    code += `          Logout\n`;
    code += `        </button>\n`;
    code += `      </div>\n`;
    code += `    );\n`;
    code += `  }\n\n`;

    code += `  return (\n`;
    code += `    <div className="auth-login">\n`;
    code += `      <h3>Connect with Geo</h3>\n`;
    code += `      <p>Sign in to access your Hypergraph spaces and data.</p>\n`;
    code += `      <button \n`;
    code += `        onClick={handleLogin} \n`;
    code += `        disabled={loading}\n`;
    code += `        className="connect-btn"\n`;
    code += `      >\n`;
    code += `        {loading ? 'Connecting...' : 'Connect with Geo'}\n`;
    code += `      </button>\n`;
    code += `    </div>\n`;
    code += `  );\n`;
    code += `}\n\n`;

    // Add CSS styles
    code += `// CSS Styles (add to your CSS file)\nconst authStyles = \`\n`;
    code += `.auth-loading, .auth-error, .auth-success, .auth-login {\n`;
    code += `  max-width: 400px;\n`;
    code += `  margin: 20px auto;\n`;
    code += `  padding: 20px;\n`;
    code += `  border: 1px solid #ddd;\n`;
    code += `  border-radius: 8px;\n`;
    code += `  text-align: center;\n`;
    code += `}\n\n`;
    code += `.connect-btn, .logout-btn {\n`;
    code += `  background-color: #007bff;\n`;
    code += `  color: white;\n`;
    code += `  border: none;\n`;
    code += `  padding: 12px 24px;\n`;
    code += `  border-radius: 6px;\n`;
    code += `  cursor: pointer;\n`;
    code += `  font-size: 16px;\n`;
    code += `  margin-top: 10px;\n`;
    code += `}\n\n`;
    code += `.connect-btn:disabled {\n`;
    code += `  background-color: #ccc;\n`;
    code += `  cursor: not-allowed;\n`;
    code += `}\n\n`;
    code += `.logout-btn {\n`;
    code += `  background-color: #dc3545;\n`;
    code += `}\n\n`;
    code += `.auth-error {\n`;
    code += `  border-color: #dc3545;\n`;
    code += `  background-color: #f8d7da;\n`;
    code += `}\n\n`;
    code += `.auth-success {\n`;
    code += `  border-color: #28a745;\n`;
    code += `  background-color: #d4edda;\n`;
    code += `}\n\`;\n\n`;

    // Add auth hook
    code += `// Custom authentication hook\nexport function useAuth() {\n`;
    code += `  const auth = useHypergraphAuth();\n`;
    code += `  const [loading, setLoading] = useState(false);\n`;
    
    if (includeErrorHandling) {
      code += `  const [error, setError] = useState<string | null>(null);\n`;
    }

    code += `\n  const login = async () => {\n`;
    code += `    setLoading(true);\n`;
    
    if (includeErrorHandling) {
      code += `    setError(null);\n`;
    }
    
    code += `    try {\n`;
    
    if (customDomain) {
      code += `      await auth.redirectToConnect('${customDomain}');\n`;
    } else {
      code += `      await auth.redirectToConnect();\n`;
    }
    
    code += `    } catch (err) {\n`;
    
    if (includeErrorHandling) {
      code += `      setError('Login failed');\n`;
    }
    
    code += `      throw err;\n`;
    code += `    } finally {\n`;
    code += `      setLoading(false);\n`;
    code += `    }\n`;
    code += `  };\n\n`;

    code += `  const logout = () => {\n`;
    code += `    localStorage.removeItem('hypergraph-auth-token');\n`;
    code += `    window.location.reload();\n`;
    code += `  };\n\n`;

    code += `  return {\n`;
    code += `    ...auth,\n`;
    code += `    login,\n`;
    code += `    logout,\n`;
    code += `    loading,\n`;
    
    if (includeErrorHandling) {
      code += `    error,\n`;
      code += `    clearError: () => setError(null)\n`;
    }
    
    code += `  };\n`;
    code += `}\n`;
  }

  return code;
}

function generateTypescriptAuthCode(authMethod: string, includeRedirect: boolean, includeErrorHandling: boolean, customDomain?: string) {
  let code = `\nimport { HypergraphApp } from '@graphprotocol/hypergraph';\n\n`;

  code += `interface AuthConfig {\n`;
  code += `  redirectUri?: string;\n`;
  code += `  customDomain?: string;\n`;
  code += `}\n\n`;

  code += `interface AuthResult {\n`;
  code += `  success: boolean;\n`;
  code += `  user?: any;\n`;
  code += `  error?: string;\n`;
  code += `}\n\n`;

  if (authMethod === 'geo-connect') {
    code += `export class HypergraphAuthManager {\n`;
    code += `  private hypergraphApp: HypergraphApp;\n`;
    code += `  private config: AuthConfig;\n\n`;
    
    code += `  constructor(hypergraphApp: HypergraphApp, config: AuthConfig = {}) {\n`;
    code += `    this.hypergraphApp = hypergraphApp;\n`;
    code += `    this.config = config;\n`;
    code += `  }\n\n`;

    code += `  async redirectToConnect(): Promise<void> {\n`;
    
    if (includeErrorHandling) {
      code += `    try {\n`;
    }
    
    if (customDomain) {
      code += `      await this.hypergraphApp.auth.redirectToConnect('${customDomain}');\n`;
    } else {
      code += `      await this.hypergraphApp.auth.redirectToConnect(this.config.customDomain);\n`;
    }
    
    if (includeErrorHandling) {
      code += `    } catch (error) {\n`;
      code += `      console.error('Redirect to connect failed:', error);\n`;
      code += `      throw new Error('Authentication redirect failed');\n`;
      code += `    }\n`;
    }
    
    code += `  }\n\n`;

    if (includeRedirect) {
      code += `  async processAuthCallback(authCode: string, state: string): Promise<AuthResult> {\n`;
      
      if (includeErrorHandling) {
        code += `    try {\n`;
      }
      
      code += `      const result = await this.hypergraphApp.auth.processConnectAuthSuccess(authCode, state);\n`;
      code += `      \n`;
      code += `      // Clear URL parameters\n`;
      code += `      if (typeof window !== 'undefined') {\n`;
      code += `        window.history.replaceState({}, document.title, window.location.pathname);\n`;
      code += `      }\n\n`;
      code += `      return {\n`;
      code += `        success: true,\n`;
      code += `        user: result.user\n`;
      code += `      };\n`;
      
      if (includeErrorHandling) {
        code += `    } catch (error) {\n`;
        code += `      console.error('Auth callback processing failed:', error);\n`;
        code += `      return {\n`;
        code += `        success: false,\n`;
        code += `        error: 'Authentication failed'\n`;
        code += `      };\n`;
        code += `    }\n`;
      }
      
      code += `  }\n\n`;
    }

    code += `  isAuthenticated(): boolean {\n`;
    code += `    return this.hypergraphApp.auth.isAuthenticated();\n`;
    code += `  }\n\n`;

    code += `  getCurrentUser(): any | null {\n`;
    code += `    return this.hypergraphApp.auth.getCurrentUser();\n`;
    code += `  }\n\n`;

    code += `  logout(): void {\n`;
    code += `    this.hypergraphApp.auth.logout();\n`;
    code += `    \n`;
    code += `    // Clear local storage\n`;
    code += `    if (typeof localStorage !== 'undefined') {\n`;
    code += `      localStorage.removeItem('hypergraph-auth-token');\n`;
    code += `    }\n`;
    code += `  }\n\n`;

    code += `  async checkAuthStatus(): Promise<boolean> {\n`;
    
    if (includeErrorHandling) {
      code += `    try {\n`;
    }
    
    code += `      // Check if user is still authenticated\n`;
    code += `      const isAuth = this.isAuthenticated();\n`;
    code += `      \n`;
    code += `      if (isAuth) {\n`;
    code += `        // Verify token is still valid\n`;
    code += `        const user = this.getCurrentUser();\n`;
    code += `        return user !== null;\n`;
    code += `      }\n\n`;
    code += `      return false;\n`;
    
    if (includeErrorHandling) {
      code += `    } catch (error) {\n`;
      code += `      console.error('Auth status check failed:', error);\n`;
      code += `      return false;\n`;
      code += `    }\n`;
    }
    
    code += `  }\n`;
    code += `}\n\n`;

    // Usage example
    code += `// Usage Example\n`;
    code += `/*\n`;
    code += `const hypergraphApp = new HypergraphApp(config);\n`;
    code += `const authManager = new HypergraphAuthManager(hypergraphApp, {\n`;
    
    if (customDomain) {
      code += `  customDomain: '${customDomain}'\n`;
    } else {
      code += `  customDomain: 'your-app-domain.com'\n`;
    }
    
    code += `});\n\n`;
    code += `// Login flow\nif (!authManager.isAuthenticated()) {\n`;
    code += `  await authManager.redirectToConnect();\n`;
    code += `}\n\n`;
    
    if (includeRedirect) {
      code += `// Handle auth callback\nconst urlParams = new URLSearchParams(window.location.search);\nconst authCode = urlParams.get('code');\nconst state = urlParams.get('state');\n\nif (authCode && state) {\n`;
      code += `  const result = await authManager.processAuthCallback(authCode, state);\n`;
      code += `  if (result.success) {\n`;
      code += `    console.log('Authentication successful:', result.user);\n`;
      code += `  } else {\n`;
      code += `    console.error('Authentication failed:', result.error);\n`;
      code += `  }\n`;
      code += `}\n`;
    }
    
    code += `*/\n`;
  }

  return code;
}

function generateVanillaJSAuthCode(authMethod: string, includeRedirect: boolean, includeErrorHandling: boolean, customDomain?: string) {
  let code = `\n// Vanilla JavaScript Hypergraph Authentication\n\n`;

  if (authMethod === 'geo-connect') {
    code += `class HypergraphAuthManager {\n`;
    code += `  constructor(hypergraphApp, config = {}) {\n`;
    code += `    this.hypergraphApp = hypergraphApp;\n`;
    code += `    this.config = config;\n`;
    code += `  }\n\n`;

    code += `  async redirectToConnect() {\n`;
    
    if (includeErrorHandling) {
      code += `    try {\n`;
    }
    
    if (customDomain) {
      code += `      await this.hypergraphApp.auth.redirectToConnect('${customDomain}');\n`;
    } else {
      code += `      await this.hypergraphApp.auth.redirectToConnect(this.config.customDomain);\n`;
    }
    
    if (includeErrorHandling) {
      code += `    } catch (error) {\n`;
      code += `      console.error('Redirect to connect failed:', error);\n`;
      code += `      throw new Error('Authentication redirect failed');\n`;
      code += `    }\n`;
    }
    
    code += `  }\n\n`;

    if (includeRedirect) {
      code += `  async processAuthCallback(authCode, state) {\n`;
      
      if (includeErrorHandling) {
        code += `    try {\n`;
      }
      
      code += `      const result = await this.hypergraphApp.auth.processConnectAuthSuccess(authCode, state);\n`;
      code += `      \n`;
      code += `      // Clear URL parameters\n`;
      code += `      window.history.replaceState({}, document.title, window.location.pathname);\n\n`;
      code += `      return {\n`;
      code += `        success: true,\n`;
      code += `        user: result.user\n`;
      code += `      };\n`;
      
      if (includeErrorHandling) {
        code += `    } catch (error) {\n`;
        code += `      console.error('Auth callback processing failed:', error);\n`;
        code += `      return {\n`;
        code += `        success: false,\n`;
        code += `        error: 'Authentication failed'\n`;
        code += `      };\n`;
        code += `    }\n`;
      }
      
      code += `  }\n\n`;
    }

    code += `  isAuthenticated() {\n`;
    code += `    return this.hypergraphApp.auth.isAuthenticated();\n`;
    code += `  }\n\n`;

    code += `  getCurrentUser() {\n`;
    code += `    return this.hypergraphApp.auth.getCurrentUser();\n`;
    code += `  }\n\n`;

    code += `  logout() {\n`;
    code += `    this.hypergraphApp.auth.logout();\n`;
    code += `    localStorage.removeItem('hypergraph-auth-token');\n`;
    code += `  }\n`;
    code += `}\n\n`;

    // HTML template
    code += `// HTML Template\nconst authHTML = \`\n`;
    code += `<div id="auth-container">\n`;
    code += `  <div id="login-section" class="auth-section">\n`;
    code += `    <h3>Connect with Geo</h3>\n`;
    code += `    <p>Sign in to access your Hypergraph spaces and data.</p>\n`;
    code += `    <button id="connect-btn" class="auth-btn">Connect with Geo</button>\n`;
    code += `  </div>\n\n`;
    code += `  <div id="loading-section" class="auth-section" style="display: none;">\n`;
    code += `    <p>Authenticating...</p>\n`;
    code += `  </div>\n\n`;
    
    if (includeErrorHandling) {
      code += `  <div id="error-section" class="auth-section error" style="display: none;">\n`;
      code += `    <p id="error-message">Authentication failed</p>\n`;
      code += `    <button id="retry-btn" class="auth-btn">Try Again</button>\n`;
      code += `  </div>\n\n`;
    }
    
    code += `  <div id="success-section" class="auth-section success" style="display: none;">\n`;
    code += `    <h3>Welcome!</h3>\n`;
    code += `    <p id="user-info"></p>\n`;
    code += `    <button id="logout-btn" class="auth-btn logout">Logout</button>\n`;
    code += `  </div>\n`;
    code += `</div>\n\`;\n\n`;

    // Usage example
    code += `// Usage Example\n`;
    code += `const hypergraphApp = new HypergraphApp(config);\n`;
    code += `const authManager = new HypergraphAuthManager(hypergraphApp, {\n`;
    
    if (customDomain) {
      code += `  customDomain: '${customDomain}'\n`;
    } else {
      code += `  customDomain: 'your-app-domain.com'\n`;
    }
    
    code += `});\n\n`;

    code += `// Add HTML to page\ndocument.body.innerHTML = authHTML;\n\n`;

    code += `// Setup event listeners\ndocument.getElementById('connect-btn').addEventListener('click', async () => {\n`;
    code += `  showSection('loading');\n`;
    code += `  try {\n`;
    code += `    await authManager.redirectToConnect();\n`;
    code += `  } catch (error) {\n`;
    
    if (includeErrorHandling) {
      code += `    showError('Failed to connect');\n`;
    } else {
      code += `    console.error('Connect failed:', error);\n`;
      code += `    showSection('login');\n`;
    }
    
    code += `  }\n`;
    code += `});\n\n`;

    if (includeErrorHandling) {
      code += `document.getElementById('retry-btn').addEventListener('click', () => {\n`;
      code += `  showSection('login');\n`;
      code += `});\n\n`;
    }

    code += `document.getElementById('logout-btn').addEventListener('click', () => {\n`;
    code += `  authManager.logout();\n`;
    code += `  showSection('login');\n`;
    code += `});\n\n`;

    // Helper functions
    code += `// Helper functions\nfunction showSection(section) {\n`;
    code += `  document.querySelectorAll('.auth-section').forEach(s => s.style.display = 'none');\n`;
    code += `  document.getElementById(section + '-section').style.display = 'block';\n`;
    code += `}\n\n`;
    
    if (includeErrorHandling) {
      code += `function showError(message) {\n`;
      code += `  document.getElementById('error-message').textContent = message;\n`;
      code += `  showSection('error');\n`;
      code += `}\n\n`;
    }

    if (includeRedirect) {
      code += `// Check for auth callback on page load\nwindow.addEventListener('load', async () => {\n`;
      code += `  const urlParams = new URLSearchParams(window.location.search);\n`;
      code += `  const authCode = urlParams.get('code');\n`;
      code += `  const state = urlParams.get('state');\n\n`;
      code += `  if (authCode && state) {\n`;
      code += `    showSection('loading');\n`;
      code += `    const result = await authManager.processAuthCallback(authCode, state);\n`;
      code += `    \n`;
      code += `    if (result.success) {\n`;
      code += `      document.getElementById('user-info').textContent = \n`;
      code += `        \`Account: \${result.user.accountAddress}\`;\n`;
      code += `      showSection('success');\n`;
      code += `    } else {\n`;
      
      if (includeErrorHandling) {
        code += `      showError(result.error);\n`;
      } else {
        code += `      showSection('login');\n`;
      }
      
      code += `    }\n`;
      code += `  } else if (authManager.isAuthenticated()) {\n`;
      code += `    const user = authManager.getCurrentUser();\n`;
      code += `    document.getElementById('user-info').textContent = \n`;
      code += `      \`Account: \${user.accountAddress}\`;\n`;
      code += `    showSection('success');\n`;
      code += `  } else {\n`;
      code += `    showSection('login');\n`;
      code += `  }\n`;
      code += `});\n`;
    }
  }

  return code;
}