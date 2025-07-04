export function createSpaceTool() {
  return {
    name: 'create_space',
    description: 'Generate code for creating and managing Hypergraph spaces (public/private)',
    inputSchema: {
      type: 'object',
      properties: {
        spaceType: {
          type: 'string',
          enum: ['public', 'private'],
          description: 'Type of space to create',
          default: 'private'
        },
        spaceName: {
          type: 'string',
          description: 'Name for the space'
        },
        description: {
          type: 'string',
          description: 'Description of the space purpose'
        },
        includeInvitations: {
          type: 'boolean',
          description: 'Include space invitation functionality',
          default: false
        },
        framework: {
          type: 'string',
          enum: ['react', 'vanilla-js', 'typescript'],
          description: 'Framework for the implementation',
          default: 'react'
        }
      },
      required: ['spaceName'],
    },
  };
}

export async function handleCreateSpace(args: any) {
  const { spaceType, spaceName, description, includeInvitations, framework } = args;
  
  let spaceCode = '';
  
  if (framework === 'react') {
    spaceCode = generateReactSpaceCode(spaceType, spaceName, description, includeInvitations);
  } else if (framework === 'typescript') {
    spaceCode = generateTypescriptSpaceCode(spaceType, spaceName, description, includeInvitations);
  } else {
    spaceCode = generateVanillaJSSpaceCode(spaceType, spaceName, description, includeInvitations);
  }

  return {
    content: [
      {
        type: 'text',
        text: spaceCode,
      },
    ],
  };
}

function generateReactSpaceCode(spaceType: string, spaceName: string, description: string, includeInvitations: boolean) {
  return `// Hypergraph ${spaceType} Space: ${spaceName}
// ${description}

import { useHypergraphApp, useQuery } from '@graphprotocol/hypergraph-react';
import { useState, useEffect } from 'react';

export function ${spaceName.replace(/\s+/g, '')}Space() {
  const { createSpace, ${includeInvitations ? 'inviteToSpace, listInvitations, ' : ''}hypergraphApp } = useHypergraphApp();
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  ${includeInvitations ? 'const [invitations, setInvitations] = useState([]);' : ''}

  const handleCreateSpace = async () => {
    setLoading(true);
    try {
      const space = await createSpace({
        name: '${spaceName}',
        description: '${description}',
        public: ${spaceType === 'public'}
      });
      setSpaceId(space.id);
      console.log('Space created successfully:', space);
    } catch (error) {
      console.error('Error creating space:', error);
    } finally {
      setLoading(false);
    }
  };

  ${includeInvitations ? `
  const handleInviteUser = async (accountAddress: string) => {
    if (!spaceId) return;
    
    try {
      await inviteToSpace({
        space: spaceId,
        invitee: { accountAddress }
      });
      console.log('Invitation sent successfully');
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  const loadInvitations = async () => {
    if (!spaceId) return;
    
    try {
      const invites = await listInvitations({ space: spaceId });
      setInvitations(invites);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  useEffect(() => {
    if (spaceId) {
      loadInvitations();
    }
  }, [spaceId]);
  ` : ''}

  return (
    <div className="space-container">
      <h2>${spaceName} (${spaceType} Space)</h2>
      <p>{description}</p>
      
      {!spaceId ? (
        <button 
          onClick={handleCreateSpace} 
          disabled={loading}
          className="create-space-btn"
        >
          {loading ? 'Creating...' : 'Create Space'}
        </button>
      ) : (
        <div className="space-info">
          <p>Space ID: {spaceId}</p>
          <p>Type: ${spaceType}</p>
          
          ${includeInvitations ? `
          <div className="invitations-section">
            <h3>Space Invitations</h3>
            <div className="invite-form">
              <input 
                type="text" 
                placeholder="User account address"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleInviteUser(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button onClick={() => {
                const input = document.querySelector('.invite-form input') as HTMLInputElement;
                if (input.value) {
                  handleInviteUser(input.value);
                  input.value = '';
                }
              }}>
                Send Invitation
              </button>
            </div>
            
            <div className="invitations-list">
              <h4>Sent Invitations:</h4>
              {invitations.map((invitation, index) => (
                <div key={index} className="invitation-item">
                  <span>{invitation.invitee.accountAddress}</span>
                  <span className="status">{invitation.status}</span>
                </div>
              ))}
            </div>
          </div>
          ` : ''}
        </div>
      )}
    </div>
  );
}

// CSS Styles (add to your CSS file)
const styles = \`
.space-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.create-space-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.create-space-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.space-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.invitations-section {
  margin-top: 20px;
}

.invite-form {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.invite-form input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.invitation-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.status {
  font-weight: bold;
  color: #28a745;
}
\`;
`;
}

function generateTypescriptSpaceCode(spaceType: string, spaceName: string, description: string, includeInvitations: boolean) {
  return `// Hypergraph ${spaceType} Space: ${spaceName}
// ${description}

import { HypergraphApp } from '@graphprotocol/hypergraph';

interface SpaceConfig {
  name: string;
  description: string;
  public: boolean;
}

interface InvitationConfig {
  space: string;
  invitee: {
    accountAddress: string;
  };
}

export class ${spaceName.replace(/\s+/g, '')}SpaceManager {
  private hypergraphApp: HypergraphApp;
  private spaceId: string | null = null;

  constructor(hypergraphApp: HypergraphApp) {
    this.hypergraphApp = hypergraphApp;
  }

  async createSpace(): Promise<string> {
    try {
      const spaceConfig: SpaceConfig = {
        name: '${spaceName}',
        description: '${description}',
        public: ${spaceType === 'public'}
      };

      const space = await this.hypergraphApp.createSpace(spaceConfig);
      this.spaceId = space.id;
      
      console.log('Space created successfully:', space);
      return space.id;
    } catch (error) {
      console.error('Error creating space:', error);
      throw error;
    }
  }

  ${includeInvitations ? `
  async inviteUser(accountAddress: string): Promise<void> {
    if (!this.spaceId) {
      throw new Error('Space not created yet');
    }

    try {
      const invitationConfig: InvitationConfig = {
        space: this.spaceId,
        invitee: { accountAddress }
      };

      await this.hypergraphApp.inviteToSpace(invitationConfig);
      console.log('Invitation sent successfully to:', accountAddress);
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  }

  async getInvitations(): Promise<any[]> {
    if (!this.spaceId) {
      throw new Error('Space not created yet');
    }

    try {
      const invitations = await this.hypergraphApp.listInvitations({ 
        space: this.spaceId 
      });
      return invitations;
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }
  }
  ` : ''}

  getSpaceId(): string | null {
    return this.spaceId;
  }

  getSpaceType(): string {
    return '${spaceType}';
  }

  getSpaceName(): string {
    return '${spaceName}';
  }

  getSpaceDescription(): string {
    return '${description}';
  }
}

// Usage example:
/*
const hypergraphApp = new HypergraphApp(config);
const spaceManager = new ${spaceName.replace(/\s+/g, '')}SpaceManager(hypergraphApp);

// Create space
const spaceId = await spaceManager.createSpace();

${includeInvitations ? `
// Invite users (for private spaces)
await spaceManager.inviteUser('0x1234567890123456789012345678901234567890');

// Get invitations
const invitations = await spaceManager.getInvitations();
console.log('Current invitations:', invitations);
` : ''}
*/
`;
}

function generateVanillaJSSpaceCode(spaceType: string, spaceName: string, description: string, includeInvitations: boolean) {
  return `// Hypergraph ${spaceType} Space: ${spaceName}
// ${description}

class ${spaceName.replace(/\s+/g, '')}SpaceManager {
  constructor(hypergraphApp) {
    this.hypergraphApp = hypergraphApp;
    this.spaceId = null;
  }

  async createSpace() {
    try {
      const spaceConfig = {
        name: '${spaceName}',
        description: '${description}',
        public: ${spaceType === 'public'}
      };

      const space = await this.hypergraphApp.createSpace(spaceConfig);
      this.spaceId = space.id;
      
      console.log('Space created successfully:', space);
      return space.id;
    } catch (error) {
      console.error('Error creating space:', error);
      throw error;
    }
  }

  ${includeInvitations ? `
  async inviteUser(accountAddress) {
    if (!this.spaceId) {
      throw new Error('Space not created yet');
    }

    try {
      const invitationConfig = {
        space: this.spaceId,
        invitee: { accountAddress }
      };

      await this.hypergraphApp.inviteToSpace(invitationConfig);
      console.log('Invitation sent successfully to:', accountAddress);
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  }

  async getInvitations() {
    if (!this.spaceId) {
      throw new Error('Space not created yet');
    }

    try {
      const invitations = await this.hypergraphApp.listInvitations({ 
        space: this.spaceId 
      });
      return invitations;
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw error;
    }
  }
  ` : ''}

  getSpaceId() {
    return this.spaceId;
  }

  getSpaceType() {
    return '${spaceType}';
  }

  getSpaceName() {
    return '${spaceName}';
  }

  getSpaceDescription() {
    return '${description}';
  }
}

// HTML Template for UI
const spaceHTML = \`
<div id="${spaceName.replace(/\s+/g, '').toLowerCase()}-space" class="space-container">
  <h2>${spaceName} (${spaceType} Space)</h2>
  <p>${description}</p>
  
  <div id="space-controls">
    <button id="create-space-btn">Create Space</button>
  </div>
  
  <div id="space-info" style="display: none;">
    <p>Space ID: <span id="space-id"></span></p>
    <p>Type: ${spaceType}</p>
    
    ${includeInvitations ? `
    <div class="invitations-section">
      <h3>Space Invitations</h3>
      <div class="invite-form">
        <input type="text" id="invite-address" placeholder="User account address" />
        <button id="send-invite-btn">Send Invitation</button>
      </div>
      
      <div id="invitations-list">
        <h4>Sent Invitations:</h4>
        <div id="invitations-container"></div>
      </div>
    </div>
    ` : ''}
  </div>
</div>
\`;

// Usage example:
/*
// Initialize
const hypergraphApp = new HypergraphApp(config);
const spaceManager = new ${spaceName.replace(/\s+/g, '')}SpaceManager(hypergraphApp);

// Add HTML to page
document.body.innerHTML = spaceHTML;

// Setup event listeners
document.getElementById('create-space-btn').addEventListener('click', async () => {
  try {
    const spaceId = await spaceManager.createSpace();
    document.getElementById('space-id').textContent = spaceId;
    document.getElementById('space-controls').style.display = 'none';
    document.getElementById('space-info').style.display = 'block';
  } catch (error) {
    alert('Error creating space: ' + error.message);
  }
});

${includeInvitations ? `
document.getElementById('send-invite-btn').addEventListener('click', async () => {
  const address = document.getElementById('invite-address').value;
  if (address) {
    try {
      await spaceManager.inviteUser(address);
      document.getElementById('invite-address').value = '';
      alert('Invitation sent successfully!');
    } catch (error) {
      alert('Error sending invitation: ' + error.message);
    }
  }
});
` : ''}
*/
`;
}