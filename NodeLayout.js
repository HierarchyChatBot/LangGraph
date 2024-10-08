// NodeLayout.js

import React, { useCallback } from 'react';
import { Handle, Position, NodeResizeControl } from 'reactflow';
import ResizeIcon from './ResizeIcon';

const handleStyle = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#555',
};

function NodeLayout({ data, isConnectable, onChangeName, onChangeDescription, onChangeType, onResize, onChangeTool, onChangeInfo }) {
  const handleTypeChange = useCallback((evt) => {
    const newType = evt.target.value;
    onChangeType(evt);
    // Update the node data type
    data.type = newType;
  }, [onChangeType, data]);

  const handleResize = useCallback((evt, { width, height }) => {
    onResize(width, height);
  }, [onResize]);

  return (
    <div 
      style={{ 
        border: '1px solid #898989', // Darker boundary color
        padding: '5px', 
        borderRadius: '15px', // More rounded corners
        background: 'white',
        width: data.width || 200,
        height: data.height || 200,
        overflow: 'visible', // Ensure overflow is visible
        position: 'relative'
      }}
    >
      <NodeResizeControl 
        style={{ position: 'absolute', right: 5, bottom: 5 }} 
        minWidth={200} 
        minHeight={200} 
        onResize={handleResize}
      >
        <ResizeIcon />
      </NodeResizeControl>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ ...handleStyle, left: '-5px', top: 'calc(50% - 5px)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ ...handleStyle, right: '-5px', top: 'calc(50% - 5px)' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="true"
        style={{ ...handleStyle, top: '-5px', left: 'calc(50% - 5px)', background: 'green' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ ...handleStyle, bottom: '-5px', left: 'calc(50% - 5px)', background: 'red' }}
        isConnectable={isConnectable}
      />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div>
          <label htmlFor="type" style={{ display: 'block', fontSize: '12px' }}>Type:</label>
          <select
            id="type"
            name="type"
            value={data.type}
            onChange={handleTypeChange}
            className="nodrag"
            style={{ width: 'calc(100% - 20px)' }}
          >
            <option value="START">START</option>
            <option value="STEP">STEP</option>
            <option value="TOOL">TOOL</option>
            <option value="CONDITION">CONDITION</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
        {data.type !== 'START' && (
          <>
            {['STEP', 'CONDITION'].includes(data.type) && (
              <div>
                <label htmlFor="text" style={{ display: 'block', fontSize: '12px' }}>Name:</label>
                <input
                  id="text"
                  name="text"
                  value={data.name}
                  onChange={onChangeName}
                  className="nodrag"
                  style={{ width: 'calc(100% - 20px)' }}
                />
              </div>
            )}
            {data.type === 'STEP' && (
              <div>
                <label htmlFor="tool" style={{ display: 'block', fontSize: '12px' }}>Tool:</label>
                <input
                  id="tool"
                  name="tool"
                  value={data.tool}
                  onChange={(e) => onChangeTool(e.target.value)}
                  className="nodrag"
                  style={{ width: 'calc(100% - 20px)' }}
                />
              </div>
            )}
            {data.type === 'INFO' && (
              <div>
                <label htmlFor="info" style={{ display: 'block', fontSize: '12px' }}>Info:</label>
                <input
                  id="info"
                  name="info"
                  value={data.info} // Use optional chaining
                  onChange={onChangeInfo} // Call the new handler
                  className="nodrag"
                  style={{ width: 'calc(100% - 20px)' }}
                />
              </div>
            )}
          </>
        )}
        <div>
          <label htmlFor="description" style={{ display: 'block', fontSize: '12px' }}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={onChangeDescription}
            className="nodrag"
            style={{ width: 'calc(100% - 20px)', resize: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default NodeLayout;
