import { useRequest } from 'ahooks';
import { setRegion } from '@/state/other';
import { getRegionList } from '@/services/common';
import { useDispatch, useSelector } from 'react-redux';
import CustomPicker from '..';

export default function AreaPicker({ onChange, value, ...props }: any) {
  const dispatch = useDispatch();
  const region = useSelector((state) => state.other.region);

  const { loading } = useRequest(getRegionList, {
    manual: !!region.length,
    onSuccess: ({ data }) => {
      dispatch(setRegion(data));
    },
  });

  if (loading || !region.length) return null;
  return (
    <CustomPicker
      arrow
      cascade={3}
      title="请选择所在地区"
      value={value}
      data={region}
      onChange={onChange}
      {...props}
    />
  );
}
