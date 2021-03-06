import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MdMovieCreation, MdLiveTv } from 'react-icons/md';
import { useParams, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';

import { LoadMore, HeaderContainer } from './../../sharedStyledComponents';
import {
  TypeListUlContainer,
  TypeButton,
  TopDataSortButtonsContainer,
  TopStreamsContainer,
  Container,
} from './styledComponents';
import ClipsSortButton from './../channelPage/ClipsSortButton';
import GameSearchBar from './GameSearchBar';
import GetTopClips from './GetTopClips';
import GetTopStreams from './GetTopStreams';
import GetTopVideos from './GetTopVideos';
import LoadingBoxes from './../LoadingBoxes';
import SortButton from './../channelPage/SortButton';
import StreamEle from './../live/StreamElement';
import ClipElement from './../channelPage/ClipElement';
import VodElement from './../vods/VodElement';
import { getCookie } from '../../../util/Utils';
import AccountContext from '../../account/AccountContext';
import useQuery from '../../../hooks/useQuery';
import useToken from '../useToken';
import API from '../API';

export default () => {
  const { category } = useParams();
  const { p_videoType } = useLocation().state || {};
  const [topData, setTopData] = useState([]);
  const [gameInfo, setGameInfo] = useState({ name: category });
  const URLQueries = useQuery();
  const [videoType, setVideoType] = useState(
    URLQueries.get('type')?.toLowerCase() || p_videoType || 'streams'
  );
  const [typeListOpen, setTypeListOpen] = useState();
  const [loadmoreLoaded, setLoadmoreLoaded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Views');
  const [sortByTime, setSortByTime] = useState(
    parseInt(URLQueries.get('within')?.toLowerCase()) || null
  );
  // eslint-disable-next-line no-unused-vars
  const { twitchToken } = useContext(AccountContext);
  const oldTopData = useRef();
  const validateToken = useToken();

  document.title = `${category || 'All'} - Top ${videoType}`;

  const videoElementTypeComp = (data) => {
    switch (videoType) {
      case 'streams':
        return <StreamEle data={data} />;
      case 'clips':
        return <ClipElement data={data} />;
      case 'videos':
        return <VodElement data={data} />;
      default:
        return <StreamEle data={data} />;
    }
  };

  const fetchVideosDataHandler = (res, shouldLoadMore) => {
    if (shouldLoadMore) {
      const allTopData = oldTopData.current.data.concat(res.topData.data);
      oldTopData.current = {
        data: allTopData,
        pagination: res.topData.pagination,
      };

      setLoadmoreLoaded(true);
      setTopData(allTopData);
    } else {
      oldTopData.current = res.topData;
      setTopData(res.topData.data);
      setRefreshing(false);
    }
  };

  const fetchVideos = useCallback(
    (shouldLoadMore) => {
      setError(null);
      if (shouldLoadMore) setLoadmoreLoaded(false);

      switch (videoType) {
        case 'streams':
          GetTopStreams(category, shouldLoadMore && oldTopData.current)
            .then((res) => {
              fetchVideosDataHandler(res, shouldLoadMore);
            })
            .catch((e) => {
              if ((e.message = 'game is undefined')) {
                setError('Invalid game name');
              } else {
                setError(e.message);
              }
              setRefreshing(false);
            });
          break;
        case 'clips':
          GetTopClips(category, sortByTime, oldTopData.current)
            .then((res) => {
              fetchVideosDataHandler(res, shouldLoadMore);
            })
            .catch((e) => {
              if ((e.message = 'game is undefined')) {
                setError('Invalid game name');
              } else {
                setError(e.message);
              }
              setRefreshing(false);
            });
          break;
        case 'videos':
          GetTopVideos(category, sortBy, oldTopData.current)
            .then((res) => {
              fetchVideosDataHandler(res, shouldLoadMore);
            })
            .catch((e) => {
              if ((e.message = 'game is undefined')) {
                setError('Invalid game name');
              } else {
                setError(e.message);
              }
              setRefreshing(false);
            });
          break;
        default:
          GetTopStreams(category, shouldLoadMore && oldTopData.current)
            .then((res) => {
              fetchVideosDataHandler(res, shouldLoadMore);
            })
            .catch((e) => {
              if ((e.message = 'game is undefined')) {
                setError('Invalid game name');
              } else {
                setError(e.message);
              }
              setRefreshing(false);
            });
      }
    },
    [category, sortBy, sortByTime, videoType]
  );

  const videoTypeBtnOnClick = (type) => {
    setTopData([]);
    oldTopData.current = null;
    setVideoType(type);
    setTypeListOpen(false);
  };

  const refresh = useCallback(() => {
    setRefreshing(true);
    oldTopData.current = null;
    validateToken().then(() => fetchVideos());
  }, [fetchVideos, validateToken]);

  useEffect(() => {
    (async () => {
      const gameInfo = await API.getGames({ params: { name: category } }).then(
        (res) => res.data.data[0]
      );
      setGameInfo(gameInfo);
    })();
  }, [category]);

  useEffect(() => {
    setRefreshing(true);
    setTopData([]);
    validateToken().then(() => fetchVideos());
  }, [fetchVideos, validateToken]);

  return !getCookie('Twitch-access_token') ? (
    error && (
      <Alert
        variant='warning'
        style={{ textAlign: 'center', width: '25%', margin: 'auto', marginTop: '50px' }}
        dismissible
        onClose={() => setError(null)}
      >
        <Alert.Heading>Need to connect to Twitch</Alert.Heading>
        <hr />
        <p>No Twitch access token found.</p>
      </Alert>
    )
  ) : (
    <CSSTransition
      in={typeof getCookie('Twitch-access_token') === 'string'}
      timeout={750}
      classNames='fade-750ms'
      appear
    >
      <Container>
        <HeaderContainer
          text={
            <>
              {gameInfo?.box_art_url ? (
                <img
                  src={gameInfo.box_art_url?.replace('{width}', 130)?.replace('{height}', 173)}
                  alt=''
                />
              ) : (
                <div className='imgPlaceholder'></div>
              )}
              {gameInfo.name || 'Top'} - {videoType}
              {!videoType || videoType === 'streams' ? (
                <MdLiveTv size={25} />
              ) : (
                <MdMovieCreation size={25} />
              )}
            </>
          }
          isLoading={refreshing}
          refreshFunc={refresh}
          rightSide={
            <TopDataSortButtonsContainer>
              <GameSearchBar gameName={category} videoType={videoType} />
              <div>
                <TypeButton
                  title={category ? `Fetch top ${videoType}` : 'Select a game/category first'}
                  disabled={category ? false : true}
                  onClick={() => {
                    setTypeListOpen(!typeListOpen);
                  }}
                >
                  {!videoType || videoType === 'streams' ? (
                    <MdLiveTv size={20} />
                  ) : (
                    <MdMovieCreation size={22} />
                  )}
                  {videoType}
                </TypeButton>

                {typeListOpen && (
                  <TypeListUlContainer>
                    <Link
                      to='?type=streams'
                      onClick={() => {
                        videoTypeBtnOnClick('streams');
                      }}
                    >
                      <MdLiveTv size={24} />
                      Streams
                    </Link>
                    <Link
                      to='?type=clips'
                      onClick={() => {
                        videoTypeBtnOnClick('clips');
                        setSortBy('Views');
                      }}
                    >
                      <MdMovieCreation size={24} />
                      Clips
                    </Link>
                  </TypeListUlContainer>
                )}
              </div>

              {videoType === 'videos' ? (
                <SortButton sortBy={sortBy} setSortBy={setSortBy} setData={setTopData} />
              ) : videoType === 'clips' ? (
                <ClipsSortButton
                  sortBy={sortByTime}
                  setSortBy={setSortByTime}
                  setData={setTopData}
                  resetOldData={() => {
                    oldTopData.current = null;
                  }}
                />
              ) : null}
            </TopDataSortButtonsContainer>
          }
        ></HeaderContainer>

        {error ? (
          <Alert
            variant='warning'
            style={{ textAlign: 'center', width: '25%', margin: 'auto' }}
            dismissible
            onClose={() => setError(null)}
          >
            <Alert.Heading>{error}</Alert.Heading>
          </Alert>
        ) : (
          <TopStreamsContainer>
            <>
              <LoadingBoxes
                amount={Math.floor(((window.innerWidth - 150) / 350) * 1.5)}
                load={!topData || topData.length <= 0}
                type='big'
              />

              <TransitionGroup className='twitch-top-live' component={null}>
                {topData?.map((stream) => {
                  return (
                    <CSSTransition
                      key={stream.id}
                      timeout={{
                        appear: 500,
                        enter: 500,
                        exit: 0,
                      }}
                      classNames='fade-500ms'
                      unmountOnExit
                    >
                      {videoElementTypeComp(stream)}
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>

              <LoadMore
                text='Load more'
                show={topData?.length}
                onClick={() => fetchVideos(true)}
                loaded={loadmoreLoaded}
              />
            </>
          </TopStreamsContainer>
        )}
      </Container>
    </CSSTransition>
  );
};
