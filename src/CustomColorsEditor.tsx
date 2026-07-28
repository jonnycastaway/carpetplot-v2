import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Button, ColorPicker, InlineField, InlineFieldRow, Input } from '@grafana/ui';

export const CustomColorsEditor: React.FC<StandardEditorProps<Array<{ color: string; breakpoint?: number }>, any>> = ({ value, onChange }) => {
  const colors = value?.length ? value : [
    { color: '#1b9e77', breakpoint: 0 },
    { color: '#d95f02', breakpoint: 500 },
  ];

  const updateColor = (idx: number, c: string) => {
    onChange(colors.map((item, i) => (i === idx ? { ...item, color: c } : item)));
  };

  const updateBreakpoint = (idx: number, bp: number) => {
    onChange(colors.map((item, i) => (i === idx ? { ...item, breakpoint: bp } : item)));
  };

  const add = () => onChange([...colors, { color: '#ffffff', breakpoint: 50 }]);
  const remove = (idx: number) => {
    if (colors.length <= 2) return;
    onChange(colors.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {colors.map((cc, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <ColorPicker color={cc.color} onChange={(c) => updateColor(i, c)} />
          <Input type="number" value={cc.breakpoint ?? 0} onChange={(e) => updateBreakpoint(i, parseFloat(e.currentTarget.value) || 0)} style={{ width: 80 }} />
          <span style={{ fontSize: 11, color: '#aaa' }}>ab diesem Wert</span>
          {colors.length > 2 && <Button size="sm" variant="secondary" icon="times" onClick={() => remove(i)} />}
        </div>
      ))}
      <Button size="sm" variant="secondary" icon="plus" onClick={add}>Add Color</Button>
    </div>
  );
};