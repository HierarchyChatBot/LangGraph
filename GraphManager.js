// GraphManager.js
import React, { createContext, useContext, useState } from 'react';
import { useNodesState, useEdgesState} from 'reactflow';

const GraphManagerContext = createContext(null);

export const useGraphManager = () => {
  return useContext(GraphManagerContext);
};

export const GraphManagerProvider = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const value = {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    nodeIdCounter,
    setNodeIdCounter,
  };

  return (
    <GraphManagerContext.Provider value={value}>
      {children}
    </GraphManagerContext.Provider>
  );
};
