/**
 * Model Context Protocol (MCP) Types
 * Types for MCP integration and AI model communication
 */

// MCP Core Configuration
export interface MCPConfig {
  enabled: boolean;
  serverUrl: string;
  apiKey?: string;
  version: string;
  features: MCPFeatureFlags;
  security: MCPSecuritySettings;
}

export interface MCPFeatureFlags {
  modelIntegration: boolean;
  resourceSharing: boolean;
  toolRegistry: boolean;
  sessionManagement: boolean;
  realTimeSync: boolean;
  offlineSupport: boolean;
}

export interface MCPSecuritySettings {
  enableAuth: boolean;
  encryptionLevel: 'none' | 'basic' | 'advanced';
  allowedOrigins: string[];
  rateLimit: {
    requestsPerMinute: number;
    burstLimit: number;
  };
  permissions: MCPPermissions;
}

export interface MCPPermissions {
  readModels: boolean;
  writeModels: boolean;
  executeTools: boolean;
  manageResources: boolean;
  accessUserData: boolean;
}

// Protocol Messages
export interface MCPMessage {
  id: string;
  type: MCPMessageType;
  timestamp: number;
  payload: unknown;
  metadata?: MCPMessageMetadata;
}

export type MCPMessageType = 
  | 'handshake'
  | 'resource_request'
  | 'resource_response'
  | 'tool_call'
  | 'tool_response'
  | 'model_update'
  | 'session_start'
  | 'session_end'
  | 'error'
  | 'heartbeat';

export interface MCPMessageMetadata {
  sender: string;
  receiver?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  encrypted: boolean;
  requiresResponse: boolean;
  timeout?: number;
}

// Resource Management
export interface MCPResource {
  id: string;
  type: MCPResourceType;
  name: string;
  description: string;
  version: string;
  metadata: MCPResourceMetadata;
  data: unknown;
}

export type MCPResourceType = 
  | 'video_stream'
  | 'audio_stream'
  | 'subtitle_track'
  | 'thumbnail_set'
  | 'analytics_data'
  | 'user_preferences'
  | 'ai_model'
  | 'plugin_data';

export interface MCPResourceMetadata {
  createdAt: number;
  updatedAt: number;
  size: number;
  mimeType?: string;
  encoding?: string;
  checksum?: string;
  permissions: string[];
}

// Tool Registry
export interface MCPTool {
  id: string;
  name: string;
  description: string;
  version: string;
  category: MCPToolCategory;
  parameters: MCPToolParameter[];
  returnType: string;
  executable: boolean;
  deprecated: boolean;
}

export type MCPToolCategory = 
  | 'video_processing'
  | 'audio_processing'
  | 'ai_inference'
  | 'analytics'
  | 'networking'
  | 'storage'
  | 'security'
  | 'utility';

export interface MCPToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: unknown;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

export interface MCPToolCall {
  toolId: string;
  parameters: Record<string, unknown>;
  sessionId: string;
  priority: 'low' | 'normal' | 'high';
  timeout: number;
}

export interface MCPToolResponse {
  success: boolean;
  result?: unknown;
  error?: MCPError;
  metadata: {
    executionTime: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      network: number;
    };
  };
}

// Session Management
export interface MCPSession {
  id: string;
  clientId: string;
  createdAt: number;
  lastActivity: number;
  status: MCPSessionStatus;
  configuration: MCPSessionConfig;
  resources: string[]; // Resource IDs
  permissions: MCPPermissions;
}

export type MCPSessionStatus = 
  | 'initializing'
  | 'active'
  | 'idle'
  | 'suspended'
  | 'terminated'
  | 'error';

export interface MCPSessionConfig {
  timeout: number;
  maxResources: number;
  allowedTools: string[];
  dataRetention: number; // hours
  compressionEnabled: boolean;
}

// AI Model Integration
export interface MCPModelInfo {
  id: string;
  name: string;
  version: string;
  type: MCPModelType;
  capabilities: string[];
  requirements: MCPModelRequirements;
  endpoint: string;
  status: MCPModelStatus;
}

export type MCPModelType = 
  | 'language_model'
  | 'vision_model'
  | 'audio_model'
  | 'multimodal'
  | 'embedding'
  | 'classification'
  | 'generation';

export interface MCPModelRequirements {
  minMemory: number; // MB
  minCPU: number; // cores
  gpuRequired: boolean;
  supportedFormats: string[];
}

export type MCPModelStatus = 
  | 'available'
  | 'loading'
  | 'busy'
  | 'error'
  | 'offline';

export interface MCPModelRequest {
  modelId: string;
  input: unknown;
  parameters?: Record<string, unknown>;
  sessionId: string;
  priority: 'low' | 'normal' | 'high';
}

export interface MCPModelResponse {
  output: unknown;
  confidence?: number;
  metadata: {
    processingTime: number;
    tokensUsed?: number;
    cost?: number;
  };
}

// Error Handling
export interface MCPError {
  code: string;
  message: string;
  details?: unknown;
  recoverable: boolean;
  timestamp: number;
}

// Events
export interface MCPEvent {
  type: string;
  data: unknown;
  timestamp: number;
  sessionId?: string;
  resourceId?: string;
}

// TODO: Add more MCP types as protocol evolves
// - AdvancedSecurity
// - DistributedComputing
// - EdgeComputing
// - FederatedLearning
