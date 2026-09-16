# UI MCP Servers Configuration

## Overview

Zandeveloper integrates 10 UI MCP (Model Context Protocol) servers for advanced UI component generation, theming, and design system management.

## MCP Servers

### 1. shadcn/ui MCP
- **Purpose**: Generate and manage shadcn/ui components
- **Command**: `npx -y @anthropic-ai/mcp-shadcn-ui@latest`
- **Features**:
  - Auto-generate components from descriptions
  - Theme customization
  - Component previews
  - Code export

### 2. Radix UI MCP
- **Purpose**: Accessible UI primitives
- **Command**: `npx -y @anthropic-ai/mcp-radix-ui@latest`
- **Features**:
  - Accessible component generation
  - ARIA attribute management
  - Keyboard navigation
  - Screen reader support

### 3. Headless UI MCP
- **Purpose**: Unstyled Tailwind components
- **Command**: `npx -y @anthropic-ai/mcp-headless-ui@latest`
- **Features**:
  - Headless component patterns
  - Tailwind integration
  - Transition animations
  - Form element builders

### 4. Ark UI MCP
- **Purpose**: State machine UI components
- **Command**: `npx -y @anthropic-ai/mcp-ark-ui@latest`
- **Features**:
  - State machine patterns
  - Complex UI logic
  - Multi-framework support
  - Animation states

### 5. Mantine MCP
- **Purpose**: Full-featured React components
- **Command**: `npx -y @anthropic-ai/mcp-mantine@latest`
- **Features**:
  - Rich component library
  - Hook utilities
  - Form management
  - Theme system

### 6. Chakra UI MCP
- **Purpose**: Accessible React components
- **Command**: `npx -y @anthropic-ai/mcp-chakra-ui@latest`
- **Features**:
  - Style props
  - Responsive utilities
  - Color mode support
  - Layout components

### 7. Park UI MCP
- **Purpose**: Ark UI + Tailwind components
- **Command**: `npx -y @anthropic-ai/mcp-park-ui@latest`
- **Features**:
  - Modern component designs
  - Tailwind-first approach
  - Ark UI integration
  - Customizable themes

### 8. Kibo UI MCP
- **Purpose**: Extended shadcn components
- **Command**: `npx -y @anthropic-ai/mcp-kibo-ui@latest`
- **Features**:
  - Advanced data tables
  - Command palettes
  - Multi-select components
  - Date pickers

### 9. Logic UI MCP
- **Purpose**: Logic-driven components
- **Command**: `npx -y @anthropic-ai/mcp-logic-ui@latest`
- **Features**:
  - Conditional rendering
  - Data flow patterns
  - State management
  - API integration

### 10. XY Flow MCP
- **Purpose**: Node-based UI components
- **Command**: `npx -y @anthropic-ai/mcp-xyflow@latest`
- **Features**:
  - Flow diagrams
  - Node editors
  - Graph visualizations
  - Drag-and-drop interfaces

## Usage

### Generating Components

```bash
# Using shadcn/ui MCP
opencode mcp shadcn-ui generate "A modern pricing card with toggle"

# Using Radix UI MCP
opencode mcp radix-ui generate "Accessible dropdown menu"
```

### Theming

```bash
# Generate theme from brand colors
opencode mcp shadcn-ui theme --primary="#3b82f6" --secondary="#10b981"

# Export theme configuration
opencode mcp theme export --format=css
```

### Accessibility Testing

```bash
# Test component accessibility
opencode mcp accessibility test src/components/ui/button.jsx

# Generate ARIA attributes
opencode mcp radix-ui aria --component="dialog"
```

## Integration with Zandeveloper

The MCP servers integrate with the Zandeveloper platform to:

1. **Generate Components**: Create new UI components from descriptions
2. **Manage Themes**: Customize and export design tokens
3. **Ensure Accessibility**: Validate WCAG compliance
4. **Export Code**: Generate framework-specific implementations
5. **Preview Components**: Live preview before export

## Configuration

MCP servers are configured in `opencode.json`:

```json
{
  "mcp": {
    "servers": {
      "shadcn-ui": {
        "command": "npx",
        "args": ["-y", "@anthropic-ai/mcp-shadcn-ui@latest"],
        "env": {
          "SHADCN_DIR": "src/components/ui"
        }
      }
    }
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| SHADCN_DIR | shadcn components directory | src/components/ui |
| RADIX_DIR | Radix components directory | src/components/radix |
| HEADLESS_DIR | Headless UI directory | src/components/headless |
| ARK_DIR | Ark UI directory | src/components/ark |
| MANTINE_DIR | Mantine directory | src/components/mantine |
| CHAKRA_DIR | Chakra UI directory | src/components/chakra |
| PARK_DIR | Park UI directory | src/components/park |
| KIBO_DIR | Kibo UI directory | src/components/kibo |
| LOGIC_DIR | Logic UI directory | src/components/logic |
| XYFLOW_DIR | XY Flow directory | src/components/xyflow |

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Headless UI Documentation](https://headlessui.com)
- [Ark UI Documentation](https://ark-ui.com)
- [Mantine Documentation](https://mantine.dev)
- [Chakra UI Documentation](https://chakra-ui.com)
- [Park UI Documentation](https://park-ui.com)
- [Kibo UI Documentation](https://kibo-ui.com)
- [XY Flow Documentation](https://xyflow.com)
