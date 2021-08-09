import cls from 'classnames';
import Typography from '@/components/Typography';
import { useState, useMemo } from 'react';
import {
  AtInput,
  AtForm,
  AtListItem,
  AtTextarea,
  AtModal,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import { validateFields } from '@/utils/form';
import { useSelector } from 'react-redux';
import { View } from '@tarojs/components';
import { setClipboardData, navigateTo, showToast, getCurrentInstance } from '@tarojs/taro';
import Button from '@/components/Button';
import CustomPicker from '@/components/CustomPicker';
import MoreSelect from '@/components/MoreSelect';
import Flex from '@/components/Flex';
import { getSaleSongDetail } from '@/services/song';
import { useRequest } from 'ahooks';
import { SellSteps } from './components';
import './index.less';

const simpleText = `创作目的：提高自己知名度，售卖版权取得收益
创作完成时间：2016年5月20日
创作完成地点：北京市
作品独创性：使用了民风和电子结合的曲风
创作灵感：讲述男女分手后，单方面思念以前一起做过的任何事情，当听到他们喜欢的歌曲的时候，身边却只有自己了，虽然分开那么久却还是不能习惯`;

const fields = {
  song_name: {
    label: '作品名',
    rules: [{ required: true }],
  },
  sect: {
    label: '流派',
    rules: [{ required: true }],
  },
  language: {
    label: '语种',
    rules: [{ required: true }],
  },
  tag: {
    label: '标签',
    rules: [{ required: true }],
  },
  introduce: {
    label: '作品简介',
  },
  explain: {
    label: '创作说明',
  },
};

export type TagNode = {
  tag_type_name: string;
  tag_type: number;
  value: [
    {
      name: string;
      tag: number;
      tag_name: string;
      value: number;
    },
  ];
};

export type State = {
  song_name: string;
  sect: number;
  language: number;
  tag: TagNode[];
  introduce: string;
  explain: string;
  reason: string;
  status: number;
};

export default () => {
  const [visible, setVisible] = useState(false);
  const store = useSelector((state) => state.common);
  const pickerData = useMemo(() => {
    return () => {
      return store.tagType.map((item) => ({
        ...item,
        name: item.tag_type_name,
        value: item.tag_type,
        children: item.value.map((child) => ({
          ...child,
          name: child.tag_name,
          value: child.tag,
        })),
      }));
    };
  }, [store.tagType]);
  const langData = useMemo(
    () => store.languageVersion.map(({ name, language }) => ({ name, id: language })),
    [store.languageVersion],
  );
  const songStyle = useMemo(
    () => store.songStyle.map(({ name, song_style }) => ({ name, id: song_style })),
    [store.songStyle],
  );
  const [payload, set] = useState<State>({
    song_name: '',
    sect: 0,
    language: 0,
    tag: [],
    introduce: '',
    explain: '',
    reason: '', // 驳回原因
    status: 0,
  });

  const { router } = getCurrentInstance();
  const { ids } = (router as any).params;
  if (ids) {
    useRequest(getSaleSongDetail, {
      defaultParams: [{ ids }],
      onSuccess: ({
        data: { song_name, sect, language, tag, introduce, explain, reason, status },
      }) => {
        const tagArr: Array<TagNode[]> = [[], [], []] as any;
        pickerData().forEach((item, i) => {
          item.children.forEach((child) => {
            if (tag && tag.includes(child.name) && tag.length) {
              tagArr[i].push(child as any);
              tag.shift();
            }
          });
        });
        onLabel(tagArr);
        set((v) => ({
          ...v,
          status,
          reason,
          song_name,
          sect: songStyle.find((item) => item.name === sect)?.id as any,
          language: langData.find((item) => item.name === language)?.id as any,
          introduce,
          explain,
        }));
      },
    });
  }

  const onSubmit = () => {
    const hasInvalidField = validateFields(payload, fields);
    if (hasInvalidField) return;
    if (!getTagText()) {
      showToast({ icon: 'none', title: '请选择标签' });
      return;
    }
    if (payload.song_name.length > 20) {
      showToast({ icon: 'none', title: '作品名最多输20个字' });
      return;
    }
    navigateTo({
      url: `/pages/sell/next?params=${JSON.stringify({
        ...payload,
        ids,
      })}&ids=${ids || ''}`,
    });
  };

  const closeModal = () => setVisible(false);

  const onModalConfirm = async () => {
    await setClipboardData({ data: simpleText });
    closeModal();
  };

  function onLabel(values) {
    const result = values.map((item, i) => {
      const { tag_type, tag_type_name } = store.tagType[i];
      return {
        tag_type,
        tag_type_name,
        value: item,
      };
    });
    set((v: State) => ({ ...v, tag: result }));
  }

  const getTagText = useMemo(() => {
    return () => {
      const myArr: string[] = [];
      const tag: TagNode[] = payload.tag;
      if (tag && tag.length) {
        for (let i = 0; i < tag.length; i++) {
          for (let j = 0; j < tag[i].value.length; j++) {
            if (myArr.length < 2) {
              myArr.push(tag[i].value[j].name);
            } else {
              break;
            }
          }
        }
      }
      return String(myArr);
    };
  }, [payload.tag]);

  return (
    <>
      {payload.reason && payload.status === 2 && (
        <Flex align="start" className="settlein-reason">
          <Typography.Text>驳回原因：</Typography.Text>
          <Typography.Text style={{ flex: '1' }} type="danger">
            {payload.reason}
          </Typography.Text>
        </Flex>
      )}
      <SellSteps />
      <AtForm
        className={cls('custom-form', {
          'form-disabled': payload.status !== 2 && payload.status !== 0,
        })}
      >
        <AtInput
          name="song_name"
          placeholder="请输入作品名称"
          maxlength={20}
          title={fields.song_name.label}
          type="text"
          value={payload.song_name}
          onChange={(value: string) => set((v: State) => ({ ...v, song_name: value }))}
        />
        <CustomPicker
          title={fields.sect.label}
          arrow
          data={songStyle}
          mode="selector"
          value={payload.sect}
          onChange={(value) => set((v: State) => ({ ...v, sect: value }))}
        />
        <CustomPicker
          title={fields.language.label}
          arrow
          data={langData}
          mode="selector"
          value={payload.language}
          onChange={(value) => set((v: State) => ({ ...v, language: value }))}
        />
        <MoreSelect
          title="主题选择"
          toastMsg="每种最多选择2个"
          value={payload.tag}
          max={2}
          onSubmit={onLabel}
          contentTitle="标签选择"
          data={pickerData() as any[]}
        >
          <AtListItem
            title={`${fields.tag.label}(每种最多2个)`}
            extraText={getTagText()}
            arrow={!getTagText() ? 'right' : undefined}
          />
        </MoreSelect>
        <AtListItem title={`${fields.introduce.label}(选填)`} />
        <View className="board bg-white px24">
          <AtTextarea
            className="border--bolder"
            count={false}
            placeholder={fields.introduce.label}
            value={payload.introduce}
            onChange={(value) => set((v: State) => ({ ...v, introduce: value }))}
          />
        </View>
        <AtListItem title={`${fields.explain.label}(选填)`} />
        <View className="board bg-white px24">
          <AtTextarea
            className="border--bolder"
            count={false}
            placeholder={fields.explain.label}
            value={payload.explain}
            onChange={(value) => set((v: State) => ({ ...v, explain: value }))}
          />
        </View>
        <View onClick={() => setVisible(true)} className="p-default bg-white">
          <Typography.Link>样例参考</Typography.Link>
        </View>
        <View className="p-default">
          <Button className="mt50 mb50" onClick={onSubmit} circle type="primary" size="lg">
            下一步
          </Button>
        </View>
      </AtForm>
      {visible && (
        <AtModal isOpened={visible} onClose={closeModal}>
          <AtModalHeader>样例参考</AtModalHeader>
          <AtModalContent>
            <View className="board bg-white">
              <AtTextarea
                customStyle={{ wordBreak: 'break-all' }}
                className="border--bolder"
                height="268"
                value={simpleText}
                count={false}
                onChange={() => false}
              />
            </View>
            <Button onClick={onModalConfirm} className="mt30" type="primary" circle>
              复制到输入框
            </Button>
          </AtModalContent>
        </AtModal>
      )}
    </>
  );
};
