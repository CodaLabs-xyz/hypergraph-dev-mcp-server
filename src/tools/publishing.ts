export function createPublishingHelperTool() {
  return {
    name: 'create_publishing_flow',
    description: 'Generate Hypergraph publishing workflow for public data sharing',
    inputSchema: {
      type: 'object',
      properties: {
        entityType: {
          type: 'string',
          description: 'Entity type to publish (e.g., Event, Article, Product)'
        },
        publishingStrategy: {
          type: 'string',
          enum: ['immediate', 'batch', 'scheduled', 'conditional'],
          description: 'Publishing strategy',
          default: 'immediate'
        },
        includeValidation: {
          type: 'boolean',
          description: 'Include data validation before publishing',
          default: true
        },
        includePreview: {
          type: 'boolean',
          description: 'Include preview functionality',
          default: true
        },
        framework: {
          type: 'string',
          enum: ['react', 'typescript', 'vanilla-js'],
          description: 'Framework for implementation',
          default: 'react'
        },
        batchSize: {
          type: 'number',
          description: 'Batch size for batch publishing',
          default: 10
        }
      },
      required: ['entityType'],
    },
  };
}

export async function handleCreatePublishingFlow(args: any) {
  const { entityType, publishingStrategy, includeValidation, includePreview, framework, batchSize } = args;
  
  const publishingCode = generatePublishingCode(
    entityType, 
    publishingStrategy, 
    includeValidation, 
    includePreview, 
    framework, 
    batchSize
  );

  return {
    content: [
      {
        type: 'text',
        text: publishingCode,
      },
    ],
  };
}

function generatePublishingCode(
  entityType: string,
  publishingStrategy: string,
  includeValidation: boolean,
  includePreview: boolean,
  framework: string,
  batchSize: number
) {
  const capitalizedType = entityType.charAt(0).toUpperCase() + entityType.slice(1);
  
  let publishingCode = `// Hypergraph Publishing Flow for ${capitalizedType}\n`;
  
  if (framework === 'react') {
    publishingCode += generateReactPublishingCode(
      capitalizedType, 
      publishingStrategy, 
      includeValidation, 
      includePreview, 
      batchSize
    );
  } else if (framework === 'typescript') {
    publishingCode += generateTypescriptPublishingCode(
      capitalizedType, 
      publishingStrategy, 
      includeValidation, 
      includePreview, 
      batchSize
    );
  } else {
    publishingCode += generateVanillaJSPublishingCode(
      capitalizedType, 
      publishingStrategy, 
      includeValidation, 
      includePreview, 
      batchSize
    );
  }

  return publishingCode;
}

function generateReactPublishingCode(
  entityType: string,
  publishingStrategy: string,
  includeValidation: boolean,
  includePreview: boolean,
  batchSize: number
) {
  let code = `\nimport React, { useState, useCallback, useEffect } from 'react';\nimport { preparePublish, publishOps } from '@graphprotocol/hypergraph';\nimport { useHypergraphApp } from '@graphprotocol/hypergraph-react';\nimport { ${entityType} } from './schema';\nimport { mapping } from './mapping';\n\n`;

  // Main publishing component
  code += `export function ${entityType}PublishingComponent() {\n`;
  code += `  const { publishToKnowledgeGraph } = useHypergraphApp();\n`;
  code += `  const [publishingState, setPublishingState] = useState({\n`;
  code += `    status: 'idle', // 'idle' | 'preparing' | 'publishing' | 'success' | 'error'\n`;
  code += `    progress: 0,\n`;
  code += `    error: null,\n`;
  code += `    publishedCount: 0\n`;
  code += `  });\n\n`;

  if (publishingStrategy === 'batch') {
    code += `  const [batchQueue, setBatchQueue] = useState([]);\n`;
    code += `  const [currentBatch, setCurrentBatch] = useState([]);\n\n`;
  }

  if (includeValidation) {
    code += `  const [validationResults, setValidationResults] = useState(null);\n`;
  }

  if (includePreview) {
    code += `  const [previewData, setPreviewData] = useState(null);\n`;
    code += `  const [showPreview, setShowPreview] = useState(false);\n`;
  }

  // Publishing function based on strategy
  if (publishingStrategy === 'immediate') {
    code += generateImmediatePublishing(entityType, includeValidation, includePreview);
  } else if (publishingStrategy === 'batch') {
    code += generateBatchPublishing(entityType, includeValidation, includePreview, batchSize);
  } else if (publishingStrategy === 'scheduled') {
    code += generateScheduledPublishing(entityType, includeValidation, includePreview);
  } else if (publishingStrategy === 'conditional') {
    code += generateConditionalPublishing(entityType, includeValidation, includePreview);
  }

  // Validation functions
  if (includeValidation) {
    code += generateValidationFunctions(entityType);
  }

  // Preview functions
  if (includePreview) {
    code += generatePreviewFunctions(entityType);
  }

  // UI Component
  code += generatePublishingUI(entityType, publishingStrategy, includeValidation, includePreview);

  return code;
}

function generateImmediatePublishing(entityType: string, includeValidation: boolean, includePreview: boolean) {
  let code = `\n  const publish${entityType} = useCallback(async (data) => {\n`;
  code += `    try {\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'preparing', \n`;
  code += `        error: null \n`;
  code += `      }));\n\n`;

  if (includeValidation) {
    code += `      // Validate data before publishing\n`;
    code += `      const validation = await validateData(data);\n`;
    code += `      if (!validation.isValid) {\n`;
    code += `        throw new Error(\`Validation failed: \${validation.errors.join(', ')}\`);\n`;
    code += `      }\n\n`;
  }

  if (includePreview) {
    code += `      // Generate preview\n`;
    code += `      const preview = await generatePreview(data);\n`;
    code += `      setPreviewData(preview);\n\n`;
  }

  code += `      setPublishingState(prev => ({ ...prev, status: 'publishing' }));\n\n`;
  code += `      // Prepare operations for publishing\n`;
  code += `      const ops = preparePublish(${entityType}, data, mapping);\n\n`;
  code += `      // Publish to Knowledge Graph\n`;
  code += `      await publishOps(ops);\n\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'success',\n`;
  code += `        publishedCount: prev.publishedCount + 1\n`;
  code += `      }));\n\n`;
  code += `      console.log('${entityType} published successfully!');\n`;
  code += `    } catch (error) {\n`;
  code += `      console.error('Publishing failed:', error);\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'error',\n`;
  code += `        error: error.message\n`;
  code += `      }));\n`;
  code += `    }\n`;
  code += `  }, []);\n\n`;

  return code;
}

function generateBatchPublishing(entityType: string, includeValidation: boolean, includePreview: boolean, batchSize: number) {
  let code = `\n  const addToBatch = useCallback((data) => {\n`;
  code += `    setBatchQueue(prev => [...prev, data]);\n`;
  code += `  }, []);\n\n`;

  code += `  const publishBatch = useCallback(async () => {\n`;
  code += `    if (batchQueue.length === 0) return;\n\n`;
  
  code += `    try {\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'preparing', \n`;
  code += `        error: null,\n`;
  code += `        progress: 0\n`;
  code += `      }));\n\n`;

  code += `      const batches = [];\n`;
  code += `      for (let i = 0; i < batchQueue.length; i += ${batchSize}) {\n`;
  code += `        batches.push(batchQueue.slice(i, i + ${batchSize}));\n`;
  code += `      }\n\n`;

  if (includeValidation) {
    code += `      // Validate all items\n`;
    code += `      const validationPromises = batchQueue.map(validateData);\n`;
    code += `      const validationResults = await Promise.all(validationPromises);\n`;
    code += `      const invalidItems = validationResults.filter(v => !v.isValid);\n`;
    code += `      \n`;
    code += `      if (invalidItems.length > 0) {\n`;
    code += `        throw new Error(\`\${invalidItems.length} items failed validation\`);\n`;
    code += `      }\n\n`;
  }

  code += `      setPublishingState(prev => ({ ...prev, status: 'publishing' }));\n\n`;
  code += `      let publishedCount = 0;\n`;
  code += `      \n`;
  code += `      for (let i = 0; i < batches.length; i++) {\n`;
  code += `        const batch = batches[i];\n`;
  code += `        setCurrentBatch(batch);\n\n`;
  code += `        // Prepare operations for the batch\n`;
  code += `        const batchOps = [];\n`;
  code += `        for (const item of batch) {\n`;
  code += `          const ops = preparePublish(${entityType}, item, mapping);\n`;
  code += `          batchOps.push(...ops);\n`;
  code += `        }\n\n`;
  code += `        // Publish batch\n`;
  code += `        await publishOps(batchOps);\n`;
  code += `        publishedCount += batch.length;\n\n`;
  code += `        // Update progress\n`;
  code += `        const progress = ((i + 1) / batches.length) * 100;\n`;
  code += `        setPublishingState(prev => ({ \n`;
  code += `          ...prev, \n`;
  code += `          progress,\n`;
  code += `          publishedCount\n`;
  code += `        }));\n\n`;
  code += `        // Small delay between batches\n`;
  code += `        await new Promise(resolve => setTimeout(resolve, 100));\n`;
  code += `      }\n\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'success'\n`;
  code += `      }));\n`;
  code += `      setBatchQueue([]);\n`;
  code += `      setCurrentBatch([]);\n\n`;
  code += `      console.log(\`Published \${publishedCount} ${entityType.toLowerCase()}s successfully!\`);\n`;
  code += `    } catch (error) {\n`;
  code += `      console.error('Batch publishing failed:', error);\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'error',\n`;
  code += `        error: error.message\n`;
  code += `      }));\n`;
  code += `    }\n`;
  code += `  }, [batchQueue]);\n\n`;

  return code;
}

function generateScheduledPublishing(entityType: string, includeValidation: boolean, includePreview: boolean) {
  let code = `\n  const [scheduledItems, setScheduledItems] = useState([]);\n`;
  code += `  const [publishingSchedule, setPublishingSchedule] = useState(null);\n\n`;

  code += `  const scheduleForPublishing = useCallback((data, publishAt) => {\n`;
  code += `    const scheduledItem = {\n`;
  code += `      id: Date.now() + Math.random(),\n`;
  code += `      data,\n`;
  code += `      publishAt,\n`;
  code += `      status: 'scheduled'\n`;
  code += `    };\n`;
  code += `    setScheduledItems(prev => [...prev, scheduledItem]);\n`;
  code += `  }, []);\n\n`;

  code += `  const processScheduledItems = useCallback(async () => {\n`;
  code += `    const now = new Date();\n`;
  code += `    const itemsToPublish = scheduledItems.filter(item => \n`;
  code += `      item.status === 'scheduled' && new Date(item.publishAt) <= now\n`;
  code += `    );\n\n`;
  
  code += `    if (itemsToPublish.length === 0) return;\n\n`;
  
  code += `    try {\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'publishing'\n`;
  code += `      }));\n\n`;
  
  code += `      for (const item of itemsToPublish) {\n`;
  
  if (includeValidation) {
    code += `        // Validate before publishing\n`;
    code += `        const validation = await validateData(item.data);\n`;
    code += `        if (!validation.isValid) {\n`;
    code += `          console.error(\`Validation failed for scheduled item \${item.id}\`);\n`;
    code += `          continue;\n`;
    code += `        }\n\n`;
  }
  
  code += `        // Publish the item\n`;
  code += `        const ops = preparePublish(${entityType}, item.data, mapping);\n`;
  code += `        await publishOps(ops);\n\n`;
  code += `        // Update item status\n`;
  code += `        setScheduledItems(prev => prev.map(si => \n`;
  code += `          si.id === item.id ? { ...si, status: 'published' } : si\n`;
  code += `        ));\n\n`;
  code += `        setPublishingState(prev => ({ \n`;
  code += `          ...prev, \n`;
  code += `          publishedCount: prev.publishedCount + 1\n`;
  code += `        }));\n`;
  code += `      }\n\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'success'\n`;
  code += `      }));\n`;
  code += `    } catch (error) {\n`;
  code += `      console.error('Scheduled publishing failed:', error);\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        status: 'error',\n`;
  code += `        error: error.message\n`;
  code += `      }));\n`;
  code += `    }\n`;
  code += `  }, [scheduledItems]);\n\n`;

  code += `  // Check for scheduled items every minute\n`;
  code += `  useEffect(() => {\n`;
  code += `    const interval = setInterval(processScheduledItems, 60000);\n`;
  code += `    return () => clearInterval(interval);\n`;
  code += `  }, [processScheduledItems]);\n\n`;

  return code;
}

function generateConditionalPublishing(entityType: string, includeValidation: boolean, includePreview: boolean) {
  let code = `\n  const [publishingConditions, setPublishingConditions] = useState({\n`;
  code += `    minimumApprovals: 1,\n`;
  code += `    requiresModeration: true,\n`;
  code += `    allowedHours: { start: 9, end: 17 }, // Business hours\n`;
  code += `    maxDailyPublications: 10\n`;
  code += `  });\n\n`;
  
  code += `  const [pendingApprovals, setPendingApprovals] = useState([]);\n`;
  code += `  const [dailyPublishCount, setDailyPublishCount] = useState(0);\n\n`;

  code += `  const checkPublishingConditions = useCallback(async (data) => {\n`;
  code += `    const conditions = [];\n\n`;
  
  code += `    // Check business hours\n`;
  code += `    const now = new Date();\n`;
  code += `    const currentHour = now.getHours();\n`;
  code += `    if (currentHour < publishingConditions.allowedHours.start || \n`;
  code += `        currentHour >= publishingConditions.allowedHours.end) {\n`;
  code += `      conditions.push({\n`;
  code += `        type: 'business_hours',\n`;
  code += `        message: 'Publishing outside business hours',\n`;
  code += `        canOverride: true\n`;
  code += `      });\n`;
  code += `    }\n\n`;
  
  code += `    // Check daily limit\n`;
  code += `    if (dailyPublishCount >= publishingConditions.maxDailyPublications) {\n`;
  code += `      conditions.push({\n`;
  code += `        type: 'daily_limit',\n`;
  code += `        message: 'Daily publication limit reached',\n`;
  code += `        canOverride: false\n`;
  code += `      });\n`;
  code += `    }\n\n`;

  if (includeValidation) {
    code += `    // Content validation\n`;
    code += `    const validation = await validateData(data);\n`;
    code += `    if (!validation.isValid) {\n`;
    code += `      conditions.push({\n`;
    code += `        type: 'validation',\n`;
    code += `        message: \`Validation errors: \${validation.errors.join(', ')}\`,\n`;
    code += `        canOverride: false\n`;
    code += `      });\n`;
    code += `    }\n\n`;
  }
  
  code += `    return conditions;\n`;
  code += `  }, [publishingConditions, dailyPublishCount]);\n\n`;

  code += `  const requestPublishingApproval = useCallback(async (data) => {\n`;
  code += `    const conditions = await checkPublishingConditions(data);\n`;
  code += `    const blockers = conditions.filter(c => !c.canOverride);\n\n`;
  
  code += `    if (blockers.length > 0) {\n`;
  code += `      throw new Error(\`Cannot publish: \${blockers.map(b => b.message).join(', ')}\`);\n`;
  code += `    }\n\n`;
  
  code += `    if (conditions.length > 0 && publishingConditions.requiresModeration) {\n`;
  code += `      // Add to approval queue\n`;
  code += `      const approvalRequest = {\n`;
  code += `        id: Date.now() + Math.random(),\n`;
  code += `        data,\n`;
  code += `        conditions,\n`;
  code += `        requestedAt: new Date(),\n`;
  code += `        status: 'pending',\n`;
  code += `        approvals: []\n`;
  code += `      };\n`;
  code += `      setPendingApprovals(prev => [...prev, approvalRequest]);\n`;
  code += `      return { requiresApproval: true, requestId: approvalRequest.id };\n`;
  code += `    }\n\n`;
  
  code += `    // Can publish immediately\n`;
  code += `    return { requiresApproval: false };\n`;
  code += `  }, [checkPublishingConditions, publishingConditions]);\n\n`;

  code += `  const approvePublication = useCallback((requestId, approverId) => {\n`;
  code += `    setPendingApprovals(prev => prev.map(request => {\n`;
  code += `      if (request.id === requestId) {\n`;
  code += `        const newApprovals = [...request.approvals, { approverId, approvedAt: new Date() }];\n`;
  code += `        const updatedRequest = { ...request, approvals: newApprovals };\n`;
  code += `        \n`;
  code += `        if (newApprovals.length >= publishingConditions.minimumApprovals) {\n`;
  code += `          updatedRequest.status = 'approved';\n`;
  code += `          // Auto-publish approved items\n`;
  code += `          setTimeout(() => publishApprovedItem(updatedRequest), 100);\n`;
  code += `        }\n`;
  code += `        \n`;
  code += `        return updatedRequest;\n`;
  code += `      }\n`;
  code += `      return request;\n`;
  code += `    }));\n`;
  code += `  }, [publishingConditions]);\n\n`;

  code += `  const publishApprovedItem = useCallback(async (approvalRequest) => {\n`;
  code += `    try {\n`;
  code += `      const ops = preparePublish(${entityType}, approvalRequest.data, mapping);\n`;
  code += `      await publishOps(ops);\n\n`;
  code += `      setPendingApprovals(prev => prev.map(request => \n`;
  code += `        request.id === approvalRequest.id \n`;
  code += `          ? { ...request, status: 'published' }\n`;
  code += `          : request\n`;
  code += `      ));\n\n`;
  code += `      setDailyPublishCount(prev => prev + 1);\n`;
  code += `      setPublishingState(prev => ({ \n`;
  code += `        ...prev, \n`;
  code += `        publishedCount: prev.publishedCount + 1\n`;
  code += `      }));\n`;
  code += `    } catch (error) {\n`;
  code += `      console.error('Failed to publish approved item:', error);\n`;
  code += `    }\n`;
  code += `  }, []);\n\n`;

  return code;
}

function generateValidationFunctions(entityType: string) {
  let code = `\n  // Validation functions\n`;
  code += `  const validateData = useCallback(async (data) => {\n`;
  code += `    const errors = [];\n\n`;
  
  code += `    // Basic validation\n`;
  code += `    if (!data || typeof data !== 'object') {\n`;
  code += `      errors.push('Data must be an object');\n`;
  code += `      return { isValid: false, errors };\n`;
  code += `    }\n\n`;
  
  code += `    // Required fields validation\n`;
  code += `    const requiredFields = ['name']; // Add your required fields\n`;
  code += `    for (const field of requiredFields) {\n`;
  code += `      if (!data[field]) {\n`;
  code += `        errors.push(\`Missing required field: \${field}\`);\n`;
  code += `      }\n`;
  code += `    }\n\n`;
  
  code += `    // Content validation\n`;
  code += `    if (data.name && data.name.length < 3) {\n`;
  code += `      errors.push('Name must be at least 3 characters long');\n`;
  code += `    }\n\n`;
  
  code += `    // Custom validation rules\n`;
  code += `    try {\n`;
  code += `      await customValidationRules(data);\n`;
  code += `    } catch (error) {\n`;
  code += `      errors.push(error.message);\n`;
  code += `    }\n\n`;
  
  code += `    return {\n`;
  code += `      isValid: errors.length === 0,\n`;
  code += `      errors\n`;
  code += `    };\n`;
  code += `  }, []);\n\n`;

  code += `  const customValidationRules = useCallback(async (data) => {\n`;
  code += `    // Add your custom validation logic here\n`;
  code += `    // Example: Check for inappropriate content\n`;
  code += `    if (data.description && data.description.includes('spam')) {\n`;
  code += `      throw new Error('Content appears to be spam');\n`;
  code += `    }\n\n`;
  code += `    // Example: Check for duplicates\n`;
  code += `    // const existing = await checkForDuplicates(data);\n`;
  code += `    // if (existing) {\n`;
  code += `    //   throw new Error('Duplicate content detected');\n`;
  code += `    // }\n`;
  code += `  }, []);\n\n`;

  return code;
}

function generatePreviewFunctions(entityType: string) {
  let code = `\n  // Preview functions\n`;
  code += `  const generatePreview = useCallback(async (data) => {\n`;
  code += `    try {\n`;
  code += `      // Generate a preview of how the data will appear in the Knowledge Graph\n`;
  code += `      const ops = preparePublish(${entityType}, data, mapping);\n`;
  code += `      \n`;
  code += `      return {\n`;
  code += `        data,\n`;
  code += `        operations: ops,\n`;
  code += `        preview: {\n`;
  code += `          title: data.name || 'Untitled ${entityType}',\n`;
  code += `          description: data.description || 'No description',\n`;
  code += `          properties: Object.keys(data).length,\n`;
  code += `          estimatedSize: JSON.stringify(data).length,\n`;
  code += `          generatedAt: new Date()\n`;
  code += `        }\n`;
  code += `      };\n`;
  code += `    } catch (error) {\n`;
  code += `      console.error('Preview generation failed:', error);\n`;
  code += `      throw error;\n`;
  code += `    }\n`;
  code += `  }, []);\n\n`;

  return code;
}

function generatePublishingUI(
  entityType: string,
  publishingStrategy: string,
  includeValidation: boolean,
  includePreview: boolean
) {
  let code = `\n  return (\n`;
  code += `    <div className="${entityType.toLowerCase()}-publishing">\n`;
  code += `      <h2>${entityType} Publishing</h2>\n\n`;
  
  // Status display
  code += `      <div className="publishing-status">\n`;
  code += `        <p>Status: <span className="status-{publishingState.status}">\n`;
  code += `          {publishingState.status}\n`;
  code += `        </span></p>\n`;
  code += `        {publishingState.progress > 0 && (\n`;
  code += `          <div className="progress-bar">\n`;
  code += `            <div \n`;
  code += `              className="progress-fill" \n`;
  code += `              style={{ width: \`\${publishingState.progress}%\` }}\n`;
  code += `            />\n`;
  code += `          </div>\n`;
  code += `        )}\n`;
  code += `        <p>Published: {publishingState.publishedCount}</p>\n`;
  code += `        {publishingState.error && (\n`;
  code += `          <div className="error-message">\n`;
  code += `            Error: {publishingState.error}\n`;
  code += `          </div>\n`;
  code += `        )}\n`;
  code += `      </div>\n\n`;

  // Strategy-specific UI
  if (publishingStrategy === 'immediate') {
    code += generateImmediateUI(entityType, includeValidation, includePreview);
  } else if (publishingStrategy === 'batch') {
    code += generateBatchUI(entityType);
  } else if (publishingStrategy === 'scheduled') {
    code += generateScheduledUI(entityType);
  } else if (publishingStrategy === 'conditional') {
    code += generateConditionalUI(entityType);
  }

  // Preview modal
  if (includePreview) {
    code += generatePreviewModal(entityType);
  }

  code += `    </div>\n`;
  code += `  );\n`;
  code += `}\n\n`;

  // CSS Styles
  code += generatePublishingCSS(entityType, publishingStrategy);

  return code;
}

function generateImmediateUI(entityType: string, includeValidation: boolean, includePreview: boolean) {
  let code = `      <div className="immediate-publishing">\n`;
  code += `        <h3>Publish ${entityType} Immediately</h3>\n`;
  code += `        <${entityType}Form onSubmit={publish${entityType}} />\n`;
  
  if (includeValidation) {
    code += `        {validationResults && (\n`;
    code += `          <ValidationResults results={validationResults} />\n`;
    code += `        )}\n`;
  }
  
  if (includePreview) {
    code += `        {previewData && (\n`;
    code += `          <button onClick={() => setShowPreview(true)}>\n`;
    code += `            Show Preview\n`;
    code += `          </button>\n`;
    code += `        )}\n`;
  }
  
  code += `      </div>\n\n`;
  return code;
}

function generateBatchUI(entityType: string) {
  let code = `      <div className="batch-publishing">\n`;
  code += `        <h3>Batch Publishing</h3>\n`;
  code += `        <div className="batch-info">\n`;
  code += `          <p>Queue: {batchQueue.length} items</p>\n`;
  code += `          <button \n`;
  code += `            onClick={publishBatch}\n`;
  code += `            disabled={batchQueue.length === 0 || publishingState.status === 'publishing'}\n`;
  code += `          >\n`;
  code += `            Publish Batch\n`;
  code += `          </button>\n`;
  code += `        </div>\n`;
  code += `        \n`;
  code += `        <${entityType}Form onSubmit={addToBatch} submitLabel="Add to Batch" />\n`;
  code += `        \n`;
  code += `        <div className="batch-queue">\n`;
  code += `          <h4>Queued Items:</h4>\n`;
  code += `          {batchQueue.map((item, index) => (\n`;
  code += `            <div key={index} className="batch-item">\n`;
  code += `              <span>{item.name || \`Item \${index + 1}\`}</span>\n`;
  code += `              <button onClick={() => setBatchQueue(prev => prev.filter((_, i) => i !== index))}>\n`;
  code += `                Remove\n`;
  code += `              </button>\n`;
  code += `            </div>\n`;
  code += `          ))}\n`;
  code += `        </div>\n`;
  code += `      </div>\n\n`;
  return code;
}

function generateScheduledUI(entityType: string) {
  let code = `      <div className="scheduled-publishing">\n`;
  code += `        <h3>Scheduled Publishing</h3>\n`;
  code += `        <${entityType}ScheduleForm onSubmit={scheduleForPublishing} />\n`;
  code += `        \n`;
  code += `        <div className="scheduled-items">\n`;
  code += `          <h4>Scheduled Items:</h4>\n`;
  code += `          {scheduledItems.map((item) => (\n`;
  code += `            <div key={item.id} className="scheduled-item">\n`;
  code += `              <span>{item.data.name || 'Untitled'}</span>\n`;
  code += `              <span>Publish at: {new Date(item.publishAt).toLocaleString()}</span>\n`;
  code += `              <span className="status-{item.status}">{item.status}</span>\n`;
  code += `            </div>\n`;
  code += `          ))}\n`;
  code += `        </div>\n`;
  code += `      </div>\n\n`;
  return code;
}

function generateConditionalUI(entityType: string) {
  let code = `      <div className="conditional-publishing">\n`;
  code += `        <h3>Conditional Publishing</h3>\n`;
  code += `        <${entityType}ConditionalForm onSubmit={requestPublishingApproval} />\n`;
  code += `        \n`;
  code += `        <div className="pending-approvals">\n`;
  code += `          <h4>Pending Approvals:</h4>\n`;
  code += `          {pendingApprovals.map((request) => (\n`;
  code += `            <div key={request.id} className="approval-request">\n`;
  code += `              <span>{request.data.name || 'Untitled'}</span>\n`;
  code += `              <span>Status: {request.status}</span>\n`;
  code += `              <span>Approvals: {request.approvals.length}/{publishingConditions.minimumApprovals}</span>\n`;
  code += `              {request.status === 'pending' && (\n`;
  code += `                <button onClick={() => approvePublication(request.id, 'current-user')}>\n`;
  code += `                  Approve\n`;
  code += `                </button>\n`;
  code += `              )}\n`;
  code += `            </div>\n`;
  code += `          ))}\n`;
  code += `        </div>\n`;
  code += `      </div>\n\n`;
  return code;
}

function generatePreviewModal(entityType: string) {
  let code = `      {showPreview && previewData && (\n`;
  code += `        <PreviewModal \n`;
  code += `          data={previewData}\n`;
  code += `          onClose={() => setShowPreview(false)}\n`;
  code += `          entityType="${entityType}"\n`;
  code += `        />\n`;
  code += `      )}\n\n`;
  return code;
}

function generatePublishingCSS(entityType: string, publishingStrategy: string) {
  let code = `// CSS Styles (add to your CSS file)\nconst publishingStyles = \`\n`;
  code += `.${entityType.toLowerCase()}-publishing {\n`;
  code += `  max-width: 800px;\n`;
  code += `  margin: 0 auto;\n`;
  code += `  padding: 20px;\n`;
  code += `}\n\n`;
  code += `.publishing-status {\n`;
  code += `  background: #f8f9fa;\n`;
  code += `  border: 1px solid #dee2e6;\n`;
  code += `  border-radius: 6px;\n`;
  code += `  padding: 15px;\n`;
  code += `  margin-bottom: 20px;\n`;
  code += `}\n\n`;
  code += `.progress-bar {\n`;
  code += `  width: 100%;\n`;
  code += `  height: 20px;\n`;
  code += `  background-color: #e9ecef;\n`;
  code += `  border-radius: 10px;\n`;
  code += `  overflow: hidden;\n`;
  code += `  margin: 10px 0;\n`;
  code += `}\n\n`;
  code += `.progress-fill {\n`;
  code += `  height: 100%;\n`;
  code += `  background-color: #28a745;\n`;
  code += `  transition: width 0.3s ease;\n`;
  code += `}\n\n`;
  code += `.error-message {\n`;
  code += `  color: #dc3545;\n`;
  code += `  background-color: #f8d7da;\n`;
  code += `  border: 1px solid #f5c6cb;\n`;
  code += `  border-radius: 4px;\n`;
  code += `  padding: 10px;\n`;
  code += `  margin-top: 10px;\n`;
  code += `}\n\n`;
  code += `.status-idle { color: #6c757d; }\n`;
  code += `.status-preparing { color: #ffc107; }\n`;
  code += `.status-publishing { color: #007bff; }\n`;
  code += `.status-success { color: #28a745; }\n`;
  code += `.status-error { color: #dc3545; }\n`;
  code += `.status-pending { color: #ffc107; }\n`;
  code += `.status-approved { color: #28a745; }\n`;
  code += `.status-published { color: #17a2b8; }\n`;
  code += `\`;\n`;

  return code;
}

function generateTypescriptPublishingCode(
  entityType: string,
  publishingStrategy: string,
  includeValidation: boolean,
  includePreview: boolean,
  batchSize: number
) {
  let code = `\nimport { HypergraphApp, preparePublish, publishOps } from '@graphprotocol/hypergraph';\nimport { ${entityType} } from './schema';\nimport { mapping } from './mapping';\n\n`;

  code += `interface PublishingState {\n`;
  code += `  status: 'idle' | 'preparing' | 'publishing' | 'success' | 'error';\n`;
  code += `  progress: number;\n`;
  code += `  error: string | null;\n`;
  code += `  publishedCount: number;\n`;
  code += `}\n\n`;

  if (includeValidation) {
    code += `interface ValidationResult {\n`;
    code += `  isValid: boolean;\n`;
    code += `  errors: string[];\n`;
    code += `}\n\n`;
  }

  code += `export class ${entityType}PublishingManager {\n`;
  code += `  private hypergraphApp: HypergraphApp;\n`;
  code += `  private state: PublishingState;\n`;
  code += `  private listeners: ((state: PublishingState) => void)[] = [];\n\n`;

  if (publishingStrategy === 'batch') {
    code += `  private batchQueue: any[] = [];\n`;
    code += `  private batchSize: number = ${batchSize};\n\n`;
  }

  code += `  constructor(hypergraphApp: HypergraphApp) {\n`;
  code += `    this.hypergraphApp = hypergraphApp;\n`;
  code += `    this.state = {\n`;
  code += `      status: 'idle',\n`;
  code += `      progress: 0,\n`;
  code += `      error: null,\n`;
  code += `      publishedCount: 0\n`;
  code += `    };\n`;
  code += `  }\n\n`;

  // State management
  code += `  private updateState(updates: Partial<PublishingState>): void {\n`;
  code += `    this.state = { ...this.state, ...updates };\n`;
  code += `    this.listeners.forEach(listener => listener(this.state));\n`;
  code += `  }\n\n`;

  code += `  onStateChange(listener: (state: PublishingState) => void): () => void {\n`;
  code += `    this.listeners.push(listener);\n`;
  code += `    return () => {\n`;
  code += `      const index = this.listeners.indexOf(listener);\n`;
  code += `      if (index > -1) {\n`;
  code += `        this.listeners.splice(index, 1);\n`;
  code += `      }\n`;
  code += `    };\n`;
  code += `  }\n\n`;

  // Publishing methods based on strategy
  if (publishingStrategy === 'immediate') {
    code += generateTypescriptImmediatePublishing(entityType, includeValidation);
  } else if (publishingStrategy === 'batch') {
    code += generateTypescriptBatchPublishing(entityType, includeValidation, batchSize);
  }

  if (includeValidation) {
    code += generateTypescriptValidation(entityType);
  }

  code += `  getState(): PublishingState {\n`;
  code += `    return { ...this.state };\n`;
  code += `  }\n`;
  code += `}\n\n`;

  // Usage example
  code += `// Usage Example\n`;
  code += `/*\n`;
  code += `const hypergraphApp = new HypergraphApp({ mapping });\n`;
  code += `const publishingManager = new ${entityType}PublishingManager(hypergraphApp);\n\n`;
  code += `// Listen to state changes\n`;
  code += `const unsubscribe = publishingManager.onStateChange((state) => {\n`;
  code += `  console.log('Publishing state:', state);\n`;
  code += `});\n\n`;
  code += `// Publish data\n`;
  code += `try {\n`;
  
  if (publishingStrategy === 'immediate') {
    code += `  await publishingManager.publishImmediate(${entityType.toLowerCase()}Data);\n`;
  } else if (publishingStrategy === 'batch') {
    code += `  publishingManager.addToBatch(${entityType.toLowerCase()}Data1);\n`;
    code += `  publishingManager.addToBatch(${entityType.toLowerCase()}Data2);\n`;
    code += `  await publishingManager.publishBatch();\n`;
  }
  
  code += `  console.log('Published successfully!');\n`;
  code += `} catch (error) {\n`;
  code += `  console.error('Publishing failed:', error);\n`;
  code += `}\n\n`;
  code += `// Cleanup\n`;
  code += `unsubscribe();\n`;
  code += `*/\n`;

  return code;
}

function generateTypescriptImmediatePublishing(entityType: string, includeValidation: boolean) {
  let code = `  async publishImmediate(data: any): Promise<void> {\n`;
  code += `    try {\n`;
  code += `      this.updateState({ status: 'preparing', error: null });\n\n`;

  if (includeValidation) {
    code += `      // Validate data\n`;
    code += `      const validation = await this.validateData(data);\n`;
    code += `      if (!validation.isValid) {\n`;
    code += `        throw new Error(\`Validation failed: \${validation.errors.join(', ')}\`);\n`;
    code += `      }\n\n`;
  }

  code += `      this.updateState({ status: 'publishing' });\n\n`;
  code += `      // Prepare and publish\n`;
  code += `      const ops = preparePublish(${entityType}, data, mapping);\n`;
  code += `      await publishOps(ops);\n\n`;
  code += `      this.updateState({ \n`;
  code += `        status: 'success',\n`;
  code += `        publishedCount: this.state.publishedCount + 1\n`;
  code += `      });\n`;
  code += `    } catch (error) {\n`;
  code += `      this.updateState({ \n`;
  code += `        status: 'error',\n`;
  code += `        error: error instanceof Error ? error.message : 'Unknown error'\n`;
  code += `      });\n`;
  code += `      throw error;\n`;
  code += `    }\n`;
  code += `  }\n\n`;

  return code;
}

function generateTypescriptBatchPublishing(entityType: string, includeValidation: boolean, batchSize: number) {
  let code = `  addToBatch(data: any): void {\n`;
  code += `    this.batchQueue.push(data);\n`;
  code += `  }\n\n`;

  code += `  getBatchSize(): number {\n`;
  code += `    return this.batchQueue.length;\n`;
  code += `  }\n\n`;

  code += `  clearBatch(): void {\n`;
  code += `    this.batchQueue = [];\n`;
  code += `  }\n\n`;

  code += `  async publishBatch(): Promise<void> {\n`;
  code += `    if (this.batchQueue.length === 0) {\n`;
  code += `      throw new Error('Batch queue is empty');\n`;
  code += `    }\n\n`;

  code += `    try {\n`;
  code += `      this.updateState({ status: 'preparing', error: null, progress: 0 });\n\n`;

  if (includeValidation) {
    code += `      // Validate all items\n`;
    code += `      const validationPromises = this.batchQueue.map(data => this.validateData(data));\n`;
    code += `      const validationResults = await Promise.all(validationPromises);\n`;
    code += `      const invalidItems = validationResults.filter(v => !v.isValid);\n`;
    code += `      \n`;
    code += `      if (invalidItems.length > 0) {\n`;
    code += `        throw new Error(\`\${invalidItems.length} items failed validation\`);\n`;
    code += `      }\n\n`;
  }

  code += `      this.updateState({ status: 'publishing' });\n\n`;
  code += `      // Process in batches\n`;
  code += `      const batches: any[][] = [];\n`;
  code += `      for (let i = 0; i < this.batchQueue.length; i += this.batchSize) {\n`;
  code += `        batches.push(this.batchQueue.slice(i, i + this.batchSize));\n`;
  code += `      }\n\n`;

  code += `      let publishedCount = 0;\n`;
  code += `      \n`;
  code += `      for (let i = 0; i < batches.length; i++) {\n`;
  code += `        const batch = batches[i];\n`;
  code += `        \n`;
  code += `        // Prepare operations for the batch\n`;
  code += `        const batchOps: any[] = [];\n`;
  code += `        for (const item of batch) {\n`;
  code += `          const ops = preparePublish(${entityType}, item, mapping);\n`;
  code += `          batchOps.push(...ops);\n`;
  code += `        }\n\n`;
  code += `        // Publish batch\n`;
  code += `        await publishOps(batchOps);\n`;
  code += `        publishedCount += batch.length;\n\n`;
  code += `        // Update progress\n`;
  code += `        const progress = ((i + 1) / batches.length) * 100;\n`;
  code += `        this.updateState({ \n`;
  code += `          progress,\n`;
  code += `          publishedCount: this.state.publishedCount + publishedCount\n`;
  code += `        });\n\n`;
  code += `        // Small delay between batches\n`;
  code += `        await new Promise(resolve => setTimeout(resolve, 100));\n`;
  code += `      }\n\n`;
  code += `      this.updateState({ status: 'success' });\n`;
  code += `      this.batchQueue = [];\n`;
  code += `    } catch (error) {\n`;
  code += `      this.updateState({ \n`;
  code += `        status: 'error',\n`;
  code += `        error: error instanceof Error ? error.message : 'Unknown error'\n`;
  code += `      });\n`;
  code += `      throw error;\n`;
  code += `    }\n`;
  code += `  }\n\n`;

  return code;
}

function generateTypescriptValidation(entityType: string) {
  let code = `  private async validateData(data: any): Promise<ValidationResult> {\n`;
  code += `    const errors: string[] = [];\n\n`;
  
  code += `    // Basic validation\n`;
  code += `    if (!data || typeof data !== 'object') {\n`;
  code += `      errors.push('Data must be an object');\n`;
  code += `      return { isValid: false, errors };\n`;
  code += `    }\n\n`;
  
  code += `    // Add your validation rules here\n`;
  code += `    if (!data.name || typeof data.name !== 'string') {\n`;
  code += `      errors.push('Name is required and must be a string');\n`;
  code += `    }\n\n`;
  
  code += `    if (data.name && data.name.length < 3) {\n`;
  code += `      errors.push('Name must be at least 3 characters long');\n`;
  code += `    }\n\n`;
  
  code += `    return {\n`;
  code += `      isValid: errors.length === 0,\n`;
  code += `      errors\n`;
  code += `    };\n`;
  code += `  }\n\n`;

  return code;
}

function generateVanillaJSPublishingCode(
  entityType: string,
  publishingStrategy: string,
  includeValidation: boolean,
  includePreview: boolean,
  batchSize: number
) {
  let code = `\n// Vanilla JavaScript Publishing Manager for ${entityType}\n\n`;

  code += `class ${entityType}PublishingManager {\n`;
  code += `  constructor(hypergraphApp) {\n`;
  code += `    this.hypergraphApp = hypergraphApp;\n`;
  code += `    this.state = {\n`;
  code += `      status: 'idle',\n`;
  code += `      progress: 0,\n`;
  code += `      error: null,\n`;
  code += `      publishedCount: 0\n`;
  code += `    };\n`;
  code += `    this.listeners = [];\n`;
  
  if (publishingStrategy === 'batch') {
    code += `    this.batchQueue = [];\n`;
    code += `    this.batchSize = ${batchSize};\n`;
  }
  
  code += `  }\n\n`;

  // State management
  code += `  updateState(updates) {\n`;
  code += `    this.state = { ...this.state, ...updates };\n`;
  code += `    this.listeners.forEach(listener => listener(this.state));\n`;
  code += `  }\n\n`;

  code += `  onStateChange(listener) {\n`;
  code += `    this.listeners.push(listener);\n`;
  code += `    return () => {\n`;
  code += `      const index = this.listeners.indexOf(listener);\n`;
  code += `      if (index > -1) {\n`;
  code += `        this.listeners.splice(index, 1);\n`;
  code += `      }\n`;
  code += `    };\n`;
  code += `  }\n\n`;

  // Publishing methods
  if (publishingStrategy === 'immediate') {
    code += `  async publishImmediate(data) {\n`;
    code += `    try {\n`;
    code += `      this.updateState({ status: 'preparing', error: null });\n\n`;
    
    if (includeValidation) {
      code += `      const validation = await this.validateData(data);\n`;
      code += `      if (!validation.isValid) {\n`;
      code += `        throw new Error(\`Validation failed: \${validation.errors.join(', ')}\`);\n`;
      code += `      }\n\n`;
    }
    
    code += `      this.updateState({ status: 'publishing' });\n\n`;
    code += `      const ops = preparePublish(${entityType}, data, mapping);\n`;
    code += `      await publishOps(ops);\n\n`;
    code += `      this.updateState({ \n`;
    code += `        status: 'success',\n`;
    code += `        publishedCount: this.state.publishedCount + 1\n`;
    code += `      });\n`;
    code += `    } catch (error) {\n`;
    code += `      this.updateState({ \n`;
    code += `        status: 'error',\n`;
    code += `        error: error.message\n`;
    code += `      });\n`;
    code += `      throw error;\n`;
    code += `    }\n`;
    code += `  }\n\n`;
  }

  if (publishingStrategy === 'batch') {
    code += `  addToBatch(data) {\n`;
    code += `    this.batchQueue.push(data);\n`;
    code += `  }\n\n`;

    code += `  async publishBatch() {\n`;
    code += `    if (this.batchQueue.length === 0) {\n`;
    code += `      throw new Error('Batch queue is empty');\n`;
    code += `    }\n\n`;

    code += `    try {\n`;
    code += `      this.updateState({ status: 'preparing', error: null, progress: 0 });\n\n`;
    
    code += `      // Process in batches\n`;
    code += `      const batches = [];\n`;
    code += `      for (let i = 0; i < this.batchQueue.length; i += this.batchSize) {\n`;
    code += `        batches.push(this.batchQueue.slice(i, i + this.batchSize));\n`;
    code += `      }\n\n`;
    
    code += `      this.updateState({ status: 'publishing' });\n`;
    code += `      let publishedCount = 0;\n\n`;
    
    code += `      for (let i = 0; i < batches.length; i++) {\n`;
    code += `        const batch = batches[i];\n`;
    code += `        const batchOps = [];\n\n`;
    code += `        for (const item of batch) {\n`;
    code += `          const ops = preparePublish(${entityType}, item, mapping);\n`;
    code += `          batchOps.push(...ops);\n`;
    code += `        }\n\n`;
    code += `        await publishOps(batchOps);\n`;
    code += `        publishedCount += batch.length;\n\n`;
    code += `        const progress = ((i + 1) / batches.length) * 100;\n`;
    code += `        this.updateState({ \n`;
    code += `          progress,\n`;
    code += `          publishedCount: this.state.publishedCount + publishedCount\n`;
    code += `        });\n\n`;
    code += `        await new Promise(resolve => setTimeout(resolve, 100));\n`;
    code += `      }\n\n`;
    code += `      this.updateState({ status: 'success' });\n`;
    code += `      this.batchQueue = [];\n`;
    code += `    } catch (error) {\n`;
    code += `      this.updateState({ \n`;
    code += `        status: 'error',\n`;
    code += `        error: error.message\n`;
    code += `      });\n`;
    code += `      throw error;\n`;
    code += `    }\n`;
    code += `  }\n\n`;
  }

  if (includeValidation) {
    code += `  async validateData(data) {\n`;
    code += `    const errors = [];\n\n`;
    code += `    if (!data || typeof data !== 'object') {\n`;
    code += `      errors.push('Data must be an object');\n`;
    code += `      return { isValid: false, errors };\n`;
    code += `    }\n\n`;
    code += `    if (!data.name || typeof data.name !== 'string') {\n`;
    code += `      errors.push('Name is required and must be a string');\n`;
    code += `    }\n\n`;
    code += `    return {\n`;
    code += `      isValid: errors.length === 0,\n`;
    code += `      errors\n`;
    code += `    };\n`;
    code += `  }\n\n`;
  }

  code += `  getState() {\n`;
  code += `    return { ...this.state };\n`;
  code += `  }\n`;
  code += `}\n\n`;

  // Usage example
  code += `// Usage Example\n`;
  code += `const hypergraphApp = new HypergraphApp({ mapping });\n`;
  code += `const publishingManager = new ${entityType}PublishingManager(hypergraphApp);\n\n`;
  code += `// Listen to state changes\n`;
  code += `const unsubscribe = publishingManager.onStateChange((state) => {\n`;
  code += `  console.log('Publishing state:', state);\n`;
  code += `  updateUI(state);\n`;
  code += `});\n\n`;
  code += `// Publish data\n`;
  
  if (publishingStrategy === 'immediate') {
    code += `publishingManager.publishImmediate(${entityType.toLowerCase()}Data)\n`;
    code += `  .then(() => console.log('Published successfully!'))\n`;
    code += `  .catch(error => console.error('Publishing failed:', error));\n`;
  } else if (publishingStrategy === 'batch') {
    code += `publishingManager.addToBatch(${entityType.toLowerCase()}Data1);\n`;
    code += `publishingManager.addToBatch(${entityType.toLowerCase()}Data2);\n`;
    code += `publishingManager.publishBatch()\n`;
    code += `  .then(() => console.log('Batch published successfully!'))\n`;
    code += `  .catch(error => console.error('Batch publishing failed:', error));\n`;
  }

  return code;
}