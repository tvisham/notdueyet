// Helper: Read from file (simplified for demo)
function readUsers() {
  try {
    const users = localStorage.getItem('users') || '';
    return users.split('\n').filter(Boolean).map(u => {
      const [user, pass] = u.split(':');
      return { user, pass };
    });
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem('users', users.map(u => `${u.user}:${u.pass}`).join('\n'));
}

// Auth logic
document.getElementById('go-to-register').addEventListener('click', () => {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-box').style.display = 'block';
});

document.getElementById('go-to-login').addEventListener('click', () => {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-box').style.display = 'none';
});

document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('new-username').value;
  const pass = document.getElementById('new-password').value;
  const users = readUsers();
  if (users.some(u => u.user === user)) {
    alert('Username already exists!');
    return;
  }
  users.push({ user, pass });
  writeUsers(users);
  alert('Registration successful! Please login.');
  document.getElementById('register-form').reset();
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-box').style.display = 'none';
});

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const users = readUsers();
  if (users.some(u => u.user === user && u.pass === pass)) {
    // Store current user and go to home
    localStorage.setItem('currentUser', user);
    window.location.href = 'home.html';
  } else {
    alert('Invalid credentials!');
  }
});

const loginBox = document.querySelector('.auth-box:not(#register-box)');
const registerBox = document.getElementById('register-box');
const goToRegisterBtn = document.getElementById('go-to-register');
const goToLoginBtn = document.getElementById('go-to-login');

goToRegisterBtn.addEventListener('click', () => {
  loginBox.style.display = 'none';
  registerBox.style.display = 'block';
});

goToLoginBtn.addEventListener('click', () => {
  registerBox.style.display = 'none';
  loginBox.style.display = 'block';
});
