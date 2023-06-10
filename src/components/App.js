import { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ link: '', name: '' });
  const [currentUser, setCurrentUser] = useState({ name: '', about: '', avatar: '', _id: '' });
  const [cards, setCards] = useState([]);
  const [isLoadingEditProfile, setIsLoadingEditProfile] = useState(false);
  const [isLoadingAddPlace, setIsLoadingAddPlace] = useState(false);
  const [isLoadingEditAvatar, setIsLoadingEditAvatar] = useState(false);
  const [isLoadingConfirmDelete, setIsLoadingConfirmDelete] = useState(false);
  const [focusCardDelete, setFocusCardDelete] = useState(null);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setSelectedCard({ link: '', name: '' })
  }

  const handleCardLike = (currCard) => {
    const isLiked = currCard.likes.some((like) => like._id === currentUser._id);
    
    !isLiked
      ? api.sendLike(currCard._id)
          .then((newCard) => {
            setCards((prevState) => prevState.map((card) => card._id === currCard._id ? newCard : card));
          })
          .catch((err) => console.log(err))
      : api.deleteLike(currCard._id)
          .then((newCard) => {
            setCards((prevState) => prevState.map((card) => card._id === currCard._id ? newCard : card));
          })
          .catch((err) => console.log(err));
  };

  const handleCardDelete = () => {
    setIsLoadingConfirmDelete(true);

    api.deleteCard(focusCardDelete._id)
      .then(() => {
        setCards((prevState) => prevState.filter((card) => card._id !== focusCardDelete._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingConfirmDelete(false));
  };
  
  const handleUpdateUser = (user) => {
    setIsLoadingEditProfile(true);
    api.updateUserInfo(user)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingEditProfile(false));
  };

  const handleUpdateAvatar = (avatar) => {
    setIsLoadingEditAvatar(true);
    api.updateUserAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingEditAvatar(false));
  };

  const handleAddPlace = (dataCard) => {
    setIsLoadingAddPlace(true);
    api.sendCard(dataCard)
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingAddPlace(false));
  };

  const handleOpenConfirmDeletePopup = (currCard) => {
    setIsConfirmDeletePopupOpen(true);
    setFocusCardDelete(currCard);
  };

  useEffect(() => {
    api.getUserInfo()
      .then(({ name, about, avatar, _id }) => {
        setCurrentUser({ name, about, avatar, _id });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api.getCards()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(err));
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>

      <Header />
      <Main
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onOpenConfirmDeletePopup={handleOpenConfirmDeletePopup}
        cards={cards}
      />
      <Footer />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoadingEditProfile} />
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} isLoading={isLoadingAddPlace} />
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoadingEditAvatar} />
      <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete} isLoading={isLoadingConfirmDelete}/>
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

    </CurrentUserContext.Provider>
  );
}

export default  App;
