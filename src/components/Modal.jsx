import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../firebase-config.js';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const Modal = (props) => {
  const [userWord, setUserWord] = useState("");
  const [challengeButton, setChallengeButton] = useState(false);
  const [uniqueId, setUniqueId] = useState("");

  function saveUserWord(event) {
    const { value } = event.target;
    setUserWord(value.toLowerCase());
  };

  async function challengeButtonHandler(event) {
    event.preventDefault();
    const wordCollection = collection(db, 'custom-words');
    const userQuery = query(wordCollection, where('word', '==', userWord));
    const wordRef = await getDocs(userQuery);
  
    if (wordRef.empty) {
      const docRef = await addDoc(wordCollection, { word: userWord });
      setUniqueId(docRef.id);
    } else {
      setUniqueId(wordRef.docs[0].id);
    }
    setChallengeButton(!challengeButton);
  };

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/game/${uniqueId}`);
  }

  return (
    <div id="myModal" className="modal">
      <div className="modal-content" >
        <span onClick={() => {
          props.onClose();
          setChallengeButton(false);
        }} className="close">&times;</span>
        <div class={challengeButton === true && "hidden"}>
          <h2>Set a challenge for your friends</h2>
          <input onChange={saveUserWord} autoComplete='off' name='userWord' placeholder='Enter a word' />
          <button onClick={challengeButtonHandler}>Set</button>
        </div>

        <div class={challengeButton === false && "hidden"}>
        <h1>Copy this link and share with your friends</h1>
        <input type="text" value={`${window.location.origin}/game/${uniqueId}`} readOnly />
          <button onClick={copyLink}>Copy Link</button>
        </div>
      </div>



    </div>
  )
}

export default Modal