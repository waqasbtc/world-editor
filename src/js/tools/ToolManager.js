/**
 * ToolManager.js - Manages and coordinates all editor tools
 * 
 * This class is responsible for initializing tools, activating/deactivating them,
 * and directing input events to the currently active tool.
 */

class ToolManager {
  constructor(terrainBuilderProps) {
    // Validate that we have the minimal required properties
    if (!terrainBuilderProps.scene) {
      console.error('ToolManager initialized without scene property');
    }
    
    // Store reference to terrainBuilder properties for tools to use
    this.terrainBuilder = terrainBuilderProps;
    this.tools = {};
    this.activeTool = null;
    
    console.log('ToolManager initialized with properties:', 
      Object.keys(terrainBuilderProps).filter(key => terrainBuilderProps[key] !== undefined));
  }

  /**
   * Register a tool with the manager
   * @param {string} toolName - Unique identifier for the tool
   * @param {BaseTool} tool - Instance of a tool extending BaseTool
   */
  registerTool(toolName, tool) {
    if (!toolName || typeof toolName !== 'string') {
      console.error('Invalid tool name provided to registerTool:', toolName);
      return;
    }
    
    if (!tool || typeof tool.onActivate !== 'function') {
      console.error('Invalid tool object provided to registerTool:', tool);
      return;
    }
    
    this.tools[toolName] = tool;
    console.log(`Registered tool: ${toolName}`);
  }

  /**
   * Activate a specific tool by name
   * @param {string} toolName - Name of the tool to activate
   */
  activateTool(toolName) {
    // Deactivate current tool if there is one
    if (this.activeTool) {
      this.activeTool.onDeactivate();
    }

    // If toolName is null or undefined, just deactivate the current tool
    if (!toolName) {
      this.activeTool = null;
      console.log('All tools deactivated');
      return true;
    }

    // Activate the new tool
    if (this.tools[toolName]) {
      this.activeTool = this.tools[toolName];
      this.activeTool.onActivate();
      console.log(`Activated tool: ${toolName}`);
      return true;
    } else {
      console.warn(`Tool not found: ${toolName}`);
      this.activeTool = null;
      return false;
    }
  }

  /**
   * Get the currently active tool
   * @returns {BaseTool|null} The active tool or null if none is active
   */
  getActiveTool() {
    return this.activeTool;
  }

  /**
   * Handle mouse down events by forwarding to the active tool
   */
  handleMouseDown(event, position, button) {
    if (this.activeTool) {
      this.activeTool.handleMouseDown(event, position, button);
    }
  }

  /**
   * Handle mouse move events by forwarding to the active tool
   */
  handleMouseMove(event, position) {
    if (this.activeTool) {
      this.activeTool.handleMouseMove(event, position);
    }
  }

  /**
   * Handle mouse up events by forwarding to the active tool
   */
  handleMouseUp(event, position) {
    if (this.activeTool) {
      this.activeTool.handleMouseUp(event, position);
    }
  }

  /**
   * Handle key down events by forwarding to the active tool
   */
  handleKeyDown(event) {
    if (this.activeTool) {
      this.activeTool.handleKeyDown(event);
    }
  }

  /**
   * Handle key up events by forwarding to the active tool
   */
  handleKeyUp(event) {
    if (this.activeTool) {
      this.activeTool.handleKeyUp(event);
    }
  }

  /**
   * Update the active tool
   */
  update() {
    if (this.activeTool) {
      this.activeTool.update();
    }
  }

  /**
   * Clean up all tools when no longer needed
   */
  dispose() {
    Object.values(this.tools).forEach(tool => {
      if (typeof tool.dispose === 'function') {
        tool.dispose();
      }
    });
    
    this.tools = {};
    this.activeTool = null;
  }
}

export default ToolManager; 