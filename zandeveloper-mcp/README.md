# Zandeveloper MCP Server

A Model Context Protocol (MCP) server for the Zandeveloper Design-to-Code platform. Post layouts, connect systems, and integrate with other MCP servers.

## Features

- **Layout Management**: Post, update, delete, and search UI layouts
- **Code Export**: Export layouts to React, Vue, Svelte, Astro, or plain HTML
- **System Connection**: Connect to Zandeveloper API with your API key
- **MCP Bridge**: Register and communicate with other MCP servers
- **Sync**: Bidirectional sync between local storage and Zandeveloper API
- **Collections**: Create and manage design collections

## Installation

```bash
npm install zandeveloper-mcp
```

Or use directly with npx:

```bash
npx zandeveloper-mcp
```

## Quick Start

### 1. Configure Environment

Create a `.env` file:

```env
ZANDEV_API_URL=https://zandev.onrender.com/api
ZANDEV_API_KEY=your_api_key_here
ZANDEV_STORAGE_PATH=./storage
ZANDEV_DEBUG=true
```

### 2. Run the Server

```bash
# Using npm
npm start

# Using npx
npx zandeveloper-mcp

# With environment variables
ZANDEV_API_KEY=your_key npx zandeveloper-mcp
```

### 3. Configure in opencode.json

Add to your `opencode.json`:

```json
{
  "mcp": {
    "servers": {
      "zandeveloper": {
        "command": "npx",
        "args": ["-y", "zandeveloper-mcp"],
        "env": {
          "ZANDEV_API_KEY": "your_api_key"
        }
      }
    }
  }
}
```

## Available Tools

### System Tools

| Tool | Description |
|------|-------------|
| `zandev_system_info` | Get system information and status |
| `zandev_connect` | Connect to Zandeveloper with API key |

### Layout Tools

| Tool | Description |
|------|-------------|
| `zandev_post_layout` | Post a new layout to the platform |
| `zandev_get_layouts` | Get layouts with filtering |
| `zandev_update_layout` | Update an existing layout |
| `zandev_delete_layout` | Delete a layout |
| `zandev_export_layout` | Export layout as framework code |

### MCP Bridge Tools

| Tool | Description |
|------|-------------|
| `zandev_mcp_list` | List available MCP servers |
| `zandev_mcp_register` | Register another MCP server |
| `zandev_mcp_call` | Call a tool from another MCP |
| `zandev_mcp_bridge` | Bridge layouts between MCPs |

### Sync Tools

| Tool | Description |
|------|-------------|
| `zandev_sync_layouts` | Sync local ↔ API |
| `zandev_search_designs` | Search designs |
| `zandev_get_categories` | Get design categories |

### Collection Tools

| Tool | Description |
|------|-------------|
| `zandev_create_collection` | Create a collection |
| `zandev_add_to_collection` | Add layout to collection |

## Usage Examples

### Post a Layout

```javascript
// Via MCP tool call
zandev_post_layout({
  name: "Modern Pricing Card",
  category: "Landing",
  framework: "React",
  htmlCode: `<div class="pricing-card">...</div>`,
  cssCode: `.pricing-card { ... }`,
  description: "A clean pricing card component"
})
```

### Export to React

```javascript
zandev_export_layout({
  layoutId: "abc-123",
  framework: "React",
  format: "component"
})
```

### Register Another MCP

```javascript
zandev_mcp_register({
  name: "shadcn-ui",
  endpoint: "npx -y @anthropic-ai/mcp-shadcn-ui",
  type: "stdio",
  tools: ["generate", "theme"]
})
```

### Bridge Layouts Between MCPs

```javascript
zandev_mcp_bridge({
  sourceServer: "zandeveloper",
  targetServer: "shadcn-ui",
  layoutId: "abc-123",
  transform: true
})
```

## MCP Integration Guide

### Connecting with shadcn-ui MCP

```bash
# Register shadcn-ui MCP
zandev_mcp_register({
  name: "shadcn-ui",
  endpoint: "npx -y @anthropic-ai/mcp-shadcn-ui",
  type: "stdio"
})

# Generate component from layout
zandev_mcp_call({
  serverName: "shadcn-ui",
  toolName: "generate",
  params: { description: "Pricing card" }
})
```

### Connecting with Radix UI MCP

```bash
# Register Radix UI MCP
zandev_mcp_register({
  name: "radix-ui",
  endpoint: "npx -y @anthropic-ai/mcp-radix-ui",
  type: "stdio"
})

# Get accessible component
zandev_mcp_call({
  serverName: "radix-ui",
  toolName: "generate",
  params: { component: "dialog", accessible: true }
})
```

## Local Storage

Layouts are stored locally in the `storage` directory:

```
storage/
├── layout_abc-123.json
├── layout_def-456.json
├── collection_xyz-789.json
├── mcp_servers.json
├── mcp_calls.json
├── system_config.json
└── ...
```

## API Reference

### Zandeveloper API

- Base URL: `https://zandev.onrender.com/api`
- Authentication: Token-based
- Endpoints:
  - `GET /designs/` - List designs
  - `POST /designs/` - Create design
  - `GET /designs/:id/` - Get design
  - `PATCH /designs/:id/` - Update design
  - `DELETE /designs/:id/` - Delete design
  - `GET /categories/` - List categories
  - `GET /health/` - Health check

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ZANDEV_API_URL` | Zandeveloper API URL | `https://zandev.onrender.com/api` |
| `ZANDEV_API_KEY` | Your API key | - |
| `ZANDEV_STORAGE_PATH` | Local storage path | `./storage` |
| `ZANDEV_WS_URL` | WebSocket URL | `ws://localhost:3001` |
| `ZANDEV_DEBUG` | Enable debug mode | `false` |

## Development

```bash
# Clone the repo
git clone https://github.com/zandeveloper/zandeveloper-mcp.git

# Install dependencies
npm install

# Run in dev mode
npm run dev

# Run tests
npm test
```

## License

MIT
