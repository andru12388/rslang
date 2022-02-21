class BackToHeader {
  trackScroll(): void {
    const goTopBtn = document.querySelector('.top') as HTMLElement;
    const scrolled: number = window.pageYOffset;
    const coords: number = document.documentElement.clientHeight;
    if (scrolled > coords) {
      (goTopBtn as HTMLElement).classList.add('active-up');
    }
    if (scrolled < coords) {
      (goTopBtn as HTMLElement).classList.remove('active-up');
    }
  }

  backToTop(): void {
    let timeOut: unknown;
    const top: number = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    if (top > 0) {
      (window as Window).scrollBy(0, -10e5);
      timeOut = setTimeout(this.backToTop, 20);
    } else clearTimeout((timeOut) as never) as void;
  }

  upHeader(): void {
    const goTopBtn = document.querySelector('.top') as HTMLElement;
    (window as Window).addEventListener('scroll', () => this.trackScroll() as void);
    (goTopBtn as HTMLElement).addEventListener('click', () => this.backToTop() as void);
  }

}

export default BackToHeader;
