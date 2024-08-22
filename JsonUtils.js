// JsonUtils.js

import NodeData from './NodeData';
import { createEdge } from './Edge';
import { createConditionEdge } from './ConditionEdge';

// Convert nodes to a JSON object format
export const convertFlowToJson = (nodes, nodeIdCounter) => {
  const nodesData = nodes.map((node) => NodeData.fromReactFlowNode(node));

  const flowData = {
    nodes: nodesData.map((node) => node.toDict()),
    node_counter: nodeIdCounter,
  };

  return flowData;
};

// Save the JSON object to a file
export const saveJsonToFile = async (flowData) => {
  try {
    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'flow.json',
      types: [
        {
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });

    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    alert('Flow saved!');
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error saving JSON:', error);
      alert('Failed to save flow.');
    }
  }
};

// Original saveJson function - keeps the original interface
export const saveJson = async (nodes, nodeIdCounter) => {
  try {
    // Convert nodes to JSON
    const flowData = convertFlowToJson(nodes, nodeIdCounter);
    // Save the JSON data to a file
    await saveJsonToFile(flowData);
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error in saveJson:', error);
      alert('Failed to save flow.');
    }
  }
};

// Read and process JSON file (unchanged)
export const readJsonFile = async () => {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
      multiple: false,
    });

    const file = await fileHandle.getFile();
    const contents = await file.text();
    return JSON.parse(contents);
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error reading JSON file:', error);
      alert('Failed to read JSON file.');
    }
  }
};

// Process flow data (unchanged)
export const processFlowData = (flowData, setEdges, setNodes, setNodeIdCounter) => {
  try {
    const loadedNodes = (flowData.nodes || []).map((nodeData) => NodeData.fromDict(nodeData).toReactFlowNode());

    // First, set the nodes
    setNodes(loadedNodes);

    // Then, create edges
    const loadedEdges = [];
    loadedNodes.forEach((node) => {
      node.data.nexts.forEach((nextId) => {
        const newEdge = createEdge(loadedEdges, setEdges, { source: node.id, target: nextId }, loadedNodes, setNodes);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      });
      if (node.data.true_next) {
        const newEdge = createConditionEdge(loadedEdges, setEdges, { source: node.id, target: node.data.true_next, sourceHandle: 'true' }, loadedNodes, setNodes);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      }
      if (node.data.false_next) {
        const newEdge = createConditionEdge(loadedEdges, setEdges, { source: node.id, target: node.data.false_next, sourceHandle: 'false' }, loadedNodes, setNodes);
        if (newEdge) {
          loadedEdges.push(newEdge);
        }
      }
    });

    setEdges(loadedEdges);

    // Set node counter
    setNodeIdCounter(flowData.node_counter || 1);
  } catch (error) {
    console.error('Error processing JSON data:', error);
    alert('Failed to process JSON data.');
  }
};

// Load JSON file and process (unchanged)
export const loadJson = async (setEdges, setNodes, setNodeIdCounter) => {
  try {
    const flowData = await readJsonFile();
    if (flowData) {
      processFlowData(flowData, setEdges, setNodes, setNodeIdCounter);
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error loading JSON:', error);
      alert('Failed to load flow.');
    }
  }
};
