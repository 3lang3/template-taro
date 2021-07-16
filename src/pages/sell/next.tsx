import { useSelector } from 'react-redux';
import Typography from '@/components/Typography';
import { useState, useRef, useEffect } from 'react';
import {
  AtInput,
  AtForm,
  AtListItem,
  AtTextarea,
  AtModal,
  AtModalContent,
  AtModalHeader,
  AtModalAction,
} from 'taro-ui';
import Flex from '@/components/Flex';
import {
  hideLoading,
  hideToast,
  reLaunch,
  setNavigationBarTitle,
  showLoading,
  showToast,
  useRouter,
  useShareAppMessage,
} from '@tarojs/taro';
import { validateFields } from '@/utils/form';
import { Text, View } from '@tarojs/components';
import { SongUploader } from '@/components/Uploader';
import CustomPicker from '@/components/CustomPicker';
import ImagePicker from '@/components/image-picker';
import Button from '@/components/Button';
import { CircleIndexList } from '@/components/Chore';
import Icon from '@/components/Icon';
import Radio from '@/components/Radio';
import { claimMusicSong, songSale } from '@/services/sell';
import { getSaleSongDetail } from '@/services/song';
import { SellSteps } from './components';

import './index.less';

const inviteStepsData = [
  { title: '邀请作者入驻', desc: '上传词曲并给词曲定价' },
  { title: '作者入驻成功', desc: '平台审核通过后为您匹配合作机会' },
  { title: '作者确认词曲归属', desc: '词曲作者签署协议' },
];

const priceData = [
  { name: '1000元', id: 1000 },
  { name: '2000元', id: 2000 },
  { name: '3000元', id: 3000 },
  { name: '4000元', id: 4000 },
  { name: '5000元', id: 5000 },
  { name: '5000元以上', id: -1 },
];

const fields = {
  composer: {
    label: '作曲人姓名',
    rules: [{ required: true }],
  },
  composer_original_price: {
    label: '歌曲期望价格',
    rules: [{ required: true }],
  },
  composer_url: {
    label: '曲连接',
    rules: [{ required: true }],
  },
  lyricist_original_price: {
    label: '歌词期望价格',
    rules: [{ required: true }],
  },
  lyricist_content: {
    label: '歌词',
    rules: [{ required: true }],
  },
};

export type MyState = {
  composer: string | number; // 作曲人姓名
  is_composer: boolean; // 是否是作曲人
  composer_original_price: number; // 曲期望价格
  is_lyricist: boolean; // 是否作词人
  lyricist: string | number; // 作词人
  lyricist_original_price: number; // 词期望价格
  idcard: string | number; // 身份证
  lyricist_content: string; // 歌词
  composer_content: string[]; // 曲谱照片
  composer_url: string;
};

type RouterParams = {
  /** 认领模式 */
  pageType: 'claim';
  /** 歌曲ids */
  ids: string;
} & Record<string, any>;

export default () => {
  const { params } = useRouter<RouterParams>();
  const isClaimType = params.pageType === 'claim';
  const [detail, setDetail] = useState<any>({});
  const userData = useSelector((state) => state.common.data);
  const [visible, setVisible] = useState(false);
  const radioDisabledRef = useRef({ composer: false, lyricist: false });
  const [payload, set] = useState<MyState>({
    composer: '', // 作曲人姓名
    is_composer: false, // 是否是作曲人
    composer_original_price: 0, // 曲期望价格
    is_lyricist: false, // 是否作词人
    lyricist: '', // 作词人
    lyricist_original_price: 0, // 词期望价格
    idcard: '', // 身份证
    lyricist_content: '', // 歌词
    composer_content: [], // 曲谱照片
    composer_url: '',
  });

  useEffect(() => {
    // 动态设置标题
    setNavigationBarTitle({ title: isClaimType ? '词曲认领' : '出售词曲' });
    // 认领状态 获取词曲详情
    if (params.ids && isClaimType) {
      const getDetail = async () => {
        showLoading({ title: '加载中...' });
        const { data } = await getSaleSongDetail({ ids: params.ids });
        hideLoading();
        // 写入默认值
        set((v) => ({
          ...v,
          composer: data.composer,
          is_composer: Boolean(data.is_composer),
          composer_original_price: +data.composer_original_price,
          lyricist: data.lyricist,
          is_lyricist: Boolean(data.is_lyricist),
          lyricist_original_price: +data.lyricist_original_price,
          idcard: data.idcard,
          lyricist_content: data.lyricist_content,
          composer_content: data.composer_content,
          composer_url: data.url,
        }));
        setDetail(data);
      };
      getDetail();
    }
  }, [params.ids, isClaimType]);

  useShareAppMessage(() => {
    if (isClaimType) return {};
    return {
      title: '邀请您入驻平台',
      path: 'pages/me/index',
    };
  });

  const onSubmit = async () => {
    if (isClaimType) return;
    const hasInvalidField = validateFields(payload, fields);
    if (hasInvalidField) return;
    const { is_composer, is_lyricist, ...rest } = payload;
    if (!is_composer || !is_lyricist) {
      if (!rest.idcard) {
        showToast({ icon: 'none', title: '请输入作者身份证' });
        return;
      }
    }
    showToast({ icon: 'loading', title: '出售中...', mask: true });
    await songSale({
      ...rest,
      is_composer: Number(is_composer),
      is_lyricist: Number(is_lyricist),
      ...JSON.parse(params.params),
    });
    hideToast();
    setVisible(true);
  };

  const closeModal = () => setVisible(false);

  // 上传的谱曲
  const onSongUploader = (path) => {
    set((v: MyState) => ({ ...v, composer_url: path }));
  };

  // 上传谱曲照片
  const onImagePickerChange = (filesPath) => {
    set((v: MyState) => ({ ...v, composer_content: [...v.composer_content, filesPath] }));
  };

  // 删除图片
  const onImgRemove = (index: number) => {
    payload.composer_content.splice(index, 1);
    set((v: MyState) => ({ ...v, composer_content: [...v.composer_content] }));
  };

  // 我是作曲人点击
  const radioClick = (value, type) => {
    // 勾选“我是作曲人”则将用户实名姓名替换已有书写内容，且不可更改
    // 取消勾选则恢复成默认样式
    const _payload = { ...payload, [`is_${type}`]: value };
    if (value) {
      _payload[type] = userData.real_name;
      radioDisabledRef.current[type] = true;
    } else {
      _payload[type] = '';
      radioDisabledRef.current[type] = false;
    }
    set(_payload);
  };

  // 不是原创
  const isNotOriginal = !payload.is_composer || !payload.is_lyricist;

  return (
    <>
      <SellSteps current={1} />
      <AtForm className="custom-form">
        <Flex justify="between" className="bg-white">
          <AtInput
            name="composer"
            title={fields.composer.label}
            type="text"
            disabled={radioDisabledRef.current.composer || isClaimType}
            value={payload.composer as string}
            onChange={(value) => set((v: MyState) => ({ ...v, composer: value }))}
          />
          <Radio
            style={{ flex: '1 0 auto' }}
            className="px24"
            disabled={isClaimType}
            value={payload.is_composer}
            onChange={(v) => radioClick(v, 'composer')}
            label="我是作曲人"
          />
        </Flex>

        <CustomPicker
          title="请选择期望的曲价格（最终以实际成功为准）"
          arrow
          data={priceData}
          mode="selector"
          disabled={isClaimType}
          value={payload.composer_original_price}
          onChange={(value) => set((v: MyState) => ({ ...v, composer_original_price: value }))}
        />
        <SongUploader
          disabled={isClaimType}
          value={payload.composer_url}
          onChange={onSongUploader}
        />
        <ImagePicker
          onRemove={onImgRemove}
          files={payload.composer_content}
          onChange={onImagePickerChange}
        />
        <View className="h24 bg-light" />
        <Flex justify="between" className="bg-white">
          <AtInput
            name="lyricist"
            title="作词人姓名"
            type="text"
            value={payload.lyricist as string}
            disabled={radioDisabledRef.current.lyricist || isClaimType}
            onChange={(value) => set((v: MyState) => ({ ...v, lyricist: value }))}
          />
          <Radio
            disabled={isClaimType}
            style={{ flex: '1 0 auto' }}
            className="px24"
            value={payload.is_lyricist}
            onChange={(v) => radioClick(v, 'lyricist')}
            label="我是作词人"
          />
        </Flex>
        <CustomPicker
          disabled={isClaimType}
          title="请选择期望的词价格（最终以实际成功为准）"
          arrow
          data={priceData}
          mode="selector"
          value={payload.lyricist_original_price}
          onChange={(value) => set((v: MyState) => ({ ...v, lyricist_original_price: value }))}
        />
        <AtListItem title="上传歌词" />
        <View className="board bg-white px24 pb20">
          <AtTextarea
            disabled={isClaimType}
            className="border--bolder"
            count={false}
            placeholder="上传歌词，请输入80-1000字"
            value={payload.lyricist_content}
            onChange={(value) => set((v: MyState) => ({ ...v, lyricist_content: value }))}
          />
        </View>
        <View className="h24 bg-light" />
        {isClaimType && (
          <Flex justify="between" className="cell-item bg-white">
            <Flex style={{ flex: 1 }}>
              <Typography.Text type="secondary">
                该词或曲作者
                <Text className={detail.is_claim ? 'text-success' : 'text-danger'}>
                  {detail.is_claim ? '已' : '未'}认领
                </Text>
              </Typography.Text>
              <InviteHelpIcon />
            </Flex>
            <ClaimButton detail={detail} />
          </Flex>
        )}

        {/* 出售模式下 作词作曲不是本人需要邀请作者 */}
        {!isClaimType && isNotOriginal && (
          <>
            <Flex justify="between" className="cell-item bg-white">
              <Flex style={{ flex: 1 }}>
                <Typography.Text type="secondary">该词或曲作者尚未入驻，作者需认证</Typography.Text>
                <InviteHelpIcon />
              </Flex>
              <Button openType="share" type="primary" circle size="sm">
                邀请作者
              </Button>
            </Flex>
            <View className="px24 bg-white pb20">
              <View className="input--border">
                <AtInput
                  name="idcard"
                  type="text"
                  placeholder="请输入该作者身份证号"
                  value={payload.idcard as string}
                  onChange={(value) => set((v: any) => ({ ...v, idcard: value }))}
                />
              </View>
            </View>
          </>
        )}
        <View className="h24 bg-light" />
        <View className="p-default bg-white">
          <Typography.Text size="sm">1、目前仅支持上传未发行的词曲作品</Typography.Text>
          <Typography.Text size="sm">2、词曲只会上架词曲交易平台进行交易</Typography.Text>
          <Typography.Text size="sm">
            3、上传者本人需拥有词曲的完整权利。禁止盗用他人作品，一经发现娱当家将严厉追究相关法律责任，且永久冻结违规账号
          </Typography.Text>
        </View>
        {/* 认领模式没有提交按钮 */}
        {!isClaimType && (
          <View className="p-default">
            <Button className="mt50 mb50" onClick={onSubmit} circle type="primary" size="lg">
              {(() => {
                if (+detail.status === 0) return '审核中';
                if (+detail.status === 1) return '已通过';
                if (+detail.status === 3) return '交易完成';
                return '提交';
              })()}
            </Button>
          </View>
        )}
      </AtForm>
      <AtModal isOpened={visible} onClose={closeModal}>
        <AtModalContent>
          <View className="mt60 mb50 text-center">
            <Icon icon="icon-popup_icon_chenggong" size={64} color="#6236ff" />
          </View>
          <Typography.Title center level={2}>
            提交成功，请耐心等待审核结果
          </Typography.Title>
          <Typography.Text center>
            审核结果将在48小时内通过系统消息 通知，如有疑问请联系在线客服
          </Typography.Text>
          <View className="text-center">
            <Button
              onClick={() => {
                closeModal();
                reLaunch({ url: '/pages/me/index' });
              }}
              circle
              className="mt40"
              type="primary"
              inline
            >
              知道了
            </Button>
          </View>
        </AtModalContent>
      </AtModal>
    </>
  );
};

// 邀请作者认证提示modal
function InviteHelpIcon() {
  const [visible, setVisible] = useState(false);
  const onContinue = () => {
    setVisible(false);
  };
  return (
    <>
      <Icon onClick={() => setVisible(true)} icon="icon-help-filling ml10" className="text-blue" />
      <AtModal isOpened={visible} onClose={() => setVisible(false)}>
        <AtModalHeader>邀请作者认证</AtModalHeader>
        <AtModalContent>
          <CircleIndexList data={inviteStepsData} />
          <Button onClick={onContinue} className="mt30" type="primary" circle>
            继续
          </Button>
        </AtModalContent>
      </AtModal>
    </>
  );
}

// 认领按钮
function ClaimButton({ detail }) {
  const [visible, setVisible] = useState(false);
  const onConfirm = async () => {
    showToast({ icon: 'loading', title: '认领中...', mask: true });
    const { msg } = await claimMusicSong({ ids: detail.ids });
    showToast({ icon: 'success', title: msg });
    setVisible(false);
    setTimeout(() => {
      reLaunch({ url: '/pages/me/index' });
    }, 1500);
  };

  if (detail.is_claim) return null;
  return (
    <>
      <Button onClick={() => setVisible(true)} type="primary" circle size="sm">
        确认认领
      </Button>
      <AtModal isOpened={visible} onClose={() => setVisible(false)}>
        <AtModalHeader>确认认领该词或曲为您原创</AtModalHeader>
        <AtModalAction>
          <Flex className="p-default" justify="between">
            <Button onClick={() => setVisible(false)} outline circle>
              取消
            </Button>
            <Button onClick={onConfirm} type="primary" circle>
              确认
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}
