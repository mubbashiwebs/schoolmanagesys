// Your Firebase config here
const firebaseConfig = {
    apiKey: "AIzaSyCxEFku7EX2Vm4BXajc93QWbR6G6N7FAMk",
    authDomain: "mubashirhotelwebsite.firebaseapp.com",
    databaseURL: "https://mubashirhotelwebsite-default-rtdb.firebaseio.com",
    projectId: "mubashirhotelwebsite",
    storageBucket: "mubashirhotelwebsite.firebasestorage.app",
    messagingSenderId: "542846680435",
    appId: "1:542846680435:web:b46bdbadd4b25321421906",
    measurementId: "G-1Y6KH4KZ1W"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  
  // Signup function
  function signup() {
    const cnic = document.getElementById('cnic').value;
    const name = document.getElementById('name').value;
    const designation = document.getElementById('designation').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        return db.ref('users/' + uid).set({
          cnic: cnic,
          name: name,
          designation: designation,
          username: username,
          email: email
        });
      })
      .then(() => {
        alert('Signup successful!');
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  
  // Login function
  async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    try {
      // Sign in the user
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
  
      // Get user data from Realtime Database
      const snapshot = await firebase.database().ref('users/' + uid).once('value');
      const userData = snapshot.val();
  
      if (userData) {
        alert('Login successful!\n\nWelcome, ' + userData.name + '\nDesignation: ' + userData.designation);
        console.log('User Data:', userData);
        
        localStorage.setItem('userData' , JSON.stringify(userData))
        window.location.href='dashboard.html'
        // Optionally, store user data in localStorage or display on the page
        // localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        alert('User data not found in database.');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  }
  
  