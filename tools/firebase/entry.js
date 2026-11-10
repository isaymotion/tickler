// Batch Tickler: the parts of the Firebase JS SDK the app uses, bundled once with esbuild into
// js/vendor/firebase.js (window.BTFB). Firestore *lite* (plain REST, no realtime listeners) keeps it small.
// Rebuild: npm i firebase esbuild && npx esbuild entry.js --bundle --minify --format=iife --target=es2017 --outfile=firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, setPersistence, indexedDBLocalPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where, orderBy, limit, writeBatch } from 'firebase/firestore/lite';
window.BTFB = { initializeApp, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, setPersistence, indexedDBLocalPersistence, browserLocalPersistence, getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where, orderBy, limit, writeBatch };
