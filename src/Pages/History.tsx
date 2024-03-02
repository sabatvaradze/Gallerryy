// History.tsx
import React, { FC } from 'react';
import Modal from '../Components/modal/Modal';
import './history.css';

interface Photo {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  description?: string;
  alt_description?: string;
  likes?: number;
}

interface HistoryProps {
  searchHistory: string[];
  onHistoryItemClick: (item: string) => void;
  photos: Photo[] | null;
  photoStats: any;
  closeModal: () => void;
  openModal: (photo: Photo) => void;
  selectedPhoto: Photo;
  loading: boolean;
  modalVisible: boolean;
  isHistoryVisible: boolean;
}

const History: FC<HistoryProps> = ({
  searchHistory,
  onHistoryItemClick,
  photos,
  photoStats,
  closeModal,
  openModal,
  selectedPhoto,
  loading,
  modalVisible,
  isHistoryVisible,
}) => {
  return (
    <div className="history-container">
      <div className="history-list-container">
        <ul className="history-list">
          {searchHistory.map((item, index) => (
            <li
              key={index}
              className="history-item"
              onClick={() => onHistoryItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="photos-container">
        {photos &&
          isHistoryVisible &&
          photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.urls.small}
              alt={photo.alt_description || 'Photo'} // Updated to alt_description
              onClick={() => openModal(photo)}
            />
          ))}
        {loading && (
          <div className="loading">
            <h1>Loading...</h1>
          </div>
        )}
      </div>

      <Modal
        visible={modalVisible}
        photo={selectedPhoto}
        photoStats={photoStats}
        closeModal={closeModal}
      />
    </div>
  );
};

export default History;
