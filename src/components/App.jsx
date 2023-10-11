import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import { fetchImages } from '../services/Api';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import { Audio } from 'react-loader-spinner';
import Modal from './Modal/Modal';
import styles from './styles.module.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (query.trim() === '') return;
    setLoading(true);
    fetchImages(query, page)
      .then(data => {
        if (data.totalHits === 0) return;
        setImages(prevImages => [...prevImages, ...data.hits]);
        setTotalImages(data.totalHits);
      })
      .catch(() => {
        setError('An error occurred while processing the request');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, page]);

  const handleSubmit = newQuery => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
    setTotalImages(0);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = (largeImageURL, altText) => {
    setShowModal(true);
    setSelectedImage(largeImageURL);
    setAlt(altText);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
    setAlt('');
  };

  const noResultsMessage =
    totalImages === 0 && query.trim() !== '' && !loading ? (
      <p className={styles.NoResults}>
        No results found for your query. 🙁 Please try again.
      </p>
    ) : null;

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleSubmit} query={query} />
      {loading ? (
        <div className={styles.LoaderContainer}>
          <Audio
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        </div>
      ) : null}

      {error ? (
        <p className={styles.Error}>
          An error occurred while processing the request
        </p>
      ) : null}

      {images.length > 0 && (
        <ImageGallery images={images} onClick={handleImageClick} />
      )}
      {totalImages !== images.length && <Button onLoadMore={handleLoadMore} />}

      {showModal && (
        <Modal
          largeImageURL={selectedImage}
          alt={alt}
          onClose={handleCloseModal}
        />
      )}

      {noResultsMessage}
    </div>
  );
};

export default App;
