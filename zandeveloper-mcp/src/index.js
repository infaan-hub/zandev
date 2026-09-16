#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  apiUrl: process.env.ZANDEV_API_URL || "https://zandev.onrender.com/api",
  apiKey: process.env.ZANDEV_API_KEY || "",
  storagePath: process.env.ZANDEV_STORAGE_PATH || path.join(__dirname, "../storage"),
  wsUrl: process.env.ZANDEV_WS_URL || "ws://localhost:3001",
  debug: process.env.ZANDEV_DEBUG === "true"
};

// Ensure storage directory exists
await fs.mkdir(CONFIG.storagePath, { recursive: true });

// Create MCP Server
const server = new McpServer({
  name: "zandeveloper-mcp",
  version: "1.0.0",
  description: "MCP server for Zandeveloper Design-to-Code platform"
});

// Helper: API Request
async function apiRequest(endpoint, options = {}) {
  const url = `${CONFIG.apiUrl}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(CONFIG.apiKey && { "Authorization": `Token ${CONFIG.apiKey}` }),
    ...options.headers
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper: Local Storage
async function localGet(key) {
  const filePath = path.join(CONFIG.storagePath, `${key}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function localSet(key, value) {
  const filePath = path.join(CONFIG.storagePath, `${key}.json`);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
  return true;
}

async function localDelete(key) {
  const filePath = path.join(CONFIG.storagePath, `${key}.json`);
  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

// ==================== SYSTEM TOOLS ====================

server.tool(
  "zandev_system_info",
  "Get Zandeveloper system information and status",
  {},
  async () => {
    const result = await apiRequest("/health/");
    const localData = await localGet("system_config");
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          system: "Zandeveloper Design-to-Code Platform",
          version: "1.0.0",
          api: {
            url: CONFIG.apiUrl,
            connected: result.success,
            status: result.data
          },
          local: localData || { configured: false },
          features: [
            "Layout posting",
            "Design management",
            "Code export",
            "MCP integration",
            "Real-time sync"
          ]
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_connect",
  "Connect to Zandeveloper system with API key",
  {
    apiKey: z.string().describe("Your Zandeveloper API key"),
    apiUrl: z.string().optional().describe("Custom API URL (optional)")
  },
  async ({ apiKey, apiUrl }) => {
    if (apiUrl) CONFIG.apiUrl = apiUrl;
    CONFIG.apiKey = apiKey;
    
    const result = await apiRequest("/designs/?limit=1");
    
    if (result.success) {
      await localSet("system_config", {
        apiKey: apiKey.slice(0, 8) + "...",
        apiUrl: CONFIG.apiUrl,
        connectedAt: new Date().toISOString()
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: "Connected to Zandeveloper system",
            apiStatus: "active",
            designsAvailable: result.data.count || 0
          }, null, 2)
        }]
      };
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          message: "Failed to connect",
          error: result.error
        }, null, 2)
      }]
    };
  }
);

// ==================== LAYOUT TOOLS ====================

server.tool(
  "zandev_post_layout",
  "Post a new layout/design to Zandeveloper platform",
  {
    name: z.string().describe("Layout name"),
    category: z.string().describe("Category (Landing, Dashboard, Auth, etc.)"),
    framework: z.string().describe("Framework (React, Vue, Svelte, etc.)"),
    htmlCode: z.string().describe("HTML code for the layout"),
    cssCode: z.string().optional().describe("CSS code for the layout"),
    jsCode: z.string().optional().describe("JavaScript code for the layout"),
    description: z.string().optional().describe("Layout description"),
    previewImage: z.string().optional().describe("Preview image URL"),
    price: z.string().default("Free").describe("Price (Free or custom)")
  },
  async ({ name, category, framework, htmlCode, cssCode, jsCode, description, previewImage, price }) => {
    const layoutData = {
      id: uuidv4(),
      name,
      category,
      framework,
      html_code: htmlCode,
      css_code: cssCode || "",
      js_code: jsCode || "",
      description: description || "",
      preview_image: previewImage || "",
      price,
      code: htmlCode,
      created_at: new Date().toISOString()
    };
    
    // Save locally
    await localSet(`layout_${layoutData.id}`, layoutData);
    
    // Post to API if connected
    if (CONFIG.apiKey) {
      const result = await apiRequest("/designs/", {
        method: "POST",
        body: JSON.stringify({
          name,
          category,
          framework,
          html_code: htmlCode,
          css_code: cssCode || "",
          js_code: jsCode || "",
          description: description || "",
          preview_image: previewImage || "",
          price,
          code: htmlCode
        })
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            layout: {
              id: layoutData.id,
              name,
              category,
              framework,
              postedTo: result.success ? "Zandeveloper API" : "local only",
              apiResult: result.success ? result.data : result.error
            }
          }, null, 2)
        }]
      };
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          layout: {
            id: layoutData.id,
            name,
            category,
            framework,
            postedTo: "local storage",
            message: "Connect to API to sync with Zandeveloper platform"
          }
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_get_design",
  "Get a specific design via MCP endpoint with full code",
  {
    designId: z.string().describe("Design ID to retrieve"),
    framework: z.string().optional().default("html").describe("Target framework (react, vue, svelte, astro, html)")
  },
  async ({ designId, framework }) => {
    // Try MCP endpoint first
    const mcpResult = await apiRequest(`/designs/${designId}/mcp/?framework=${framework}`);
    
    if (mcpResult.success) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            design: mcpResult.data.design,
            code: mcpResult.data.code,
            mcp: mcpResult.data.mcp,
            message: `Design retrieved via MCP. Use the generated code or run the MCP command to fetch again.`
          }, null, 2)
        }]
      };
    }
    
    // Fallback to regular endpoint
    const result = await apiRequest(`/designs/${designId}/`);
    
    if (result.success) {
      const design = result.data;
      const generatedCode = generateCode(design, framework);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            design: {
              id: design.id,
              name: design.name,
              category: design.category,
              framework: design.framework,
              description: design.description
            },
            code: {
              html: design.html_code,
              css: design.css_code,
              js: design.js_code,
              generated: generatedCode,
              framework: framework
            },
            mcp: {
              command: `npx zandeveloper-mcp --get ${designId}`,
              export_command: `npx zandeveloper-mcp --export ${designId} --format ${framework}`
            }
          }, null, 2)
        }]
      };
    }
    
    // Fallback to local storage
    const local = await localGet(`layout_${designId}`);
    if (local) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            design: local,
            code: {
              html: local.html_code,
              css: local.css_code,
              js: local.js_code,
              generated: generateCode(local, framework),
              framework: framework
            },
            source: "local"
          }, null, 2)
        }]
      };
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          message: `Design ${designId} not found`
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_get_layouts",
  "Get layouts from Zandeveloper platform",
  {
    category: z.string().optional().describe("Filter by category"),
    framework: z.string().optional().describe("Filter by framework"),
    limit: z.number().optional().default(20).describe("Number of results"),
    offset: z.number().optional().default(0).describe("Offset for pagination")
  },
  async ({ category, framework, limit, offset }) => {
    let endpoint = `/designs/?limit=${limit}&offset=${offset}`;
    if (category) endpoint += `&category=${category}`;
    if (framework) endpoint += `&framework=${framework}`;
    
    const result = await apiRequest(endpoint);
    
    if (result.success) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            layouts: result.data.results || result.data,
            count: result.data.count || 0,
            hasMore: result.data.next !== null
          }, null, 2)
        }]
      };
    }
    
    // Fallback to local storage
    const files = await fs.readdir(CONFIG.storagePath);
    const layouts = [];
    
    for (const file of files) {
      if (file.startsWith("layout_")) {
        const data = await localGet(file.replace(".json", ""));
        if (data) {
          if (category && data.category !== category) continue;
          if (framework && data.framework !== framework) continue;
          layouts.push(data);
        }
      }
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          layouts: layouts.slice(offset, offset + limit),
          count: layouts.length,
          source: "local"
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_update_layout",
  "Update an existing layout",
  {
    layoutId: z.string().describe("Layout ID to update"),
    name: z.string().optional().describe("New name"),
    category: z.string().optional().describe("New category"),
    framework: z.string().optional().describe("New framework"),
    htmlCode: z.string().optional().describe("New HTML code"),
    cssCode: z.string().optional().describe("New CSS code"),
    jsCode: z.string().optional().describe("New JavaScript code"),
    description: z.string().optional().describe("New description")
  },
  async ({ layoutId, ...updates }) => {
    const existing = await localGet(`layout_${layoutId}`);
    
    if (!existing && !CONFIG.apiKey) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            message: "Layout not found"
          }, null, 2)
        }]
      };
    }
    
    const updatedData = { ...existing, ...updates, updated_at: new Date().toISOString() };
    await localSet(`layout_${layoutId}`, updatedData);
    
    if (CONFIG.apiKey) {
      await apiRequest(`/designs/${layoutId}/`, {
        method: "PATCH",
        body: JSON.stringify(updates)
      });
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          layout: updatedData
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_delete_layout",
  "Delete a layout from the platform",
  {
    layoutId: z.string().describe("Layout ID to delete")
  },
  async ({ layoutId }) => {
    await localDelete(`layout_${layoutId}`);
    
    if (CONFIG.apiKey) {
      await apiRequest(`/designs/${layoutId}/`, { method: "DELETE" });
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: `Layout ${layoutId} deleted`
        }, null, 2)
      }]
    };
  }
);

// ==================== CODE EXPORT TOOLS ====================

server.tool(
  "zandev_export_layout",
  "Export a layout as framework-specific code",
  {
    layoutId: z.string().describe("Layout ID to export"),
    framework: z.string().describe("Target framework (React, Vue, Svelte, Astro)"),
    format: z.enum(["component", "full", "minimal"]).default("component").describe("Export format")
  },
  async ({ layoutId, framework, format }) => {
    const layout = await localGet(`layout_${layoutId}`);
    
    if (!layout) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            message: "Layout not found locally. Fetching from API..."
          }, null, 2)
        }]
      };
    }
    
    let exportedCode = "";
    
    switch (framework.toLowerCase()) {
      case "react":
        exportedCode = generateReactComponent(layout, format);
        break;
      case "vue":
        exportedCode = generateVueComponent(layout, format);
        break;
      case "svelte":
        exportedCode = generateSvelteComponent(layout, format);
        break;
      case "astro":
        exportedCode = generateAstroComponent(layout, format);
        break;
      default:
        exportedCode = generateHTMLComponent(layout, format);
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          framework,
          format,
          code: exportedCode,
          fileName: `${layout.name.toLowerCase().replace(/\s+/g, '-')}.${getExtension(framework)}`
        }, null, 2)
      }]
    };
  }
);

// ==================== MCP BRIDGE TOOLS ====================

server.tool(
  "zandev_mcp_list",
  "List available MCP servers and their tools",
  {},
  async () => {
    const mcpServers = await localGet("mcp_servers") || {};
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          servers: {
            "zandeveloper-mcp": {
              status: "active",
              tools: [
                "zandev_system_info",
                "zandev_connect",
                "zandev_post_layout",
                "zandev_get_layouts",
                "zandev_update_layout",
                "zandev_delete_layout",
                "zandev_export_layout",
                "zandev_mcp_register",
                "zandev_mcp_call",
                "zandev_mcp_bridge",
                "zandev_sync_layouts",
                "zandev_search Designs",
                "zandev_get_categories",
                "zandev_create_collection",
                "zandev_add_to_collection"
              ]
            },
            ...mcpServers
          }
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_mcp_register",
  "Register another MCP server for cross-communication",
  {
    name: z.string().describe("MCP server name"),
    endpoint: z.string().describe("MCP server endpoint or command"),
    type: z.enum(["stdio", "http", "websocket"]).default("stdio").describe("Connection type"),
    tools: z.array(z.string()).optional().describe("Available tools from this server")
  },
  async ({ name, endpoint, type, tools }) => {
    const servers = await localGet("mcp_servers") || {};
    
    servers[name] = {
      endpoint,
      type,
      tools: tools || [],
      registeredAt: new Date().toISOString(),
      status: "registered"
    };
    
    await localSet("mcp_servers", servers);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: `MCP server '${name}' registered`,
          server: servers[name]
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_mcp_call",
  "Call a tool from another registered MCP server",
  {
    serverName: z.string().describe("Target MCP server name"),
    toolName: z.string().describe("Tool name to call"),
    params: z.record(z.any()).optional().default({}).describe("Tool parameters")
  },
  async ({ serverName, toolName, params }) => {
    const servers = await localGet("mcp_servers") || {};
    const targetServer = servers[serverName];
    
    if (!targetServer) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            message: `MCP server '${serverName}' not found. Register it first.`,
            availableServers: Object.keys(servers)
          }, null, 2)
        }]
      };
    }
    
    // Log the call
    const callLog = await localGet("mcp_calls") || [];
    callLog.push({
      id: uuidv4(),
      server: serverName,
      tool: toolName,
      params,
      timestamp: new Date().toISOString()
    });
    await localSet("mcp_calls", callLog.slice(-100));
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: `Tool call dispatched to '${serverName}'`,
          call: {
            server: serverName,
            tool: toolName,
            params,
            status: "dispatched"
          },
          note: "Actual execution depends on MCP server transport configuration"
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_mcp_bridge",
  "Bridge layouts between Zandeveloper and other MCP servers",
  {
    sourceServer: z.string().describe("Source MCP server name"),
    targetServer: z.string().describe("Target MCP server name"),
    layoutId: z.string().describe("Layout ID to bridge"),
    transform: z.boolean().default(true).describe("Auto-transform for target framework")
  },
  async ({ sourceServer, targetServer, layoutId, transform }) => {
    const servers = await localGet("mcp_servers") || {};
    
    if (!servers[sourceServer] || !servers[targetServer]) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            message: "Both source and target MCP servers must be registered",
            registered: Object.keys(servers)
          }, null, 2)
        }]
      };
    }
    
    const bridgeLog = await localGet("mcp_bridges") || [];
    bridgeLog.push({
      id: uuidv4(),
      sourceServer,
      targetServer,
      layoutId,
      transform,
      timestamp: new Date().toISOString()
    });
    await localSet("mcp_bridges", bridgeLog);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          bridge: {
            source: sourceServer,
            target: targetServer,
            layoutId,
            transform,
            status: "bridged"
          }
        }, null, 2)
      }]
    };
  }
);

// ==================== SYNC TOOLS ====================

server.tool(
  "zandev_sync_layouts",
  "Sync layouts between local storage and Zandeveloper API",
  {
    direction: z.enum(["push", "pull", "bidirectional"]).default("bidirectional").describe("Sync direction"),
    category: z.string().optional().describe("Filter by category")
  },
  async ({ direction, category }) => {
    const results = { pushed: 0, pulled: 0, errors: [] };
    
    if (direction === "pull" || direction === "bidirectional") {
      const apiResult = await apiRequest(`/designs/?limit=100${category ? `&category=${category}` : ""}`);
      
      if (apiResult.success && apiResult.data.results) {
        for (const design of apiResult.data.results) {
          await localSet(`layout_${design.id}`, design);
          results.pulled++;
        }
      }
    }
    
    if (direction === "push" || direction === "bidirectional") {
      const files = await fs.readdir(CONFIG.storagePath);
      
      for (const file of files) {
        if (file.startsWith("layout_")) {
          const layout = await localGet(file.replace(".json", ""));
          if (layout && !layout.synced) {
            const result = await apiRequest("/designs/", {
              method: "POST",
              body: JSON.stringify(layout)
            });
            
            if (result.success) {
              layout.synced = true;
              await localSet(`layout_${layout.id}`, layout);
              results.pushed++;
            } else {
              results.errors.push({ id: layout.id, error: result.error });
            }
          }
        }
      }
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          sync: {
            direction,
            ...results
          }
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_search_designs",
  "Search designs on Zandeveloper platform",
  {
    query: z.string().describe("Search query"),
    category: z.string().optional().describe("Filter by category"),
    framework: z.string().optional().describe("Filter by framework"),
    limit: z.number().optional().default(10).describe("Number of results")
  },
  async ({ query, category, framework, limit }) => {
    let endpoint = `/designs/?search=${encodeURIComponent(query)}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (framework) endpoint += `&framework=${framework}`;
    
    const result = await apiRequest(endpoint);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          query,
          results: result.success ? (result.data.results || result.data) : [],
          count: result.success ? (result.data.count || 0) : 0
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_get_categories",
  "Get all design categories",
  {},
  async () => {
    const result = await apiRequest("/categories/");
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          categories: result.success ? result.data : [
            "Landing", "Dashboard", "Auth", "E-commerce",
            "Blog", "Portfolio", "SaaS", "Mobile"
          ]
        }, null, 2)
      }]
    };
  }
);

// ==================== COLLECTION TOOLS ====================

server.tool(
  "zandev_create_collection",
  "Create a new design collection",
  {
    name: z.string().describe("Collection name"),
    description: z.string().optional().describe("Collection description"),
    isPublic: z.boolean().default(false).describe("Make collection public")
  },
  async ({ name, description, isPublic }) => {
    const collection = {
      id: uuidv4(),
      name,
      description: description || "",
      is_public: isPublic,
      designs: [],
      created_at: new Date().toISOString()
    };
    
    await localSet(`collection_${collection.id}`, collection);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          collection
        }, null, 2)
      }]
    };
  }
);

server.tool(
  "zandev_add_to_collection",
  "Add a layout to a collection",
  {
    collectionId: z.string().describe("Collection ID"),
    layoutId: z.string().describe("Layout ID to add")
  },
  async ({ collectionId, layoutId }) => {
    const collection = await localGet(`collection_${collectionId}`);
    
    if (!collection) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: false,
            message: "Collection not found"
          }, null, 2)
        }]
      };
    }
    
    if (!collection.designs.includes(layoutId)) {
      collection.designs.push(layoutId);
      collection.updated_at = new Date().toISOString();
      await localSet(`collection_${collectionId}`, collection);
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          collection: {
            id: collectionId,
            name: collection.name,
            designCount: collection.designs.length,
            added: layoutId
          }
        }, null, 2)
      }]
    };
  }
);

// ==================== HELPER FUNCTIONS ====================

function generateCode(design, framework) {
  switch (framework.toLowerCase()) {
    case "react":
      return generateReactComponent(design);
    case "vue":
      return generateVueComponent(design);
    case "svelte":
      return generateSvelteComponent(design);
    case "astro":
      return generateAstroComponent(design);
    case "html":
    default:
      return generateHTMLComponent(design);
  }
}

function generateReactComponent(layout, format) {
  const componentName = layout.name.replace(/[^a-zA-Z0-9]/g, "");
  
  if (format === "minimal") {
    return `export default function ${componentName}() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${layout.html_code.replace(/`/g, "\\`")}\` }} />
  );
}`;
  }
  
  return `import React from 'react';

${layout.css_code ? `<style>{\`${layout.css_code}\`}</style>` : ""}

export default function ${componentName}() {
  return (
    <>
      ${layout.html_code}
    </>
  );
}`;
}

function generateVueComponent(layout, format) {
  const componentName = layout.name.replace(/[^a-zA-Z0-9]/g, "");
  
  return `<template>
  ${layout.html_code}
</template>

${layout.js_code ? `<script>
${layout.js_code}
</script>` : ""}

${layout.css_code ? `<style scoped>
${layout.css_code}
</style>` : ""}`;
}

function generateSvelteComponent(layout, format) {
  return `${layout.js_code ? `<script>
${layout.js_code}
</script>` : ""}

${layout.html_code}

${layout.css_code ? `<style>
${layout.css_code}
</style>` : ""}`;
}

function generateAstroComponent(layout, format) {
  return `---
// ${layout.name}
---

${layout.html_code}

${layout.css_code ? `<style>
${layout.css_code}
</style>` : ""}`;
}

function generateHTMLComponent(layout, format) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${layout.name}</title>
  ${layout.css_code ? `<style>${layout.css_code}</style>` : ""}
</head>
<body>
  ${layout.html_code}
  ${layout.js_code ? `<script>${layout.js_code}</script>` : ""}
</body>
</html>`;
}

function getExtension(framework) {
  const extensions = {
    react: "jsx",
    vue: "vue",
    svelte: "svelte",
    astro: "astro",
    html: "html"
  };
  return extensions[framework.toLowerCase()] || "jsx";
}

// Start Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Zandeveloper MCP Server running on stdio");
}

main().catch(console.error);
