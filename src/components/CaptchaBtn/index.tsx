import { useEffect, useRef, useState } from 'react';
import { AtButton } from 'taro-ui';
import './index.less';

type CaptchaBtnProps = {
  /**
   * 倒计时数
   * @default 60
   */
  num?: number;
  /**
   * 点击验证码事件
   */
  onNodeClick?: () => void | Promise<any>;
};

export default ({ num = 60, onNodeClick }: CaptchaBtnProps) => {
  const timer = useRef<any>(null);
  const [count, setCount] = useState(num);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleClick = async () => {
    if (disabled) return;
    try {
      onNodeClick && (await onNodeClick());
      setDisabled(true);
      start();
    } catch (error) {
      console.log(error);
    }
  };

  const start = () => {
    timer.current = setTimeout(() => {
      setCount((v) => {
        if (v > 0) {
          start();
        } else {
          reset();
        }
        return v - 1;
      });
    }, 1000);
  };

  const reset = () => {
    setDisabled(false);
    setCount(num);
  };

  return (
    <AtButton onClick={handleClick} disabled={disabled} className="captcha-btn" size="small" circle>
      {disabled ? `${count}s` : '获取验证码'}
    </AtButton>
  );
};
