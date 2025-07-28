/**
 * MCP Integration Hook
 * Manages Model Context Protocol integration for AI features
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface MCPServer {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  capabilities: string[];
  lastPing?: number;
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  server: string;
}

interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  server: string;
}

interface MCPMessage {
  id: string;
  method: string;
  params?: any;
  result?: any;
  error?: { code: number; message: string; data?: any };
  timestamp: number;
}

interface UseMCPIntegrationProps {
  servers?: MCPServer[];
  autoConnect?: boolean;
  reconnectInterval?: number;
  onServerConnect?: (server: MCPServer) => void;
  onServerDisconnect?: (server: MCPServer) => void;
  onToolCall?: (tool: string, params: any, result: any) => void;
  onError?: (error: Error) => void;
}

interface UseMCPIntegrationReturn {
  servers: MCPServer[];
  connectedServers: MCPServer[];
  availableTools: MCPTool[];
  availableResources: MCPResource[];
  isConnecting: boolean;
  error: Error | null;
  connectServer: (server: MCPServer) => Promise<void>;
  disconnectServer: (serverId: string) => Promise<void>;
  callTool: (toolName: string, params: any, serverId?: string) => Promise<any>;
  getResource: (uri: string, serverId?: string) => Promise<any>;
  listTools: (serverId?: string) => Promise<MCPTool[]>;
  listResources: (serverId?: string) => Promise<MCPResource[]>;
  sendMessage: (message: Omit<MCPMessage, 'id' | 'timestamp'>, serverId: string) => Promise<any>;
}

export function useMCPIntegration({
  servers = [],
  autoConnect = true,
  reconnectInterval = 30000,
  onServerConnect,
  onServerDisconnect,
  onToolCall,
  onError
}: UseMCPIntegrationProps = {}): UseMCPIntegrationReturn {
  const [mcpServers, setMCPServers] = useState<MCPServer[]>(servers);
  const [availableTools, setAvailableTools] = useState<MCPTool[]>([]);
  const [availableResources, setAvailableResources] = useState<MCPResource[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connectionsRef = useRef<Map<string, WebSocket>>(new Map());
  const messageIdRef = useRef<number>(0);
  const pendingRequestsRef = useRef<Map<string, { resolve: Function; reject: Function }>>(new Map());

  // Generate unique message ID
  const generateMessageId = useCallback((): string => {
    return `msg_${++messageIdRef.current}_${Date.now()}`;
  }, []);

  // Send MCP message to server
  const sendMessage = useCallback(async (
    message: Omit<MCPMessage, 'id' | 'timestamp'>,
    serverId: string
  ): Promise<any> => {
    const connection = connectionsRef.current.get(serverId);
    if (!connection || connection.readyState !== WebSocket.OPEN) {
      throw new Error(`Server ${serverId} not connected`);
    }

    const messageId = generateMessageId();
    const fullMessage: MCPMessage = {
      ...message,
      id: messageId,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      // Store pending request
      pendingRequestsRef.current.set(messageId, { resolve, reject });

      // Set timeout for request
      setTimeout(() => {
        if (pendingRequestsRef.current.has(messageId)) {
          pendingRequestsRef.current.delete(messageId);
          reject(new Error('Request timeout'));
        }
      }, 30000);

      // Send message
      connection.send(JSON.stringify(fullMessage));
    });
  }, [generateMessageId]);

  // Handle incoming WebSocket message
  const handleMessage = useCallback((serverId: string, data: string) => {
    try {
      const message: MCPMessage = JSON.parse(data);
      
      // Handle response to pending request
      if (message.id && pendingRequestsRef.current.has(message.id)) {
        const { resolve, reject } = pendingRequestsRef.current.get(message.id)!;
        pendingRequestsRef.current.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }
        return;
      }

      // Handle server notifications
      if (message.method === 'tools/list') {
        // Update available tools
        setAvailableTools(prev => [
          ...prev.filter(tool => tool.server !== serverId),
          ...(message.result?.tools || []).map((tool: any) => ({
            ...tool,
            server: serverId
          }))
        ]);
      } else if (message.method === 'resources/list') {
        // Update available resources
        setAvailableResources(prev => [
          ...prev.filter(resource => resource.server !== serverId),
          ...(message.result?.resources || []).map((resource: any) => ({
            ...resource,
            server: serverId
          }))
        ]);
      }
    } catch (err) {
      console.error('Failed to parse MCP message:', err);
    }
  }, []);

  // Connect to MCP server
  const connectServer = useCallback(async (server: MCPServer): Promise<void> => {
    if (connectionsRef.current.has(server.id)) {
      return; // Already connected
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(server.url);
      
      ws.onopen = async () => {
        // Initialize MCP connection
        try {
          await sendMessage({
            method: 'initialize',
            params: {
              protocolVersion: '2024-11-05',
              clientInfo: {
                name: 'NextJS Video Player',
                version: '1.0.0'
              },
              capabilities: {
                roots: { listChanged: true },
                sampling: {}
              }
            }
          }, server.id);

          // Update server status
          setMCPServers(prev => prev.map(s => 
            s.id === server.id 
              ? { ...s, status: 'connected', lastPing: Date.now() }
              : s
          ));

          onServerConnect?.(server);

          // Request initial tools and resources
          listTools(server.id).catch(console.error);
          listResources(server.id).catch(console.error);
        } catch (err) {
          console.error('MCP initialization failed:', err);
          ws.close();
        }
      };

      ws.onmessage = (event) => {
        handleMessage(server.id, event.data);
      };

      ws.onclose = () => {
        connectionsRef.current.delete(server.id);
        setMCPServers(prev => prev.map(s => 
          s.id === server.id 
            ? { ...s, status: 'disconnected' }
            : s
        ));
        onServerDisconnect?.(server);
      };

      ws.onerror = (event) => {
        const error = new Error(`WebSocket error for server ${server.id}`);
        setError(error);
        onError?.(error);
        
        setMCPServers(prev => prev.map(s => 
          s.id === server.id 
            ? { ...s, status: 'error' }
            : s
        ));
      };

      connectionsRef.current.set(server.id, ws);
      
      setMCPServers(prev => prev.map(s => 
        s.id === server.id 
          ? { ...s, status: 'connecting' }
          : s
      ));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect to MCP server');
      setError(error);
      onError?.(error);
    } finally {
      setIsConnecting(false);
    }
  }, [sendMessage, handleMessage, onServerConnect, onServerDisconnect, onError]);

  // Disconnect from MCP server
  const disconnectServer = useCallback(async (serverId: string): Promise<void> => {
    const connection = connectionsRef.current.get(serverId);
    if (connection) {
      connection.close();
      connectionsRef.current.delete(serverId);
    }

    setMCPServers(prev => prev.map(s => 
      s.id === serverId 
        ? { ...s, status: 'disconnected' }
        : s
    ));

    // Remove tools and resources from this server
    setAvailableTools(prev => prev.filter(tool => tool.server !== serverId));
    setAvailableResources(prev => prev.filter(resource => resource.server !== serverId));
  }, []);

  // Call MCP tool
  const callTool = useCallback(async (
    toolName: string, 
    params: any, 
    serverId?: string
  ): Promise<any> => {
    // Find server that has this tool
    const tool = availableTools.find(t => 
      t.name === toolName && (serverId ? t.server === serverId : true)
    );
    
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    try {
      const result = await sendMessage({
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: params
        }
      }, tool.server);

      onToolCall?.(toolName, params, result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Tool call failed');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [availableTools, sendMessage, onToolCall, onError]);

  // Get MCP resource
  const getResource = useCallback(async (
    uri: string, 
    serverId?: string
  ): Promise<any> => {
    // Find server that has this resource
    const resource = availableResources.find(r => 
      r.uri === uri && (serverId ? r.server === serverId : true)
    );
    
    if (!resource) {
      throw new Error(`Resource ${uri} not found`);
    }

    return sendMessage({
      method: 'resources/read',
      params: { uri }
    }, resource.server);
  }, [availableResources, sendMessage]);

  // List available tools
  const listTools = useCallback(async (serverId?: string): Promise<MCPTool[]> => {
    const servers = serverId ? [serverId] : mcpServers.filter(s => s.status === 'connected').map(s => s.id);
    const allTools: MCPTool[] = [];

    for (const sid of servers) {
      try {
        const result = await sendMessage({
          method: 'tools/list'
        }, sid);
        
        const tools = (result?.tools || []).map((tool: any) => ({
          ...tool,
          server: sid
        }));
        
        allTools.push(...tools);
      } catch (err) {
        console.error(`Failed to list tools from server ${sid}:`, err);
      }
    }

    setAvailableTools(allTools);
    return allTools;
  }, [mcpServers, sendMessage]);

  // List available resources
  const listResources = useCallback(async (serverId?: string): Promise<MCPResource[]> => {
    const servers = serverId ? [serverId] : mcpServers.filter(s => s.status === 'connected').map(s => s.id);
    const allResources: MCPResource[] = [];

    for (const sid of servers) {
      try {
        const result = await sendMessage({
          method: 'resources/list'
        }, sid);
        
        const resources = (result?.resources || []).map((resource: any) => ({
          ...resource,
          server: sid
        }));
        
        allResources.push(...resources);
      } catch (err) {
        console.error(`Failed to list resources from server ${sid}:`, err);
      }
    }

    setAvailableResources(allResources);
    return allResources;
  }, [mcpServers, sendMessage]);

  // Auto-connect to servers
  useEffect(() => {
    if (autoConnect) {
      mcpServers.forEach(server => {
        if (server.status === 'disconnected') {
          connectServer(server).catch(console.error);
        }
      });
    }
  }, [autoConnect, mcpServers, connectServer]);

  // Set up reconnection interval
  useEffect(() => {
    const interval = setInterval(() => {
      mcpServers.forEach(server => {
        if (server.status === 'disconnected' && autoConnect) {
          connectServer(server).catch(console.error);
        }
      });
    }, reconnectInterval);

    return () => clearInterval(interval);
  }, [mcpServers, autoConnect, reconnectInterval, connectServer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      connectionsRef.current.forEach(ws => ws.close());
      connectionsRef.current.clear();
    };
  }, []);

  const connectedServers = mcpServers.filter(s => s.status === 'connected');

  return {
    servers: mcpServers,
    connectedServers,
    availableTools,
    availableResources,
    isConnecting,
    error,
    connectServer,
    disconnectServer,
    callTool,
    getResource,
    listTools,
    listResources,
    sendMessage
  };
}
