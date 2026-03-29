import { useState } from 'react';
import { Handle, Position } from 'reactflow';

const typeColors = {
  trigger: { bg: '#1e1b4b', border: '#6366f1', badge: '#6366f1', label: 'Trigger' },
  action: { bg: '#1a2e1a', border: '#22c55e', badge: '#22c55e', label: 'Action' },
  output: { bg: '#2e1a1a', border: '#f97316', badge: '#f97316', label: 'Output' },
  start: { bg: '#1e1e2e', border: '#555', badge: '#555', label: 'Start' },
};

function CustomNode({ data }) {
  const colors = typeColors[data.type] || typeColors.action;
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  return (
    <div style={{
      background: colors.bg,
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      padding: '16px',
      minWidth: '220px',
      maxWidth: '260px',
      boxShadow: `0 0 20px ${colors.border}33`,
    }}>
      <Handle type="target" position={Position.Top} style={{ background: colors.border }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {data.step && (
          <span style={{
            background: colors.badge,
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {data.step}
          </span>
        )}
        <span style={{
          background: colors.badge + '33',
          color: colors.badge,
          fontSize: '10px',
          padding: '2px 8px',
          borderRadius: '10px',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {colors.label}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
  <span
    style={{ fontSize: '10px', color: '#555577', cursor: 'pointer' }}
    onClick={() => setEditing(true)}
  >
    ✏️
  </span>
  <span
    style={{ fontSize: '10px', color: '#f97316', cursor: 'pointer' }}
    onClick={() => data.onDelete && data.onDelete()}
  >
    🗑️
  </span>
</div>
      </div>

      {editing ? (
        <textarea
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => {
            data.label = label;
            setEditing(false);
          }}
          style={{
            width: '100%',
            background: '#0f0f1a',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            color: '#e2e8f0',
            fontSize: '13px',
            padding: '6px',
            resize: 'none',
            outline: 'none',
            lineHeight: '1.5',
            fontFamily: 'inherit'
          }}
          rows={3}
        />
      ) : (
        <p
          style={{
            color: '#e2e8f0',
            fontSize: '13px',
            lineHeight: '1.5',
            margin: 0,
            cursor: 'pointer'
          }}
          onDoubleClick={() => setEditing(true)}
        >
          {label}
        </p>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: colors.border }} />
    </div>
  );
}

export default CustomNode;