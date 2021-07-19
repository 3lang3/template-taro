import { useEffect, useRef, useState } from 'react';
import { Picker } from '@tarojs/components';
import { AtListItem } from 'taro-ui';

type ChildrenFuncPramas = {
  /** 选中的`nameKey`数组 */
  titleArr: string[];
};

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
  title?: string;
  /**
   * picker展示数据
   * 如果是二维数组根据数组长度生成column列数
   */
  data: any[];
  onChange: (value: any, valueStr: string[]) => void;
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
  childrenKey?: string;
  /**
   * 是否展示右侧箭头
   */
  arrow?: boolean;
  /**
   * 是否联级模式
   * 数值代表联级层数
   */
  cascade?: number;
  disabled?: boolean;
  children?: React.ReactNode | ((params: ChildrenFuncPramas) => React.ReactNode);
};

export default function CustomPicker({
  data,
  title,
  onChange,
  value,
  nameKey = 'name',
  valueKey = 'id',
  childrenKey = 'child',
  mode = 'multiSelector',
  arrow,
  cascade,
  disabled,
  children,
  ...props
}: CustomPickerProps) {
  const [range, setRange] = useState(() =>
    getPickerRange(data, value, { mode, nameKey, childrenKey, valueKey, cascade }),
  );
  const [pickerValue, setPickerValue] = useState(
    () => value || (getInitialValue(mode, cascade) as any),
  );
  const [titleArr, setTitleArr] = useState<string[]>([]);
  const initRef = useRef(false);
  const innerEffect = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      return;
    }
    setRange(getPickerRange(data, value, { mode, nameKey, childrenKey, valueKey, cascade }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    // innerEffect.current为true代表内部更新value
    // 此场景return防止useEffect无限执行
    if (innerEffect.current) {
      innerEffect.current = false;
      return;
    }
    if (!value) {
      // 重置组件内部状态
      setPickerValue(getInitialValue(mode, cascade));
      setTitleArr([]);
      return;
    }
    const pickerValueFromOuter = getPickerValueFromRes(data, value, {
      mode,
      nameKey,
      valueKey,
      childrenKey,
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
      const payload = getValueFromPicker(data, detail.value, {
        mode,
        nameKey,
        childrenKey,
        valueKey,
        cascade,
      });
      onChange(payload, titleArr);
    }
  };
  const _columnChange = ({ detail }) => {
    if (disabled) return;
    if (mode !== 'multiSelector' || !cascade) return;
    if (detail.column === range.length - 1) return;
    let newValue = JSON.parse(JSON.stringify(pickerValue)) as any[];
    newValue[detail.column] = detail.value;
    newValue.fill(0, detail.column + 1);
    if (cascade) {
      // 联级重置range值
      const newRange = getPickerRange(data, newValue, {
        mode,
        nameKey,
        childrenKey,
        valueKey,
        cascade,
      });
      setRange(newRange);
    }
    setPickerValue(newValue);
  };

  const setInnerState = (pv) => {
    setPickerValue(pv);
    const newTitleArr = getTitleFromPicker(data, pv, {
      mode,
      nameKey,
      childrenKey,
      valueKey,
      cascade,
    });
    setTitleArr(newTitleArr);
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
      {(() => {
        if (children && typeof children === 'function') {
          return children({ titleArr });
        }
        if (children) return children;
        return (
          <AtListItem
            disabled={disabled}
            title={title}
            extraText={Array.isArray(titleArr) ? titleArr.join(' ') : titleArr}
            arrow={arrow && !value ? 'right' : undefined}
          />
        );
      })()}
    </Picker>
  );
}

// 获取初始值
function getInitialValue(mode, cascade?) {
  return mode === 'multiSelector' ? Array.from({ length: cascade }, () => 0) : 0;
}

// 区域数据项
type RegionItemType = {
  id: number | string;
  name: string;
  children?: RegionItemType[];
};

function getPickerRange(
  data: RegionItemType[],
  pickerValue: number[] = [],
  opts?: Record<string, any>,
) {
  // data数据非预期
  if (!Array.isArray(data) || !data.length) return [];
  const { mode, childrenKey = 'children', nameKey = 'name', cascade } = opts || {};
  // 非多选
  if (mode !== 'multiSelector') return data.map((el) => el[nameKey]);

  // 多选
  const rs = [] as any[];
  let pValue = pickerValue.filter(Boolean);
  // 保证value格式符合data长度
  if (!pValue.length) {
    // 联级取cascade值 非联级取data(二维数组)长度
    pValue = Array.from({ length: cascade || data.length }, () => 0);
  }
  // 根据当前值获取 picker range数据(联级情况下需要重置range)
  pValue.reduce((a: any, _, i) => {
    let column = data[i] as any;
    if (cascade) {
      if (i > 0) {
        const currentParent = a.find((el) => +el.id === +pValue[i - 1]);
        column = currentParent ? currentParent[childrenKey] : a[pValue[i - 1]][childrenKey];
      } else {
        column = data;
      }
    }
    if (column[childrenKey]) {
      column = column[childrenKey];
    }
    rs.push(column.map((el) => el[nameKey]));
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
  const { mode, childrenKey, valueKey = 'id', cascade } = opts || {};
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
