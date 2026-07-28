import { PanelPlugin } from '@grafana/data';
import { CarpetPlotPanel } from './CarpetPlotPanel';
import { CustomColorsEditor } from './CustomColorsEditor';
import { CarpetPlotOptions, AggregateType, FragmentType, ColorMode } from './types';

export const plugin = new PanelPlugin<CarpetPlotOptions>(CarpetPlotPanel)
  .setPanelOptions((builder) => {
    builder
      .addSelect({ path: 'aggregate', name: 'Aggregate', defaultValue: AggregateType.AVG, settings: { options: [
        { label: 'Average', value: AggregateType.AVG }, { label: 'Sum', value: AggregateType.SUM }, { label: 'Count', value: AggregateType.CNT },
        { label: 'Minimum', value: AggregateType.MIN }, { label: 'Maximum', value: AggregateType.MAX }, { label: 'First', value: AggregateType.FIRST }, { label: 'Last', value: AggregateType.LAST },
      ]}})
      .addSelect({ path: 'fragment', name: 'Time Fragment', defaultValue: FragmentType.HOUR, settings: { options: [
        { label: 'Minute', value: FragmentType.MINUTE }, { label: '15 minutes', value: FragmentType.QUARTER }, { label: 'Hour', value: FragmentType.HOUR },
      ]}})
      .addSelect({ path: 'color.mode', name: 'Color Mode', defaultValue: ColorMode.SPECTRUM, settings: { options: [
        { label: 'Spectrum', value: ColorMode.SPECTRUM }, { label: 'Custom', value: ColorMode.CUSTOM },
      ]}})
      .addSelect({ path: 'color.colorScheme', name: 'Color Scheme', defaultValue: 'interpolatePuBuGn',
        showIf: (cfg: any) => cfg.color?.mode === 'SPECTRUM',
        settings: { options: [
          { label: 'Spectral', value: 'interpolateSpectral' }, { label: 'RdYlGn', value: 'interpolateRdYlGn' },
          { label: 'Blues', value: 'interpolateBlues' }, { label: 'Greens', value: 'interpolateGreens' },
          { label: 'Greys', value: 'interpolateGreys' }, { label: 'Oranges', value: 'interpolateOranges' },
          { label: 'Purples', value: 'interpolatePurples' }, { label: 'Reds', value: 'interpolateReds' },
          { label: 'BuGn', value: 'interpolateBuGn' }, { label: 'BuPu', value: 'interpolateBuPu' },
          { label: 'GnBu', value: 'interpolateGnBu' }, { label: 'OrRd', value: 'interpolateOrRd' },
          { label: 'PuBuGn', value: 'interpolatePuBuGn' }, { label: 'PuBu', value: 'interpolatePuBu' },
          { label: 'PuRd', value: 'interpolatePuRd' }, { label: 'RdPu', value: 'interpolateRdPu' },
          { label: 'YlGnBu', value: 'interpolateYlGnBu' }, { label: 'YlGn', value: 'interpolateYlGn' },
          { label: 'YlOrBr', value: 'interpolateYlOrBr' }, { label: 'YlOrRd', value: 'interpolateYlOrRd' },
        ]}})
      .addCustomEditor({ id: 'customColors', path: 'color.customColors', name: 'Custom Colors',
        showIf: (cfg: any) => cfg.color?.mode === 'CUSTOM',
        defaultValue: [{ color: '#1b9e77', breakpoint: 0 }, { color: '#d95f02', breakpoint: 500 }],
        editor: CustomColorsEditor, useFieldset: true, settings: {} })
      .addColorPicker({ path: 'color.nullColor', name: 'Null Color', defaultValue: 'transparent' })
      .addNumberInput({ path: 'scale.min', name: 'Scale Min' })
      .addNumberInput({ path: 'scale.max', name: 'Scale Max' })
      .addBooleanSwitch({ path: 'xAxis.show', name: 'X-Axis (dates)', defaultValue: true })
      .addBooleanSwitch({ path: 'yAxis.show', name: 'Y-Axis (hours)', defaultValue: true })
      .addBooleanSwitch({ path: 'tooltip.show', name: 'Tooltip', defaultValue: true })
      .addBooleanSwitch({ path: 'legend.show', name: 'Legend', defaultValue: true })
      .addRadio({ path: 'legend.placement', name: 'Legend Position', defaultValue: 'right', settings: { options: [
        { label: 'Right', value: 'right' }, { label: 'Bottom', value: 'bottom' },
      ]}})
      .addUnitPicker({ path: 'data.unitFormat', name: 'Unit', defaultValue: 'watt' })
      .addNumberInput({ path: 'data.decimals', name: 'Decimals' });
  });