import {useEffect, useState} from 'react';
import { api } from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.toggleCardLike(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id ===card._id ? newCard : c))
    }).catch((err) => console.log(err))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id))
    }).catch((err) => console.log(err))
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard({});
  }

    function handleEditAvatarClick() {
      setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
      setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
      setIsAddPlacePopupOpen(true);
    }

    function handleUpdateUser({ name, about }) {
      api.patchUserInfo({ name, about }).then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      }).catch((err) => console.log(err))
    }

    function handleUpdateAvatar({avatar}) {
      api.patchAvatar({avatar: avatar}).then((link) => {
        setCurrentUser(link);
        closeAllPopups();
      }).catch((err) => console.log(err))
    }

    function handleAddPlaceSubmit({ name, link }) {
      api.postCard({name: name, link: link})
          .then((res) => {
            setCards([res, ...cards]);
            closeAllPopups();
          }).catch((err) => console.log(err))
    }

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, initialCards]) => {
          setCurrentUser(userInfo);
          setCards(initialCards)
        }).catch((err) => console.log(err))
  }, [])

    return (
        <CurrentUserContext.Provider value={currentUser}>
    <div className="App">
      <div className="page">
          <Header />
          <Main onCardClick={handleCardClick} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick}
          cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />
          <Footer />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
        <PopupWithForm name="confirm" title="Вы уверены?" isOpen={isConfirmPopupOpen} onClose={closeAllPopups} buttonText="Да"></PopupWithForm>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

      </div>
    </div>
        </CurrentUserContext.Provider>
  );
}

export default App;
