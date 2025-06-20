// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAqMkxlTrgvPmJ5WdyeCwMWgcx2lW51WA",
  authDomain: "connectorhubsignup.firebaseapp.com",
  projectId: "connectorhubsignup",
  storageBucket: "connectorhubsignup.firebasestorage.app",
  messagingSenderId: "1069616706414",
  appId: "1:1069616706414:web:f0843d21127b358390077f",
  measurementId: "G-EEYDQT70JG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const analytics = firebase.analytics();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const googleLoginBtn = document.getElementById('google-login');
const forgotPasswordLink = document.getElementById('forgot-password');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });

  // Toggle password visibility
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  });

  // Login form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    loginWithEmail(email, password);
  });

  // Signup form
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    signUpWithEmail(name, email, password);
  });

  // Google login
  googleLoginBtn.addEventListener('click', signInWithGoogle);

  // Forgot password
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Enter your email address:');
    if (email) sendPasswordReset(email);
  });

  // Check auth state
  auth.onAuthStateChanged(user => {
    if (user) {
      window.location.href = 'business.html';
    }
  });
});

// Authentication functions
function loginWithEmail(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showMessage('login-message', 'Login successful!', 'success');
    })
    .catch(error => {
      showMessage('login-message', getErrorMessage(error), 'error');
    });
}

function signUpWithEmail(name, email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      return userCredential.user.updateProfile({
        displayName: name
      });
    })
    .then(() => {
      return auth.currentUser.sendEmailVerification();
    })
    .then(() => {
      showMessage('signup-message', 'Account created! Please verify your email.', 'success');
      signupForm.reset();
    })
    .catch(error => {
      showMessage('signup-message', getErrorMessage(error), 'error');
    });
}

function signInWithGoogle() {
  auth.signInWithPopup(googleProvider)
    .then(() => {
      showMessage('login-message', 'Google login successful!', 'success');
    })
    .catch(error => {
      showMessage('login-message', getErrorMessage(error), 'error');
    });
}

function sendPasswordReset(email) {
  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert('Password reset email sent!');
    })
    .catch(error => {
      alert(getErrorMessage(error));
    });
}

// Helper functions
function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = `message ${type}`;
  
  setTimeout(() => {
    element.className = 'message';
  }, 5000);
}

function getErrorMessage(error) {
  switch(error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'Account disabled';
    case 'auth/user-not-found':
      return 'Account not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    case 'auth/too-many-requests':
      return 'Too many requests. Try again later';
    default:
      return 'An error occurred. Please try again';
  }
}