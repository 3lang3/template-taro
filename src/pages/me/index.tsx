import CustomTabBar from '@/components/CustomTabBar';
import Flex from '@/components/Flex';
import Tag from '@/components/Tag';
import Typography from '@/components/Typography';
import { Image, View } from '@tarojs/components';
import './index.less';

export default () => {
  return (
    <>
      <View className="page-me">
        <Flex className="me-header">
          <Image className="me-header__avatar" src={require('@/assets/icon/avatar_default.svg')} />
          <Flex align="start" direction="column">
            <Typography.Text className="mb10" type="light" size="lg">
              未登录
            </Typography.Text>
            <Tag type="light">立即登录</Tag>
          </Flex>
        </Flex>
        <Typography.Text className="mb30" type="light">
          请选择以下身份进行入驻
        </Typography.Text>
        <Flex className="me-header__action mb40" justify="evenly">
          <Flex className="me-header__action-btn" justify="center">
            <Image
              className="me-header__action-btn__icon"
              src={require('@/assets/me/me_action_1.svg')}
            />
            出售词曲
          </Flex>
          <Flex className="me-header__action-btn" justify="center">
            <Image
              className="me-header__action-btn__icon"
              src={require('@/assets/me/me_action_2.svg')}
            />
            词曲管理
          </Flex>
        </Flex>
        <View className="me-service">
          <Flex className="me-service__header">我的服务</Flex>
          <Flex justify="around" wrap="wrap" className="me-service__body">
            <Flex className="me-service__item" direction="column">
              <Image
                className="me-service__item__img"
                src={require('@/assets/me/me_service_auth.svg')}
              />
              <Typography.Text>歌手认证</Typography.Text>
            </Flex>
            <Flex className="me-service__item" direction="column">
              <Image
                className="me-service__item__img"
                src={require('@/assets/me/me_service_sing.svg')}
              />
              <Typography.Text>我要唱</Typography.Text>
            </Flex>
            <Flex className="me-service__item" direction="column">
              <Image
                className="me-service__item__img"
                src={require('@/assets/me/me_service_make.svg')}
              />
              <Typography.Text>歌曲制作</Typography.Text>
            </Flex>
            <Flex className="me-service__item" direction="column">
              <Image
                className="me-service__item__img"
                src={require('@/assets/me/me_service_help.svg')}
              />
              <Typography.Text>帮助</Typography.Text>
            </Flex>
            <View className="me-service__item--fake" />
            <View className="me-service__item--fake" />
          </Flex>
        </View>
        <View className="me-card">
          <Flex className="me-card-item">
            <Image className="me-card-item__icon" src={require('@/assets/me/me_card_1.svg')} />
            <View className="me-card-item__content">
              <Flex className="me-card-item__title">
                <Typography.Title level={3} style={{ marginBottom: 0 }}>
                  词曲作者
                </Typography.Title>
                <Typography.Text className="ml10" type="primary">审核中</Typography.Text>
              </Flex>
              <Typography.Text>我是词曲作者，我要出售词曲demo</Typography.Text>
            </View>
            <Image className="me-card-item__action" src={require('@/assets/icon/right_thin.svg')} />
          </Flex>
          <Flex className="me-card-item">
            <Image className="me-card-item__icon" src={require('@/assets/me/me_card_2.svg')} />
            <View className="me-card-item__content">
              <Typography.Title level={3} className="me-card-item__title">
                歌手/校园歌手
              </Typography.Title>
              <Typography.Text>我是歌手，我要唱歌！</Typography.Text>
            </View>
            <Image className="me-card-item__action" src={require('@/assets/icon/right_thin.svg')} />
          </Flex>
          <Flex className="me-card-item">
            <Image className="me-card-item__icon" src={require('@/assets/me/me_card_3.svg')} />
            <View className="me-card-item__content">
              <Typography.Title level={3} className="me-card-item__title">
                机构（后续开放）
              </Typography.Title>
              <Typography.Text>我是唱片公司/厂牌，我要发行歌曲</Typography.Text>
            </View>
            <Image className="me-card-item__action" src={require('@/assets/icon/right_thin.svg')} />
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
      <CustomTabBar />
    </>
  );
};
