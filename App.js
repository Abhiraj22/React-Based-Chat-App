import React, { useRef, useState } from 'react';
import './App.css';

//import firebase from 'firebase/app'; //older version
import firebase from 'firebase/compat/app'; //v9

//to use auth
//import 'firebase/auth'; //older version
import 'firebase/compat/auth'; //v9

//to use firestore
//import 'firebase/firestore'; //Older Version
import 'firebase/compat/firestore'; //v9
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
  apiKey: "AIzaSyAU7fhmUB7VR4JjsAp21lomfgrHcEHBsO0",
  authDomain: "chat-app-35b68.firebaseapp.com",
  projectId: "chat-app-35b68",
  databaseURL:"https:/chat-app-35b68.firebaseio.com",
  storageBucket: "chat-app-35b68.appspot.com",
  messagingSenderId: "863500453226",
  appId: "1:863500453226:web:300c14e7cad55481bbd113",
  measurementId: "G-KXD6VCLHCY"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


// sbse phle yeh function call hoga similar to main function as in java/c++ //
function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        {/* <h1>⚛️🔥💬</h1> */}
        <h1>Chat App</h1>
        <SignOut />
      </header>
      <section>
{/* // if user exists show him chatroom otherwise show signin */}
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      {/* <p>    Do not violate the community guidelines or you will be banned for life!</p> */}
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  //get your message from firestore.
  const messagesRef = firestore.collection('messages');
  //only show last 25 messages ..
  const query = messagesRef.orderBy('createdAt').limit(20);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
{/* 
      <button type="submit" disabled={!formValue}>🕊️</button> */}
      <button type="submit">🕊️</button>
    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      {/* either this is messagesent or messagereceived ,side of display we will use css */}
      <img src={photoURL || 'https://www.disneyplusinformer.com/wp-content/uploads/2021/06/Luca-Profile-Avatars-3.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;