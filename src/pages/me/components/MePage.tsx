import Button from '@/components/Button';
import { CircleIndexList } from '@/components/Chore';
import Flex from '@/components/Flex';
import Icon from '@/components/Icon';
import Image from '@/components/Image';
import Typography from '@/components/Typography';
import { IDENTITY } from '@/config/constant';
import { getDecryptedData } from '@/services/common';
import { getHomePageDetail, MePageResType } from '@/services/me';
import { updateUserData } from '@/state/common';
import { getWechatCode, userLogin } from '@/utils/login';
import { View } from '@tarojs/components';
import { getStorageSync, navigateTo, setStorageSync, showToast, useDidShow } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AtModal, AtModalContent, AtModalHeader } from 'taro-ui';

import './me.less';

const sellStepData = [
  { title: '上传词曲', desc: '上传词曲并给词曲定价' },
  { title: '词曲审核', desc: '平台审核通过后为您匹配合作机会' },
  { title: '签署协议', desc: '词曲作者签署协议' },
  { title: '词曲交易', desc: '合作机构对于词曲收购付款' },
];

export default () => {
  const dispatch = useDispatch();
  const { done: isLogin, userInfo, data: userData } = useSelector((state) => state.common);
  const [visible, setVisible] = useState(false);
  // 请求页面展示信息
  const { data: { data: page } = { data: {} as MePageResType }, ...detailReq } = useRequest(
    getHomePageDetail,
    { manual: true },
  );

  useDidShow(() => {
    if (isLogin) {
      detailReq.run();
    }
  });

  // 用户登录
  const onUserProfile = async () => {
    try {
      await userLogin({ desc: '获取用户信息' });
    } catch (error) {
      showToast({ icon: 'none', title: error.message });
    }
  };
  // 申请点击
  const onApply = (identity, dontVerifyMobile?) => {
    // 未登录
    if (!isLogin) {
      showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    // 未绑定手机号
    if (!userData.mobile && !dontVerifyMobile) {
      return;
    }
    // 同时只可选择一种身份（词曲作者跟歌手）入驻
    // 审核中则不可申请其他类似入驻申请（展示“审核中”标识）
    if (page.audit_info && +page.audit_info.identity !== +identity) {
      showToast({ title: '当前正在审核中，请审核通过后再申请', icon: 'none' });
      return;
    }
    // 根据identity分发路由
    let url = `/pages/settlein/index?identity=${identity}`;
    if (page?.audit_info?.identity === identity) url += '&status=audit';
    navigateTo({ url });
  };
  // 绑定手机号
  const onGetPhoneNumber = async ({ detail }, identity) => {
    if (detail.errMsg !== 'getPhoneNumber:ok') {
      showToast({ icon: 'none', title: '授权手机号方能入驻' });
      return;
    }
    showToast({ icon: 'loading', title: '请稍后...' });

    /**
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
     * @summary 在回调中调用 wx.login 登录，可能会刷新登录态。此时服务器使用 code 换取的 sessionKey 不是加密时使用的 sessionKey，导致解密失败。建议开发者提前进行 login；或者在回调中先使用 checkSession 进行登录态检查，避免 login 刷新登录态。
     */
    const code = await getWechatCode();
    try {
      const { data } = await getDecryptedData({
        code,
        iv: detail.iv,
        encryptedData: detail.encryptedData,
      });
      dispatch(updateUserData({ is_authentication: 1, mobile: data.purePhoneNumber }));
      await showToast({ icon: 'success', title: '绑定成功' });
      onApply(identity, true);
    } catch (error) {
      showToast({ icon: 'none', title: error.message });
    }
  };
  // 出售按钮
  const onSellClick = () => {
    // 判断是否存在*不再显示*
    const neverShowModal = getStorageSync('sellStepModal');
    if (neverShowModal) {
      goToSellPage();
      return;
    }
    setVisible(true);
  };
  // 歌手认证按钮
  const onSingerAuth = () => {
    if (page.audit_info && +page.audit_info.identity === IDENTITY.SINGER) {
      showToast({ title: '当前正在审核中', icon: 'none' });
      return;
    }
    navigateTo({ url: `/pages/settlein/index?identity=${IDENTITY.SINGER}` });
  };

  const goToSellPage = () => {
    navigateTo({ url: '/pages/sell/index' });
    setVisible(false);
  };

  const closeModal = (localTarget?: boolean) => {
    setVisible(false);
    if (localTarget) {
      setStorageSync('sellStepModal', true);
    }
  };

  return (
    <>
      <Flex justify="between" direction="column" className="page-me">
        <View style={{ flex: 1, width: '100%' }}>
          <Flex className="me-header">
            <Image
              className="me-header__avatar"
              src={
                isLogin && userInfo.avatarUrl
                  ? userInfo.avatarUrl
                  : require('@/assets/icon/avatar_default.svg')
              }
            />
            <View style={{ flex: 1 }}>
              <Typography.Text className={isLogin ? 'mb10' : undefined} type="light" size="xl">
                {isLogin ? userInfo.nickName : '未登录'}
              </Typography.Text>
              {isLogin && <Typography.Text type="light">ID: {page.ids}</Typography.Text>}
            </View>
            {!isLogin && (
              <Button onClick={onUserProfile} circle outline type="light" size="xs">
                立即登录
              </Button>
            )}
            {/* 普通用户身份以上才可修改资料 */}
            {!!(isLogin && +userData.identity > 0) && (
              <Button
                onClick={() => navigateTo({ url: '/pages/profile/index' })}
                circle
                outline
                type="light"
                size="xs"
              >
                编辑资料
              </Button>
            )}
          </Flex>

          {/* 需要对应身份 歌手或者词曲作者 */}
          {isLogin && +userData.identity > 0 && (
            <>
              <Flex className="me-header__action mb40" justify="evenly">
                <Button onClick={onSellClick} className="me-header__action-btn" type="light" circle>
                  <Icon icon="icon-wode_icon_chushou" className="me-header__action-btn__icon" />
                  出售词曲
                </Button>
                <Button
                  onClick={() => navigateTo({ url: '/pages/song-manage/index' })}
                  className="me-header__action-btn"
                  type="light"
                  circle
                >
                  <Icon icon="icon-wode_icon_guanli" className="me-header__action-btn__icon" />
                  词曲管理
                </Button>
              </Flex>
              <View className="me-service">
                <Flex className="me-service__header">我的服务</Flex>
                <Flex justify="around" wrap="wrap" className="me-service__body">
                  {+userData.identity === IDENTITY.AUTHOR && (
                    <Flex onClick={onSingerAuth} className="me-service__item" direction="column">
                      <Icon
                        icon="icon-wode_icon_renzheng"
                        className="me-service__item__img"
                        color="#ED513B"
                      />
                      <Typography.Text>歌手认证</Typography.Text>
                    </Flex>
                  )}
                  {+userData.identity === IDENTITY.SINGER && (
                    <>
                      <Flex
                        onClick={() => navigateTo({ url: '/pages/my-song/index' })}
                        className="me-service__item"
                        direction="column"
                      >
                        <Icon
                          icon="icon-wode_icon_yaochang"
                          className="me-service__item__img"
                          color="#ED513B"
                        />
                        <Typography.Text>我要唱</Typography.Text>
                      </Flex>
                      <Flex
                        onClick={() => navigateTo({ url: '/pages/song-make/index' })}
                        className="me-service__item"
                        direction="column"
                      >
                        <Icon
                          icon="icon-wode_icon_zhizuo"
                          className="me-service__item__img"
                          color="#FFBB24"
                        />
                        <Typography.Text>歌曲制作</Typography.Text>
                      </Flex>
                    </>
                  )}
                  <Flex
                    className="me-service__item"
                    onClick={() => navigateTo({ url: '/pages/help/index' })}
                    direction="column"
                  >
                    <Icon
                      icon="icon-wode_icon_bangzhu"
                      className="me-service__item__img"
                      color="#0091FF"
                    />
                    <Typography.Text>帮助</Typography.Text>
                  </Flex>
                  <View className="me-service__item--fake" />
                  <View className="me-service__item--fake" />
                </Flex>
              </View>
            </>
          )}

          {/* 未登录或者普通身份能查看申请视图 */}
          {(+userData.identity < 1 || !isLogin) && (
            <>
              <Typography.Text className="mb30" type="light">
                请选择以下身份进行入驻
              </Typography.Text>
              <View className="me-card">
                <Button
                  openType={isLogin && !userData.mobile ? 'getPhoneNumber' : undefined}
                  onGetPhoneNumber={(e) => onGetPhoneNumber(e, 1)}
                  onClick={() => onApply(1)}
                  className="me-card-item"
                >
                  <Icon icon="icon-wode_icon_zuozhe" className="me-card-item__icon" />
                  <View className="me-card-item__content">
                    <Flex className="me-card-item__title">
                      <Typography.Title level={3} style={{ marginBottom: 0 }}>
                        词曲作者
                      </Typography.Title>
                      {page?.audit_info?.identity === IDENTITY.AUTHOR && (
                        <Typography.Text className="ml10" type="primary">
                          审核中
                        </Typography.Text>
                      )}
                    </Flex>
                    <Typography.Text>我是词曲作者，我要出售词曲demo</Typography.Text>
                  </View>
                  <Icon icon="icon-icon_jinru" className="me-card-item__action" />
                </Button>
                <Button
                  openType={isLogin && !userData.mobile ? 'getPhoneNumber' : undefined}
                  onGetPhoneNumber={(e) => onGetPhoneNumber(e, 2)}
                  onClick={() => onApply(2)}
                  className="me-card-item"
                >
                  <Icon icon="icon-wode_icon_geshou" className="me-card-item__icon" />
                  <View className="me-card-item__content">
                    <Flex className="me-card-item__title">
                      <Typography.Title level={3} style={{ marginBottom: 0 }}>
                        歌手/校园歌手
                      </Typography.Title>
                      {page?.audit_info?.identity === IDENTITY.SINGER && (
                        <Typography.Text className="ml10" type="primary">
                          审核中
                        </Typography.Text>
                      )}
                    </Flex>
                    <Typography.Text>我是歌手，我要唱歌！</Typography.Text>
                  </View>
                  <Icon icon="icon-icon_jinru" className="me-card-item__action" />
                </Button>
                <Flex
                  className="me-card-item"
                  onClick={() =>
                    showToast({
                      icon: 'none',
                      title: '当前暂不支持机构入驻申请，后续有开放请及时关注',
                    })
                  }
                >
                  <Icon icon="icon-wode_icon_jigou" className="me-card-item__icon" />
                  <View className="me-card-item__content">
                    <Typography.Title level={3} className="me-card-item__title">
                      机构（后续开放）
                    </Typography.Title>
                    <Typography.Text>我是唱片公司/厂牌，我要发行歌曲</Typography.Text>
                  </View>
                  <Icon icon="icon-icon_jinru" className="me-card-item__action" />
                </Flex>
              </View>
              <Typography.Link
                className="me-bottom__link"
                onClick={() => {
                  navigateTo({
                    url: '/pages/settlein/why',
                  });
                }}
              >
                为什么入驻娱当家?
              </Typography.Link>
            </>
          )}
        </View>
        <View className="me-bottom">
          <Flex className="me-bottom__action" justify="center">
            <Typography.Link>联系客服</Typography.Link>
            {/* <View style={{ margin: '0 5px' }}>|</View>
            <Typography.Link>投诉侵权</Typography.Link> */}
          </Flex>
        </View>
      </Flex>
      <AtModal isOpened={visible} onClose={() => closeModal()}>
        <AtModalHeader>出售词曲流程</AtModalHeader>
        <AtModalContent>
          <CircleIndexList data={sellStepData} />

          <View className="px24">
            <Button onClick={goToSellPage} className="mb20" circle type="primary">
              继续
            </Button>
            <Typography.Text
              center
              onClick={() => {
                closeModal(true);
                goToSellPage();
              }}
            >
              不再提示
            </Typography.Text>
          </View>
        </AtModalContent>
      </AtModal>
    </>
  );
};
