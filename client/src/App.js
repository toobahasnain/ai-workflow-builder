import { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import Sidebar from './Sidebar';
import CustomNode from './CustomNode';
import axios from 'axios';

const nodeTypes = { custom: CustomNode };

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 200 },
    data: { label: 'Describe your workflow above to get started', type: 'start' }
  }
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflow, setWorkflow] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodeId, setNodeId] = useState(10);
  const [error, setError] = useState('');

  const examples = [
    "Every Monday I manually check emails for new orders, copy to Excel, then message team on WhatsApp",
    "Every week I collect timesheets from employees via email, add up hours and send payroll to accounting",
    "When a new lead fills our contact form, I copy details into CRM, send welcome email and add to spreadsheet"
  ];
const addNode = useCallback((type) => {
  const id = `node-${nodeId}`;
  const newNode = {
    id,
    type: 'custom',
    position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
    data: {
  label: type === 'trigger' ? 'New trigger — click to edit' :
         type === 'action' ? 'New action step' : 'New output result',
  type,
  step: nodeId,
  onDelete: () => setNodes((nds) => nds.filter((n) => n.id !== id))
}
  };
  setNodes((nds) => [...nds, newNode]);
  setNodeId((id) => id + 1);
}, [nodeId, setNodes]);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds)),
    [setEdges]
  );

  const handleGenerate = async () => {
    if (!workflow.trim()) {
      setError('Please describe your workflow first.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      setNodes([]);
setEdges([]);
      const response = await axios.post('https://ai-workflow-builder-api.onrender.com/api/automate', { workflow });
      const text = response.data.result;
      const lines = text.split('\n').filter(l => l.trim() && l.match(/^\d+\./));

      const newNodes = lines.slice(0, 6).map((line, index) => ({
        id: `step-${index + 1}`,
        type: 'custom',
        position: { x: 100 + (index % 2) * 320, y: 100 + Math.floor(index / 2) * 180 },
        data: {
  label: line.replace(/^\d+\.\s*\*?\*?/, '').replace(/\*\*/g, '').trim(),
  type: index === 0 ? 'trigger' : index === lines.length - 1 ? 'output' : 'action',
  step: index + 1,
  onDelete: () => setNodes((nds) => nds.filter((n) => n.id !== `step-${index + 1}`))
}
      }));

      const newEdges = newNodes.slice(0, -1).map((node, index) => ({
        id: `e${index + 1}`,
        source: `step-${index + 1}`,
        target: `step-${index + 2}`,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 }
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      setError('Something went wrong. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="logo">⚡ Workflow AI Builder</span>
        </div>
        <div className="top-bar-center">
          <input
            className="workflow-input"
            placeholder="Describe your business workflow..."
            value={workflow}
            onChange={(e) => setWorkflow(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : '✨ Generate'}
          </button>
        </div>
        <div className="top-bar-right">
          {examples.map((ex, i) => (
            <button key={i} className="example-chip" onClick={() => setWorkflow(ex)}>
              Example {i + 1}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-bar">{error}</div>}

      <div className="canvas-container">
        <Sidebar onAddNode={addNode} />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#333" gap={20} />
          <Controls />
          <MiniMap nodeColor="#6366f1" style={{ background: '#1a1a2e' }} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;