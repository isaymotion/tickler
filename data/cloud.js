/* Cloud sync settings (1.18.0). The Firebase web config is not a secret: access is controlled by the
   security rules in firestore.rules. Admins can create batches, approve join requests and remove members;
   keep this list in step with the isAdmin() list in firestore.rules. */
window.CLOUD_CONFIG = {
  firebase: {
    apiKey: 'AIzaSyCPGCe84bMyj3aZnLRfrLwSFKy3AI1QtgY',
    authDomain: 'batch-tickler.firebaseapp.com',
    projectId: 'batch-tickler',
    storageBucket: 'batch-tickler.firebasestorage.app',
    messagingSenderId: '356707405669',
    appId: '1:356707405669:web:cbc941c3629bdf0444db8c'
  },
  admins: ['isaymotion@gmail.com'],
  // Card groups that leave the phone only when their owner ticks the consent box on the Cloud sync screen.
  privateGroups: ['emergency', 'contact']
};
