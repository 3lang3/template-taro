import Button from '@/components/Button';
import { CircleIndexList } from '@/components/Chore';
import CustomTabBar from '@/components/CustomTabBar';
import Flex from '@/components/Flex';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { getHomePageDetail, MePageResType } from '@/services/me';
import { userLogin } from '@/utils/login';
import { Image, View } from '@tarojs/components';
import { getStorageSync, hideToast, navigateTo, setStorageSync, showToast } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AtModal, AtModalContent, AtModalHeader } from 'taro-ui';

import './index.less';

const sellStepData = [
  { title: '上传词曲', desc: '上传词曲并给词曲定价' },
  { title: '词曲审核', desc: '平台审核通过后为您匹配合作机会' },
  { title: '签署协议', desc: '词曲作者签署协议' },
  { title: '词曲交易', desc: '合作机构对于词曲收购付款' },
];

export default () => {
  const { done: isLogin, userInfo } = useSelector((state) => state.common);
  const [visible, setVisible] = useState(false);
  // 请求页面展示信息
  const { data: { data: page } = { data: {} as MePageResType }, ...detailReq } = useRequest(
    getHomePageDetail,
    {
      manual: true,
    },
  );

  useEffect(() => {
    const getDetail = async () => {
      try {
        showToast({ icon: 'loading', title: '加载中' });
        const { data } = await detailReq.run();
        hideToast();
        console.log(data);
      } catch (error) {
        hideToast();
      }
    };
    if (isLogin) {
      getDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  // 用户登录
  const onLoginClick = async () => {
    // 已登录 跳转修改资料页面
    if (isLogin) {
      navigateTo({ url: '/pages/profile/index' });
      return;
    }
    try {
      await userLogin({ desc: '获取用户信息' });
    } catch (error) {
      console.log(error);
    }
  };
  // 申请点击
  const onApply = (identity) => {
    // 未登录
    if (!isLogin) {
      showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    // 未绑定手机号
    if (!page.mobile) return;
    let url = `/pages/settlein/index?identity=${identity}`;
    if (page?.audit_info?.identity === identity) url += '&status=audit';
    navigateTo({ url });
  };
  // 绑定手机号
  const onGetPhoneNumber = async ({ detail }, identity) => {
    console.log(detail);
    onApply(identity);
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

  const goToSellPage = () => {
    navigateTo({ url: '/pages/sell/index' });
  };

  const closeModal = (localTarget?: boolean) => {
    setVisible(false);
    if (localTarget) {
      setStorageSync('sellStepModal', true);
    }
  };

  return (
    <>
      <View className="page-me">
        <Flex className="me-header">
          <Image
            className="me-header__avatar"
            src={isLogin ? userInfo.avatarUrl : require('@/assets/icon/avatar_default.svg')}
          />
          <Flex align="start" direction="column">
            <Typography.Text className="mb10" type="light" size="xl">
              {isLogin ? userInfo.nickName : '未登录'}
            </Typography.Text>
            <Button onClick={onLoginClick} circle outline type="light" size="xs">
              {isLogin ? '编辑资料' : '立即登录'}
            </Button>
          </Flex>
        </Flex>
        {/* 需要对应身份 */}
        {isLogin && (
          <>
            {/* 歌手或者词曲作者 */}
            {+page.identity > 0 && (
              <Flex className="me-header__action mb40" justify="evenly">
                <Button onClick={onSellClick} className="me-header__action-btn" type="light" circle>
                  <Icon icon="icon-wode_icon_chushou" className="me-header__action-btn__icon" />
                  出售词曲
                </Button>
                <Button className="me-header__action-btn" type="light" circle>
                  <Icon icon="icon-wode_icon_guanli" className="me-header__action-btn__icon" />
                  词曲管理
                </Button>
              </Flex>
            )}
            <View className="me-service">
              <Flex className="me-service__header">我的服务</Flex>
              <Flex justify="around" wrap="wrap" className="me-service__body">
                {+page.identity === 1 && (
                  <Flex className="me-service__item" direction="column">
                    <Icon
                      icon="icon-wode_icon_renzheng"
                      className="me-service__item__img"
                      color="#ED513B"
                    />
                    <Typography.Text>歌手认证</Typography.Text>
                  </Flex>
                )}
                {+page.identity === 2 && (
                  <>
                    <Flex className="me-service__item" direction="column">
                      <Icon
                        icon="icon-wode_icon_yaochang"
                        className="me-service__item__img"
                        color="#ED513B"
                      />
                      <Typography.Text>我要唱</Typography.Text>
                    </Flex>
                    <Flex className="me-service__item" direction="column">
                      <Icon
                        icon="icon-wode_icon_zhizuo"
                        className="me-service__item__img"
                        color="#FFBB24"
                      />
                      <Typography.Text>歌曲制作</Typography.Text>
                    </Flex>
                  </>
                )}
                <Flex className="me-service__item" direction="column">
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
        <Typography.Text className="mb30" type="light">
          请选择以下身份进行入驻
        </Typography.Text>
        <View className="me-card">
          <Button
            openType={isLogin && page.mobile ? 'getPhoneNumber' : undefined}
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
                {page?.audit_info?.identity === 1 && (
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
            openType={isLogin && page.mobile ? 'getPhoneNumber' : undefined}
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
                {page?.audit_info?.identity === 2 && (
                  <Typography.Text className="ml10" type="primary">
                    审核中
                  </Typography.Text>
                )}
              </Flex>
              <Typography.Text>我是歌手，我要唱歌！</Typography.Text>
            </View>
            <Icon icon="icon-icon_jinru" className="me-card-item__action" />
          </Button>
          <Flex className="me-card-item">
            <Icon icon="icon-wode_icon_jigou" className="me-card-item__icon" />
            <View className="me-card-item__content">
              <Typography.Title level={3} className="me-card-item__title">
                机构（后续开放）
              </Typography.Title>
              <Typography.Text>我是唱片公司/厂牌，我要发行歌曲</Typography.Text>
            </View>
            <Icon icon="icon-icon_jinru" className="me-card-item__action" />
          </Flex>

          <View className="me-bottom">
            <Typography.Link className="me-bottom__link">为什么入驻娱当家?</Typography.Link>

            <Flex className="me-bottom__action" justify="center">
              <Typography.Link>联系客服</Typography.Link>
              <View style={{ margin: '0 5px' }}>|</View>
              <Typography.Link>投诉侵权</Typography.Link>
            </Flex>
          </View>
        </View>
      </View>
      <AtModal isOpened={visible} onClose={() => closeModal()}>
        <AtModalHeader>出售词曲流程</AtModalHeader>
        <AtModalContent>
          <CircleIndexList data={sellStepData} />

          <View className="px24">
            <Button onClick={goToSellPage} className="mb20" circle type="primary">
              继续
            </Button>
            <Typography.Text center onClick={() => closeModal(true)}>
              不再提示
            </Typography.Text>
          </View>
        </AtModalContent>
      </AtModal>
      <CustomTabBar />
    </>
  );
};
