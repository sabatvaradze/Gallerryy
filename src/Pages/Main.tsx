// Main.tsx
import React, { FC } from 'react';
import Modal from '../Components/modal/Modal';
import './main.css';

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


interface MainProps {
  photos: Photo[] | null;
  photoStats: any;
  closeModal: () => void;
  openModal: (photo: Photo) => void;
  selectedPhoto: Photo;
  handleSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  modalVisible: boolean;
}

const Main: FC<MainProps> = ({
  photos,
  photoStats,
  closeModal,
  openModal,
  selectedPhoto,
  handleSearchInput,
  loading,
  modalVisible,
}) => {
  return (
    <div className="main-div">
      <input
        className="search"
        type="text"
        placeholder="Search"
        onChange={handleSearchInput}
      />
      <div className="photos-container">
        {photos &&
          photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.urls.small}
              alt={photo.alt_description || 'Photo'}
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

export default Main;
