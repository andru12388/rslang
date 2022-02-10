import { ICreateUser, ILoginUser } from '../module/components/interface';
import RenderView from '../view/render';
import RequestsApi from '../module/requestsApi';

const api = new RequestsApi();
const render = new RenderView();

class AppController {
  wrapper = <HTMLElement>document.querySelector('.wrapper');
  signIn = <HTMLElement>document.querySelector('.sign-in');
  popupSignIn = <HTMLElement>document.querySelector('.popup-sign-in');
  menuBurg = <HTMLElement>document.querySelector('.menu-btn');
  menuHeader = <HTMLElement>document.querySelector('.menu-header');
  subMenuList = <HTMLElement>document.querySelector('.submenu-list');
  subMenuLink = <HTMLElement>document.querySelector('.sub-menu-link');
  linkToRegistered = <HTMLElement>document.querySelector('.link-to-registered');
  linkToSignup = <HTMLElement>document.querySelector('.link-to-signup');
  formPopapRegistered = <HTMLElement>document.querySelector('.form-popap-registered');
  formPopapSignup = <HTMLElement>document.querySelector('.form-popap-signup');
  formCloseBtn = <HTMLElement>document.querySelector('.form-close-btn');
  messageError = <HTMLElement>document.querySelector('.message-error');
  messageErrorSignin = <HTMLElement>document.querySelector('.message-error-signin');
  logOutBox = <HTMLElement>document.querySelector('.avatar-box');
  logOutBtn = <HTMLElement>document.querySelector('.log-out');
  storage: ILoginUser = {
    message: null,
    name: null,
    refreshToken: null,
    token: null,
    userId: null,
  };
  

  showMenu() {
    this.menuBurg.addEventListener('click', () => {
      this.menuBurg.classList.toggle('active');
      this.menuHeader.classList.toggle('active');
      this.wrapper.classList.toggle('active');
    });
  }

  showSubMenu() {
    this.menuHeader.addEventListener('click', (event) => {
      event.preventDefault();
      if ((event.target as HTMLElement).classList.contains('sub-menu-link') === true) {
        this.subMenuList.classList.toggle('active');
        this.subMenuLink.classList.toggle('active');
      } 
      return false;
    });
  }
  
  hideMenuClickBody() {
    this.wrapper.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('wrapper') === true) {
        this.menuBurg.classList.remove('active');
        this.menuHeader.classList.remove('active');
        this.wrapper.classList.remove('active');
      }
      return false;
    });
  }
  
  showRegisteredForm() {
    this.linkToRegistered.addEventListener('click', (event) => {
      event.preventDefault();
      this.formPopapRegistered.classList.toggle('active');
      this.formPopapSignup.classList.toggle('active-hidden');
    });
  }
  
  showSigninForm() {
    this.linkToSignup.addEventListener('click', (event) => {
      event.preventDefault();
      this.formPopapRegistered.classList.toggle('active');
      this.formPopapSignup.classList.toggle('active-hidden');
    });
  }
  
  closeFormRegist() {
    this.formCloseBtn.addEventListener('click', () => {
      this.popupSignIn.classList.toggle('active');
      this.wrapper.classList.remove('active');
    });
  }
  
  openFormRegist() {
    this.signIn.addEventListener('click', () => {
      this.popupSignIn.classList.toggle('active');
      this.wrapper.classList.add('active');
    });
  }

  showPersonalAccount() {
    this.logOutBox.classList.add('active');
    this.signIn.classList.add('active-hidden');
    this.formCloseBtn.click();
  }

  logOutUser() {
    this.wrapper.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('log-out') !== true) return false;
      localStorage.clear();
      this.logOutBox.classList.remove('active');
      this.signIn.classList.remove('active-hidden');
    });
  }
  
  registeredUser() {
    this.formPopapRegistered.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.messageError.textContent = '';
      this.messageError.style.display = 'none';
      const newUser: ICreateUser = {
        name: (<HTMLFormElement>this.formPopapRegistered).nameUser.value,
        email: (<HTMLFormElement>this.formPopapRegistered).email.value,
        password: (<HTMLFormElement>this.formPopapRegistered).password.value
      };
      await api.createUser(newUser);
      await api.loginUser(newUser);
      this.logOutBox.innerHTML = render.renderLogOut(<string>newUser.name);
      this.showPersonalAccount();
    });
  }
  
  loginAccountUser() {
    this.formPopapSignup.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.messageErrorSignin.textContent = '';
      this.messageErrorSignin.style.display = 'none';
      const newUser: ICreateUser = {
        email: (<HTMLFormElement>this.formPopapSignup).email.value,
        password: (<HTMLFormElement>this.formPopapSignup).password.value
      };
      await api.loginUser(newUser);
      this.storage = JSON.parse(<string>localStorage.getItem('user-info'));
      this.logOutBox.innerHTML = render.renderLogOut(<string>this.storage.name);
      this.showPersonalAccount();
    });
  }

  getLocalStorage() {
    window.addEventListener('load', async () => {
      if (localStorage.getItem('user-info')) {
        this.storage = JSON.parse(<string>localStorage.getItem('user-info'));
        try {
          await api.getUser(this.storage);
          this.logOutBox.innerHTML = render.renderLogOut(<string>this.storage.name);
          this.logOutBox.classList.add('active');
          this.signIn.classList.add('active-hidden');
        } catch (error) {
          await api.getNewUserToken(this.storage);
          this.storage = JSON.parse(<string>localStorage.getItem('user-info'));
          await api.getUser(this.storage);
          this.logOutBox.innerHTML = render.renderLogOut(<string>this.storage.name);
          this.logOutBox.classList.add('active');
          this.signIn.classList.add('active-hidden');
        }
      }
    });
  }

  listenerAll() {
    this.showMenu();
    this.showSubMenu();
    this.hideMenuClickBody();
    this.showRegisteredForm();
    this.showSigninForm();
    this.closeFormRegist();
    this.openFormRegist();
    this.registeredUser();
    this.loginAccountUser();
    this.getLocalStorage();
    this.logOutUser();
  }
}

export default AppController;