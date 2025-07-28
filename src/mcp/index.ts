/**
 * MCP Module Exports
 * Model Context Protocol integration exports
 */

// Core MCP Components
export { MCPServer } from './mcp-server';
export { ProtocolHandler } from './protocol-handler';
export { ResourceManager } from './resource-manager';
export { ToolRegistry } from './tool-registry';
export { SessionManager } from './session-manager';
export { SecurityManager } from './security-manager';
export { AIIntegration } from './ai-integration';

// Types re-export
export type * from '../types/mcp';

// TODO: Add additional MCP exports as features are developed
// export { DistributedMCP } from './distributed-mcp';
// export { EdgeMCP } from './edge-mcp';
// export { FederatedLearning } from './federated-learning';
