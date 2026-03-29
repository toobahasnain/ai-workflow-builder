const steps = [
  { type: 'trigger', icon: '⚡', label: 'Trigger', desc: 'Start of workflow', color: '#6366f1' },
  { type: 'action', icon: '⚙', label: 'Action', desc: 'Process or task', color: '#22c55e' },
  { type: 'output', icon: '📤', label: 'Output', desc: 'End result', color: '#f97316' },
];

const tools = [
  { icon: '📧', label: 'Email' },
  { icon: '📊', label: 'Spreadsheet' },
  { icon: '💬', label: 'Slack' },
  { icon: '🔗', label: 'API' },
  { icon: '📋', label: 'CRM' },
  { icon: '🤖', label: 'AI Model' },
];

function Sidebar({ onAddNode }) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <p className="sidebar-title">Node Types</p>
        <p className="sidebar-hint">Click to add to canvas</p>
        {steps.map((step) => (
          <div
            key={step.type}
            className="sidebar-item"
            onClick={() => onAddNode(step.type)}
            style={{ cursor: 'pointer', borderColor: '#2d2d4e' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = step.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2d4e'}
          >
            <span className="sidebar-icon">{step.icon}</span>
            <div>
              <p className="sidebar-label">{step.label}</p>
              <p className="sidebar-desc">{step.desc}</p>
            </div>
            <span style={{
              marginLeft: 'auto',
              color: step.color,
              fontSize: '18px',
              fontWeight: 'bold'
            }}>+</span>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">Integrations</p>
        <div className="tools-grid">
          {tools.map((tool) => (
            <div key={tool.label} className="tool-item">
              <span style={{ fontSize: '20px' }}>{tool.icon}</span>
              <p className="tool-label">{tool.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">AI Models</p>
        <div className="tools-grid">
          {['Gemini', 'GPT-4', 'Claude'].map((model) => (
            <div key={model} className="tool-item">
              <span style={{ fontSize: '20px' }}>🤖</span>
              <p className="tool-label">{model}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;