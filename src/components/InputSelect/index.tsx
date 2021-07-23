import { View, Text } from '@tarojs/components';
import { showToast } from '@tarojs/taro';
import Button from '@/components/Button';
import { useState, cloneElement } from 'react';
import { AtInput } from 'taro-ui';
import Flex from '../Flex';
import Pop from '../Pop';
import Icon from '../Icon';
import './index.less';

let timer: any = null;

export default ({ onSubmit, children, request, title }) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(''); // 输入框
  const [selector, setSelector] = useState<any>([] as any[]);
  const [list, setList] = useState([]);
  function onChange(inputVal, event) {
    setValue(inputVal);
    if (timer) clearTimeout(timer);
    if (inputVal && event.type === 'input') {
      timer = setTimeout(() => {
        request({ real_name: inputVal }).then(({ data }) => {
          setList(data || []);
        });
      }, 800);
    }
  }
  function onSelector(node) {
    setValue('');
    setList([]);
    if (selector.length > 5) {
      return showToast({
        title: '最多设置5个',
        icon: 'none',
        duration: 1500,
      });
    }
    if (!selector.find((item) => item.ids === node.ids)) {
      setSelector((v) => [...v, node]);
    }
  }
  function onRemove(node) {
    const idx = (selector as any).findIndex((item) => node.ids === item.ids);
    selector.splice(idx, 1);
    setSelector([...selector]);
  }
  return (
    <>
      {cloneElement(children, {
        onClick: () => {
          setVisible(true);
        },
      })}
      {visible && (
        <Pop>
          <View className="input-select">
            <Text className="title">{title}</Text>
            <View className="main">
              <View className="input--border">
                <AtInput
                  className="input"
                  value={value}
                  placeholder="请输入歌手"
                  name="singer"
                  onChange={(v, e) => onChange(v, e)}
                />
              </View>
              <View className="content">
                {list.map((item: any) => (
                  <View
                    key={'z-' + item.ids}
                    onClick={() => onSelector(item)}
                    className="content-item"
                  >
                    <Text>{item.real_name}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Flex wrap="wrap" className="selector-list">
              {selector.map((item: any) => (
                <Flex key={'h-' + item.ids} justify="center" className="selector-list-item">
                  <Text>{item.real_name}</Text>
                  <Icon onClick={() => onRemove(item)} icon="icon-pop_icon_shanchu" />
                </Flex>
              ))}
            </Flex>
            <Flex className="mt50" justify="between">
              <Button onClick={() => setVisible(false)} outline circle>
                取消
              </Button>
              <Button
                onClick={() => {
                  if (onSubmit(selector)) setVisible(false);
                }}
                type="primary"
                circle
              >
                确认
              </Button>
            </Flex>
          </View>
        </Pop>
      )}
    </>
  );
};
