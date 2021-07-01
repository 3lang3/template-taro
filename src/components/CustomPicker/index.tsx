import { useEffect, useRef, useState } from 'react';
import { Picker } from '@tarojs/components';
import { AtListItem } from 'taro-ui';

type CustomPickerProps = {
  /**
   * picker模式
   *
   * @default 'multiSelector'
   * - multiSelector 多选
   * - selector 单选
   */
  mode?: 'multiSelector' | 'selector';
  /**
   * label标题
   */
  title: string;
  /**
   * picker展示数据
   * 如果是二维数组根据数组长度生成column列数
   */
  data: any[];
  onChange: (value: any) => void;
  value: any;
  /**
   * 展示字段key
   * @default 'name'
   */
  nameKey?: string;
  /**
   * 值字段key
   * @default 'id'
   */
  valueKey?: string;
  /**
   * 是否展示右侧箭头
   */
  arrow?: boolean;
  /**
   * 是否联级模式
   */
  cascade?: boolean;
  disabled?: boolean;
};

export default function CustomPicker({
  data,
  title,
  onChange,
  value,
  nameKey = 'name',
  valueKey = 'id',
  mode = 'multiSelector',
  arrow,
  cascade,
  disabled,
  ...props
}: CustomPickerProps) {
  const [range, setRange] = useState(() =>
    getPickerData(data, value, { mode, nameKey, valueKey, cascade }),
  );
  const [pickerValue, setPickerValue] = useState(() => getInitialValue(data, mode) as any);
  const [titleStr, setTitleStr] = useState('');
  const innerEffect = useRef(false);

  useEffect(() => {
    // innerEffect.current为true代表内部更新value
    // 此场景return防止useEffect无限执行
    if (innerEffect.current) {
      innerEffect.current = false;
      return;
    }
    if (!value) {
      // 重置组件内部状态
      setPickerValue(getInitialValue(data, mode));
      setTitleStr('');
      return;
    }
    const pickerValueFromOuter = getPickerValueFromRes(data, value, {
      mode,
      nameKey,
      valueKey,
      cascade,
    });
    setInnerState(pickerValueFromOuter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const _change = ({ detail }) => {
    if (disabled) return;
    innerEffect.current = true;
    setInnerState(detail.value);
    if (onChange) {
      const payload = getValueFromPicker(data, detail.value, { mode, nameKey, valueKey, cascade });
      if (onChange) onChange(payload);
    }
  };
  const _columnChange = ({ detail }) => {
    if (disabled) return;
    if (mode !== 'multiSelector' || !cascade) return;
    if (detail.column === range.length - 1) return;
    let newValue = JSON.parse(JSON.stringify(pickerValue)) as any[];
    newValue[detail.column] = detail.value;
    newValue.fill(0, detail.column + 1);
    const newRange = getPickerData(data, newValue, { mode, nameKey, valueKey, cascade });
    setRange(newRange);
    setPickerValue(newValue);
  };

  const setInnerState = (pv) => {
    setPickerValue(pv);
    const titleArr = getTitleFromPicker(data, pv, { mode, nameKey, valueKey, cascade });
    setTitleStr(Array.isArray(titleArr) ? titleArr.join(' ') : titleArr);
  };

  return (
    <Picker
      disabled={disabled}
      value={pickerValue}
      mode={mode as any}
      range={range}
      onChange={_change}
      onColumnChange={_columnChange}
      {...props}
    >
      <AtListItem
        title={title}
        extraText={titleStr}
        arrow={arrow && !value ? 'right' : undefined}
      />
    </Picker>
  );
}

// 获取初始值
function getInitialValue(data: any[], mode?) {
  return mode === 'multiSelector' ? Array.from({ length: data.length }, () => 0) : 0;
}

// 区域数据项
type RegionItemType = {
  id: number | string;
  name: string;
  children?: RegionItemType[];
};

function getPickerData(
  data: RegionItemType[],
  pickerValue: number[] = [],
  opts?: Record<string, any>,
) {
  const { mode, childrenKey = 'children', nameKey = 'name', cascade } = opts || {};
  if (mode !== 'multiSelector') return data.map((el) => el[nameKey]);
  const rs = [] as any[];
  let pValue = pickerValue;
  if (!pValue.length) {
    pValue = Array.from({ length: data.length }, () => 0);
  }
  pValue.reduce((a: any, _, i) => {
    let column = data[i] as any;
    if (cascade) {
      column = i === 0 ? data : a[pValue[i - 1]][childrenKey];
    }
    rs.push(!column ? [] : column.map((el) => el[nameKey]));
    return column;
  }, []);
  return rs;
}

/**
 * 从服务端value获取Picker value
 * @param data 区域数据
 * @param serverValue 服务端存储的区域id [id, id, id]
 * @returns
 */
function getInfoFromPicker(
  data: RegionItemType[],
  pickerValue: number | number[],
  type: 'value' | 'title',
  opts?: Record<string, any>,
) {
  const { mode, childrenKey = 'children', nameKey = 'name', valueKey = 'id', cascade } = opts || {};
  if (mode !== 'multiSelector' && !Array.isArray(pickerValue)) {
    if (type === 'value') return data[pickerValue][valueKey];
    return data[pickerValue][nameKey];
  }
  const rs = { title: [], value: [] } as any;
  (pickerValue as []).reduce((a: any, v, i) => {
    let column = data[i];
    if (cascade) {
      column = i === 0 ? data : a[pickerValue[i - 1]][childrenKey];
    }
    const hasColumnChildren = column && column[v];
    rs.title.push(hasColumnChildren ? column[v][nameKey] : undefined);
    rs.value.push(hasColumnChildren ? column[v][valueKey] : 0);
    return column;
  }, []);

  if (type === 'value') return rs.value;
  return rs.title;
}

function getValueFromPicker(
  data: RegionItemType[],
  pickerValue: number[],
  opts?: Record<string, any>,
) {
  return getInfoFromPicker(data, pickerValue, 'value', opts);
}

function getTitleFromPicker(
  data: RegionItemType[],
  pickerValue: number[],
  opts?: Record<string, any>,
) {
  return getInfoFromPicker(data, pickerValue, 'title', opts);
}

function getPickerValueFromRes(
  data: RegionItemType[],
  serverValue: number | number[],
  opts?: Record<string, any>,
): number | number[] {
  const { mode, childrenKey = 'children', valueKey = 'id', cascade } = opts || {};
  if (mode !== 'multiSelector') {
    const singleColumnValue = data.findIndex((el) => +el[valueKey] === +serverValue);
    return singleColumnValue < 0 ? 0 : singleColumnValue;
  }

  const rs = [] as any[];

  (serverValue as []).reduce((a: any, v, i) => {
    let column = data[i] as any;
    if (cascade) {
      column = i === 0 ? data : a[rs[i - 1]][childrenKey];
    }
    const columnValue = column ? column.findIndex((el) => +el[valueKey] === +v) : 0;
    rs.push(columnValue < 0 ? 0 : columnValue);
    return column;
  }, []);

  return rs;
}
