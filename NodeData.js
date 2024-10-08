// NodeData.js

class NodeData {
  constructor({
    uniq_id = '',
    ext = {},
    nexts = [],
    type = 'START',
    name = '',
    description = '',
    tool = '',
    true_next = null,
    false_next = null,
  }) {
    this.uniq_id = uniq_id;

    // Extract external properties from ext
    this.ext = ext;
    this.pos_x = ext.pos_x || 0;
    this.pos_y = ext.pos_y || 0;
    this.width = ext.width || 200;
    this.height = ext.height || 200;
    this.info = ext.info || '';

    this.nexts = nexts;
    this.type = type;
    this.name = name;
    this.description = description;
    this.tool = tool;
    this.true_next = true_next;
    this.false_next = false_next;
  }

  static fromReactFlowNode(node) {
    return new NodeData({
      uniq_id: node.id,
      ext: {
        pos_x: node.position.x,
        pos_y: node.position.y,
        width: node.width || node.data.width || 200,
        height: node.height || node.data.height || 200,
        info: node.data.info || '',
      },
      nexts: node.data.nexts || [],
      type: node.data.type || 'STEP',
      name: node.data.name,
      description: node.data.description || '',
      tool: node.data.tool || '',
      true_next: node.data.true_next || null,
      false_next: node.data.false_next || null,
    });
  }

  static fromDict(data) {
    return new NodeData(data);
  }

  toReactFlowNode() {
    return {
      id: this.uniq_id,
      type: 'textUpdater',
      data: {
        name: this.name,
        description: this.description,
        nexts: this.nexts,
        type: this.type,
        tool: this.tool,
        true_next: this.true_next,
        false_next: this.false_next,

        width: this.ext.width,
        height: this.ext.height,
        info: this.ext.info,  // Add this line to transfer the info field
      },
      position: { x: this.ext.pos_x, y: this.ext.pos_y },
    };
  }

  toDict() {
    const {
      uniq_id, nexts, type, name, description,
      tool, true_next, false_next,
    } = this;

    return {
      uniq_id,
      ext: {
        pos_x: this.ext.pos_x,
        pos_y: this.ext.pos_y,
        width: this.ext.width,
        height: this.ext.height,
        info: this.ext.info,
      },
      nexts,
      type,
      name,
      description,
      tool,
      true_next,
      false_next,
    };
  }
}

export default NodeData;
