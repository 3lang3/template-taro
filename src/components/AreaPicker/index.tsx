import { useEffect, useRef, useState } from 'react';
import { Picker } from '@tarojs/components';
import { AtListItem } from 'taro-ui';
import pickerData from './demoData';


export default function AreaPicker({ onChange, value, ...props }: any) {
  const [range, setRange] = useState(() => getPickerData(pickerData, value));
  const [pickerValue, setPickerValue] = useState([0, 0, 0]);
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
      setPickerValue([0, 0, 0]);
      setTitleStr('');
      return;
    }
    const pickerValueFromOuter = getPickerValueFromRes(pickerData, value);
    setInnerState(pickerValueFromOuter);
  }, [value]);

  const _change = ({ detail }) => {
    innerEffect.current = true;
    setInnerState(detail.value);
    if (onChange) {
      const payload = getValueFromPicker(pickerData, detail.value);
      if (onChange) onChange(payload);
    }
  };
  const _columnChange = ({ detail }) => {
    if (detail.column === 2) return;
    let newValue = JSON.parse(JSON.stringify(pickerValue));
    newValue[detail.column] = detail.value;
    if (detail.column === 0) newValue = [detail.value, 0, 0];
    if (detail.column === 1) newValue[2] = 0;
    const newRange = getPickerData(pickerData, newValue);
    setRange(newRange);
    setPickerValue(newValue);
  };

  const setInnerState = (pv) => {
    setPickerValue(pv);
    const title = getTitleFromPicker(pickerData, pv);
    setTitleStr(title.join(' '));
  };

  return (
    <Picker
      value={pickerValue}
      mode="multiSelector"
      range={range}
      onChange={_change}
      onColumnChange={_columnChange}
      {...props}
    >
      <AtListItem title="请选择所在地区" extraText={titleStr} />
    </Picker>
  );
}

// 区域数据项
type RegionItemType = {
  id: number | string;
  name: string;
  children?: RegionItemType[];
};

function getPickerData(data: RegionItemType[], pickerValue: number[] = []) {
  const [v0 = 0, v1 = 0] = pickerValue;
  const column1NameArr = data.map((el) => el.name);
  const column2 = data[v0]?.children;
  const column2NameArr = column2?.map((el) => el.name) || [];
  const column3 = column2 && column2[v1]?.children;
  const column3NameArr = column3?.map((el) => el.name) || [];

  return [column1NameArr, column2NameArr, column3NameArr];
}

/**
 * 从服务端value获取Picker value
 * @param data 区域数据
 * @param serverValue 服务端存储的区域id [id, id, id]
 * @returns
 */
function getInfoFromPicker(data: RegionItemType[], pickerValue: number[], type: 'value' | 'title') {
  const [v0 = 0, v1 = 0, v2 = 0] = pickerValue;
  const column1Item = data[v0];
  const column2Item = column1Item?.children && column1Item.children[v1];
  const column3Item = column2Item && column2Item?.children && column2Item?.children[v2];
  const value = [column1Item?.id || 0, column2Item?.id || 0, column3Item?.id || 0];
  const title = [column1Item?.name, column2Item?.name, column3Item?.name];
  if (type === 'value') return value;
  return title;
}

function getValueFromPicker(data: RegionItemType[], pickerValue: number[]) {
  return getInfoFromPicker(data, pickerValue, 'value');
}

function getTitleFromPicker(data: RegionItemType[], pickerValue: number[]) {
  return getInfoFromPicker(data, pickerValue, 'title');
}

function getPickerValueFromRes(data: RegionItemType[], serverValue: number[] = []): number[] {
  const [v0 = 0, v1 = 0, v2 = 0] = serverValue;
  const column1Value = v0 === 0 ? 0 : data.findIndex((el) => +el.id === +v0);
  const column2 = data[column1Value]?.children;
  const column2Value = v1 === 0 ? 0 : column2?.findIndex((el) => +el.id === +v1);
  const column3 = column2 && column2[v1]?.children;
  const column3Value = v2 === 0 ? 0 : column3?.findIndex((el) => +el.id === +v2);

  return [column1Value, column2Value || 0, column3Value || 0];
}
