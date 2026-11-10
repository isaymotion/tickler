// Batch Tickler: the parts of the Firebase JS SDK the app uses, bundled once with esbuild into
// js/vendor/firebase.js (window.BTFB). 1.21.0: full Firestore (not /lite) for the realtime chat listener
// (onSnapshot on the open channel only; everything else still one-shot reads).
// Rebuild: npm i firebase@13 esbuild && npx esbuild entry.js --bundle --minify --format=iife --target=es2017 --outfile=firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, setPersistence, indexedDBLocalPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, getDocs, query, where, orderBy, limit, startAfter, writeBatch, onSnapshot, arrayUnion, arrayRemove, deleteField } from 'firebase/firestore';
window.BTFB = { initializeApp, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, setPersistence, indexedDBLocalPersistence, browserLocalPersistence, getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, getDocs, query, where, orderBy, limit, startAfter, writeBatch, onSnapshot, arrayUnion, arrayRemove, deleteField };
