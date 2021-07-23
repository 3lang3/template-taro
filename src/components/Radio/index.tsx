import cls from 'classnames';
import Flex from '../Flex';
import Icon from '../Icon';
import Typography from '../Typography';

type CustomRadioType = {
  value?: boolean;
  onChange?: (value: any) => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
};

export default ({ value, onChange, label, className, ...props }: CustomRadioType) => {
  return (
    <Flex {...props} className={className} onClick={() => (onChange ? onChange(!value) : null)}>
      <Icon
        className={cls('mr10', { 'text-primary': value, 'text-secondary': !value })}
        icon={value ? 'icon-chushouciqu_icon_xuanzhong' : 'icon-shenqing_icon_weigouxuan'}
      />
      <Typography.Text>{label}</Typography.Text>
    </Flex>
  );
};
