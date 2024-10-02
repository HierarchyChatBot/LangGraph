// RunWindow.js

import React, { useState, useEffect } from 'react';
import SERVER_URL from '../config';
import { useGraphManager } from './GraphManager';  // Import GraphManagerContext
import { convertFlowToJson } from './JsonUtils';  // Import JsonUtils
import ConfigManager from '../ConfigManager';  // Import ConfigManager to handle settings

function RunWindow({ onClose }) {
  const [responseMessage, setResponseMessage] = useState('');
  const [running, setRunning] = useState(false);
  
  // Load the llmModel and openAiKey from ConfigManager
  const { llmModel, openAiKey } = ConfigManager.getSettings();

  // Use GraphManagerContext to access nodes and nodeIdCounter
  const { nodes, nodeIdCounter } = useGraphManager();

  // Step 1: Save Graph Data to the Server before running the script
  const saveGraphData = async () => {
    try {
      // Convert nodes and nodeIdCounter to a JSON object
      const flowData = convertFlowToJson(nodes, nodeIdCounter);

      // Transmit the JSON object to the server
      const response = await fetch(`${SERVER_URL}/save-graph`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowData),  // Send the flow data to the server
      });

      if (!response.ok) {
        throw new Error('Failed to save graph data on the server.');
      }

      console.log('Graph data successfully saved to server.');
      setResponseMessage(prev => prev + '\nGraph data successfully saved to server.');
    } catch (error) {
      console.error('Error saving graph data:', error);
      setResponseMessage(prev => prev + '\nError saving graph data: ' + error.message);
      throw error;  // Re-throw the error so that handleRun can handle it
    }
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setResponseMessage('');

    try {
      // Step 1: Save graph data before running the script
      await saveGraphData();  // Add the new save step

      console.log("Attempting to send request to Flask server...");
      const response = await fetch(`${SERVER_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          llm_model: llmModel,  // Send the LLM model dynamically
          open_ai_key: openAiKey,  // Send the OpenAI key dynamically
        }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          console.log("Received chunk:", chunk);
          setResponseMessage(prev => prev + chunk);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(prev => prev + '\nError: ' + error.message);
      alert('Error: ' + error.message);
    } finally {
      setRunning(false);  // Ensure running is set to false when done or if there's an error
    }
  };

  const handleStop = async () => {
    if (!running) return;

    try {
      const response = await fetch(`${SERVER_URL}/stop`, {
        method: 'POST',
      });
      const message = await response.text();
      console.log(message);
      setResponseMessage(prev => prev + '\n' + message);
      if (response.ok) {
        setRunning(false);  // Reset running state if stop was successful
      } else {
        console.error('Failed to stop script:', message);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(prev => prev + '\nError: ' + error.message);
      alert('Error: ' + error.message);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/status`, {
          method: 'GET',
        });
        const status = await response.json();
        setRunning(status.running);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async () => {
    await handleStop();
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.window}>
        <h2>Run Script</h2>
        <button onClick={handleRun} disabled={running}>Run</button>
        <button onClick={handleStop} disabled={!running}>Stop</button>
        <button onClick={handleCancel}>Cancel</button>
        <div style={styles.response}>
          <pre>{responseMessage}</pre>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  window: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    width: '80%',
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  response: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px',
  },
};

export default RunWindow;
