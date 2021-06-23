import pickerData from './demoData';
import CustomPicker from '..';

export default function AreaPicker({ onChange, value, ...props }: any) {
  return (
    <CustomPicker
      arrow
      cascade
      title="请选择所在地区"
      value={value}
      data={pickerData}
      onChange={onChange}
      {...props}
    />
  );
}
