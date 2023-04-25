import React, { useState, useEffect } from 'react';
import Header from './Header';
import Figure from './Figure';
import WrongLetters from './WrongLetters';
import Word from './Word';
import Popup from './Popup';
import Notification from './Notification';
import { showNotification as show, checkWin } from '../helpers/helpers';
import Keyboard from './Keyboard';
import { Link, useParams, useLocation } from 'react-router-dom';
import { db } from '../../firebase-config.js';
import { doc, getDoc } from 'firebase/firestore';
import Modal from './Modal';

const words = ["monitor", "program", "application", "keyboard", "javascript", "gaming", "network", 'application', 'programming', 'interface', 'wizard'];
//let selectedWord = words[Math.floor(Math.random() * words.length)];

const Game = () => {

  // for modal
  const [isOpened, setIsOpened] = useState(false);

  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');

  // fetch name for leaderboard update
  const location = useLocation();
  const name = new URLSearchParams(location.search).get('name');

  const { id } = useParams();

  useEffect(() => {
    const fetchUserWord = async () => {
      if (id) {
        const wordRef = doc(db, 'custom-words', id);
        const wordDoc = await getDoc(wordRef);
        if (wordDoc.exists()) {
          setSelectedWord(wordDoc.data().word);
        }
      } else {
        setSelectedWord(words[Math.floor(Math.random() * words.length)]);
      }
    };

    fetchUserWord();
  }, [id]);

  useEffect(() => {
    const handleKeydown = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();
        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters(currentLetters => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters(currentLetters => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    }
    if (isOpened === false) {
      window.addEventListener('keydown', handleKeydown);
    } else { };


    return () => window.removeEventListener('keydown', handleKeydown);
  }, [correctLetters, wrongLetters, playable]);

  function playAgain() {
    setPlayable(true);

    // Empty Arrays
    setCorrectLetters([]);
    setWrongLetters([]);

    const random = Math.floor(Math.random() * words.length);
    setSelectedWord(words[random]);;
  }

  function toggleModal() {
    setIsOpened(!isOpened);
  };

  return (
    <>
      <Header />
      <div className="game-container">
        <Figure wrongLetters={wrongLetters} />
        <WrongLetters wrongLetters={wrongLetters} />
        <Word selectedWord={selectedWord} correctLetters={correctLetters} />
      </div>
      <Popup correctLetters={correctLetters} wrongLetters={wrongLetters} selectedWord={selectedWord} setPlayable={setPlayable} playAgain={playAgain} name={name} />
      <Notification showNotification={showNotification} />
      <button><Link to='/leaderboard'>View Leaderboard</Link></button>
      <button onClick={toggleModal}>Challenge a Friend!</button>
      <div style={{ display: isOpened === false && "none" }}><Modal onClose={toggleModal} />
      </div>

    </>

  )
}

export default Game