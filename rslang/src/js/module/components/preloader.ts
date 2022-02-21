class PreloaderPage {
  preloaderApp(): void {
    (window as Window).addEventListener('load', (): void => {
      const preloader = <HTMLElement>document.querySelector('.preloader');
      setTimeout((): void => {
        preloader.classList.add('preloader-hidden');
      }, 1000);
    });
  }

  showPreloaderPage(): void {
    const preloader = <HTMLElement>document.querySelector('.preloader-page');
    const footer = <HTMLElement>document.querySelector('.footer');
    preloader.classList.add('preloader-visible');
    footer.classList.add('active-hidden');
  }

  hidePreloaderPage(): void {
    const preloader = <HTMLElement>document.querySelector('.preloader-page');
    const footer = <HTMLElement>document.querySelector('.footer');
    setTimeout((): void => {
      preloader.classList.remove('preloader-visible');
      footer.classList.remove('active-hidden');
    }, 500);
  }
}

export default PreloaderPage;