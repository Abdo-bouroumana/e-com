/* Shared nav helper: show username & toggle Register button */
export function initAuthUI () {
  const account = document.getElementById('account-link');
  const regBtn  = document.getElementById('register-link');

  const user = JSON.parse(localStorage.getItem('qcUser') || 'null');

  if (user) {
    account.textContent = user.name;
    account.style.display = 'inline';
    regBtn?.remove();                          // hide “Register”
  }
}
