import cls from 'classnames';
import { useSelector } from 'react-redux';
import Flex from '@/components/Flex';
import Button from '@/components/Button';
import Image from '@/components/Image';
import { useRef, useState } from 'react';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import CustomNavigation from '@/components/CustomNavigation';
import Typography from '@/components/Typography';
import { View, Text } from '@tarojs/components';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import {
  getImageInfo,
  navigateBack,
  saveImageToPhotosAlbum,
  showModal,
  showToast,
  useRouter,
  useShareAppMessage,
} from '@tarojs/taro';
import Icon from '@/components/Icon';
import AuthWrapper from '@/components/AuthWrapper';
import { IDENTITY } from '@/config/constant';
import { useRequest } from 'ahooks';
import {
  getSongDetail,
  getSaleSongDetail,
  abandonMusicSong,
  operationMusicSongPrice,
  applyWantSong,
} from '@/services/song';
import config from '@/config';
import CustomSwiper from '@/components/CustomSwiper';
import { getHttpPath } from '@/utils/utils';
import Tag from '@/components/Tag';
import ChangePriceModal from '@/components/ChangePriceModal';
import type { ChangePriceModalType } from '@/components/ChangePriceModal';
import { processLyricData } from './components/helper';
import { PlayCore } from './components';

import './index.less';

const AUDIO_DEMO_URL = 'http://music.163.com/song/media/outer/url?id=1847422867.mp3';

type PageContentProps = {
  detail: Record<string, any>;
  routerParams: PlayDetailParams;
};

const PageContent = ({ detail, routerParams }: PageContentProps) => {
  const userData = useSelector((state) => state.common.data);
  const navigation = useSelector((state: any) => state.navigation);
  const { identity, config: configData } = userData;
  // 还价modal ref
  const counterOfferRef = useRef<ChangePriceModalType>(null);
  // 背景图
  const bgImg = detail.album_image || configData.default_music_img;

  useShareAppMessage(({ from }) => {
    if (from === 'button') {
      return {
        title: `${detail.song_name}-${detail.singer.join('、')}`,
        imageUrl: getHttpPath(bgImg),
      };
    }
    return {};
  });

  // 还价
  const onCounterOfferClick = () => {
    counterOfferRef.current?.show({
      composer_price: +detail.composer_final_price
        ? detail.composer_final_price
        : detail.composer_original_price,
      lyricist_price: +detail.lyricist_final_price
        ? detail.lyricist_final_price
        : detail.lyricist_original_price,
    });
  };
  // 还价提交
  const onCounterOfferConfirm = async (values) => {
    showToast({ icon: 'loading', title: '提交中' });
    const { msg } = await operationMusicSongPrice({
      ids: detail.ids,
      ...values,
      operation_type: 2,
    });
    showToast({ icon: 'success', title: msg });
    counterOfferRef.current?.close();
  };

  /** 词曲制作详情页面 */
  const isScorePage = routerParams.type === 'score';
  /** 是否机构身份 */
  const isCompanyIdentity = +identity === IDENTITY.COMPANY;
  /** 主视图高度 */
  const mainViewHeight = isScorePage
    ? `calc(100vh - 148rpx - ${navigation.navBarHeight}px)`
    : '100%';

  return (
    <>
      {/* 自定义navigation */}
      <CustomNavigation title={detail.song_name} smallTitle />
      {/* navigation占位符 */}
      <View style={{ height: navigation.navBarHeight }} />
      {/* blur效果层 */}
      <View className="play-detail--blur" />
      {/* 背景图片层 */}
      <View
        className="play-detail--bg"
        style={{
          backgroundImage: bgImg ? `url(${config.cdn}/${bgImg})` : undefined,
        }}
      />
      {/* 主视图 */}
      <View className="play-detail__page" style={{ top: navigation.navBarHeight }}>
        <View
          className={cls('play-detail', {
            'play-detail--score': isScorePage,
          })}
          style={{
            height: mainViewHeight,
          }}
        >
          <View
            className={cls('play-detail__header', {
              'play-detail__header--music': isCompanyIdentity || !isScorePage,
              'play-detail__header--score': isScorePage && !isCompanyIdentity,
            })}
          >
            {isCompanyIdentity && isScorePage && (
              <Flex className="p-default bg-white mb30" justify="center">
                {+detail.composer_final_price ? (
                  <>
                    <Typography.Text>
                      原: 曲 {detail.composer_original_price}元 | 词{detail.lyricist_original_price}
                      元
                    </Typography.Text>
                    <Typography.Text type="primary">
                      新: 曲 {detail.composer_final_price}元 | 词{detail.lyricist_final_price}元
                    </Typography.Text>
                  </>
                ) : (
                  <Typography.Text type="primary">
                    曲{detail.composer_original_price}元 | 词{detail.lyricist_original_price}元
                  </Typography.Text>
                )}
              </Flex>
            )}
            {isScorePage ? (
              <>
                {Array.isArray(detail.tag) && detail.tag.length > 0 && (
                  <Flex wrap="wrap" align="center" justify="center" className="play-detail__tags">
                    {detail.tag.map((el, i) => (
                      <Tag className="mb10" key={i} type="light">
                        {el}
                      </Tag>
                    ))}
                  </Flex>
                )}
              </>
            ) : (
              <>
                <Typography.Text type="light" className="play-detail__author">
                  {detail.singer.join('、')}
                </Typography.Text>
                <Icon
                  openType="share"
                  icon="icon-shouye_zhaunji_fenxiang"
                  className="play-detail__share"
                />
              </>
            )}
          </View>
          <PlayCore
            src={detail.url ? `${config.cdn}/${detail.url}` : AUDIO_DEMO_URL}
            title={detail.song_name}
            singer={detail.singer}
            epname={detail.album_name}
            cover={bgImg}
            lyricData={processLyricData(isScorePage ? detail.lyricist_content : detail.lrc_lyric)}
            lyricAutoScroll={routerParams.type !== 'score'}
          />
        </View>
        {isScorePage && (
          <>
            <View className="play-detail-desc">
              <Flex justify="between" className="play-detail-desc__title">
                <Typography.Title level={3} style={{ marginBottom: 0 }}>
                  词曲说明
                </Typography.Title>
                <ScoreButton detail={detail} />
              </Flex>
              <View className="play-detail-desc__content">
                <View className="play-detail-desc__content-item">
                  <Text className="play-detail-desc__content-title">作品简介:</Text>
                  <Text>{detail.introduce}</Text>
                </View>
                <View className="play-detail-desc__content-item">
                  <Text className="play-detail-desc__content-title">创作说明:</Text>
                  <Text>{detail.explain}</Text>
                </View>
              </View>
            </View>
            <Flex justify="center" className="play-detail-action">
              {isCompanyIdentity ? (
                <>
                  <GiveUpButton routerParams={routerParams} />
                  {+detail.is_change_price ? (
                    <Button
                      onClick={() => onCounterOfferClick()}
                      className="play-detail-action__btn"
                      full
                      type="primary"
                      size="lg"
                      circle
                    >
                      还价
                    </Button>
                  ) : null}
                </>
              ) : (
                <ApplySingButton detail={detail} />
              )}
            </Flex>
            <View className="play-detail-action--placeholder" />
          </>
        )}
      </View>
      <ChangePriceModal ref={counterOfferRef} onConfirm={onCounterOfferConfirm} />
    </>
  );
};

type PlayDetailParams = {
  /**
   * 页面类型
   * - music 已制作完成歌曲播放页面(自动滚动歌词)
   * - score 词曲制作页面(根据身份展示不同视图)
   */
  type: 'score';
  ids: string;
};

function getRequest(pageType) {
  if (pageType === 'score') return getSaleSongDetail;
  return getSongDetail;
}

const PageContentWrapper = () => {
  const { params } = useRouter<PlayDetailParams>();
  const {
    loading,
    error,
    refresh,
    data: { data } = { data: {} },
  } = useRequest(getRequest(params.type), {
    defaultParams: [{ ids: params.ids }],
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return <PageContent detail={data} routerParams={params} />;
};

export default () => (
  <AuthWrapper>
    <PageContentWrapper />
  </AuthWrapper>
);

// 曲谱按钮 modal
function ScoreButton({ detail }) {
  const [visible, set] = useState(false);
  return (
    <>
      <Button marginAuto={false} circle outline type="primary" size="xs" onClick={() => set(true)}>
        <Icon icon="icon-icon_qupu" />
        曲谱
      </Button>
      <AtModal isOpened={visible} onClose={() => set(false)} className="modal-score">
        <AtModalHeader>曲谱</AtModalHeader>
        <AtModalContent>
          <CustomSwiper
            className="modal-score__swiper__wrapper"
            swiperClassName="modal-score__swiper"
            data={detail.composer_content || []}
            itemRender={(img) => (
              <Image
                onLongPress={async () => {
                  try {
                    const { path } = await getImageInfo({ src: getHttpPath(img) });
                    saveImageToPhotosAlbum({
                      filePath: path,
                      success: () => {
                        showToast({ icon: 'success', title: '保存成功' });
                      },
                    });
                  } catch (error) {
                    showToast({ icon: 'none', title: error.message });
                  }
                }}
                className="modal-score__img"
                src={img}
              />
            )}
          />
          <Typography.Text type="secondary" size="sm">
            长按保存图片
          </Typography.Text>
        </AtModalContent>
      </AtModal>
    </>
  );
}

// 申请唱歌按钮
function ApplySingButton({ detail }) {
  const [status, setStatus] = useState<number>(() => +detail.apply_status);
  // 申请唱歌
  const onSongApply = async () => {
    showToast({ icon: 'loading', title: '申请中...', mask: true });
    const { msg } = await applyWantSong({ ids: detail.ids });
    setStatus(1);
    showToast({ icon: 'success', title: msg });
  };
  // 取消申请
  const onCancelApplay = async () => {
    showToast({ icon: 'loading', title: '取消中...', mask: true });
    const { msg } = await applyWantSong({ ids: detail.ids });
    setStatus(0);
    showToast({ icon: 'success', title: msg });
  };
  const onButtonClick = async () => {
    if (status === 2) return;
    if (status === 1) {
      const modalRes = await showModal({ title: '注意', content: '确定要取消申请吗？' });
      if (modalRes.confirm) {
        onCancelApplay();
      }
      return;
    }
    onSongApply();
  };
  return (
    <>
      <Button onClick={onButtonClick} circle full size="lg" type="primary">
        {(() => {
          if (+status === 1) return '已申请';
          if (+status === 2) return '已有歌手唱';
          return '申请唱歌';
        })()}
      </Button>
    </>
  );
}

// 放弃按钮 modal
function GiveUpButton({ routerParams }) {
  const [visible, set] = useState(false);
  const onConfirm = async () => {
    showToast({ icon: 'loading', title: '确认中...', mask: true });
    const { msg } = await abandonMusicSong({ ids: routerParams.ids });
    showToast({ icon: 'success', title: msg });
    setTimeout(() => navigateBack(), 1500);
  };
  return (
    <>
      <Button
        onClick={() => set(true)}
        className="play-detail-action__btn"
        full
        type="secondary"
        size="lg"
        circle
      >
        放弃收购
      </Button>
      <AtModal isOpened={visible} onClose={() => set(false)}>
        <AtModalHeader>确定放弃收购该词曲嘛?</AtModalHeader>
        <AtModalAction>
          <Flex justify="between" className="p-default pb40">
            <Button outline circle onClick={() => set(false)}>
              取消
            </Button>
            <Button type="primary" circle onClick={() => onConfirm()}>
              确定
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}
