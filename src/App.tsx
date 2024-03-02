import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import History from './Pages/History';
import Header from './Components/header/Header';
import Main from './Pages/Main';

const App: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  });
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [allPhotosLoaded, setAllPhotosLoaded] = useState<boolean>(false);
  const [photoStats, setPhotoStats] = useState<any | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isHistoryVisible, setHistoryVisible] = useState<boolean>(false);

  const openModal = (photo: any) => {
    setSelectedPhoto(photo);
    fetchPhotoStats(photo.id);
    setModalVisible(true);
  };

  const toggleBodyScroll = (disable: boolean) => {
    if (disable) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  };

  useEffect(() => {
    if (modalVisible) {
      toggleBodyScroll(true);
    } else {
      toggleBodyScroll(false);
    }

    return () => toggleBodyScroll(false);
  }, [modalVisible]);

  const closeModal = () => {
    setSelectedPhoto(null);
    setModalVisible(false);
  };

  const fetchPhotoStats = (photoId: string) => {
    fetch(`https://api.unsplash.com/photos/${photoId}/statistics`, {
      headers: {
        Authorization: 'Client-ID J1eMJytkUYok1kW5qMLrY2Vg7wNcqXZB0BsFAcitWdc',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch photo statistics: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setPhotoStats(data);
      })
      .catch((error) => {
        console.error('Error fetching photo statistics:', error);
      });
  };

  const fetchPhotos = useCallback(() => {
    if (allPhotosLoaded) return;
    const cacheKey = `photos-${query}-${page}`;
    const cachedData = localStorage.getItem(cacheKey);

    try {
      if (cachedData !== null) {
        const parsedData = JSON.parse(cachedData);
        setPhotos((prevPhotos) => [...prevPhotos, ...parsedData]);
        setPage((prevPage) => prevPage + 1);
        return;
      }
    } catch (error) {
      console.error('Error parsing cached photos:', error);
      localStorage.removeItem(cacheKey);
    }

    setLoading(true);
    let url = `https://api.unsplash.com/photos?per_page=20&page=${page}&order_by=popular`;
    if (query && query.length > 2) {
      url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=20`;
    }

    fetch(url, {
      headers: {
        Authorization: 'Client-ID J1eMJytkUYok1kW5qMLrY2Vg7wNcqXZB0BsFAcitWdc',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newPhotos = query ? data.results : data;
        localStorage.setItem(cacheKey, JSON.stringify(newPhotos));
        if (newPhotos.length > 0) {
          setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setAllPhotosLoaded(true);
        }
      })
      .catch((error) => console.error('Error fetching photos:', error))
      .finally(() => setLoading(false));
  }, [page, query, allPhotosLoaded]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const handleSearch = debounce(() => {
      setPage(1);
      setPhotos([]);
      setAllPhotosLoaded(false);
      fetchPhotos();
    }, 500);
    handleSearch();
  }, [query]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setTimeout(() => {
      if (newQuery.length > 2) {
        setQuery(newQuery);

        if (newQuery.trim() && !searchHistory.includes(newQuery)) {
          const updatedHistory = [...searchHistory, newQuery];
          setSearchHistory(updatedHistory);
          localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        }
      }
    }, 850);
  };

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100;
      if (nearBottom && !loading && !allPhotosLoaded) {
        fetchPhotos();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, fetchPhotos, allPhotosLoaded]);

  const onHistoryItemClick = (query: string) => {
    setHistoryVisible(true);
    setQuery(query);
  };

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Main
                photos={photos}
                photoStats={photoStats}
                closeModal={closeModal}
                openModal={openModal}
                selectedPhoto={selectedPhoto}
                handleSearchInput={handleSearchInput}
                loading={loading}
                modalVisible={modalVisible}
              />
            }
          />
          <Route
            path="/history"
            element={
              <History
                photos={photos}
                photoStats={photoStats}
                closeModal={closeModal}
                openModal={openModal}
                selectedPhoto={selectedPhoto}
                loading={loading}
                modalVisible={modalVisible}
                searchHistory={searchHistory}
                onHistoryItemClick={onHistoryItemClick}
                isHistoryVisible={isHistoryVisible}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
