class Paginator {
  current: number;

  all: number;

  parentElement: HTMLElement;

  constructor(current: number, all: number, parentElement: HTMLElement) {
    this.current = current;
    this.all = all;
    this.parentElement = parentElement;
  }

  renderNumberPage(pageNum: number): void {
    const button = document.createElement('button');
    button.setAttribute('data-page', `${pageNum - 1}`);
    button.textContent = `${pageNum}`;
    if (pageNum === this.current) {
      button.classList.add('current');
    }
    button.classList.add('btn-pagination');
    this.parentElement.append(button);
  }

  renderLinkPagination(pageNum: number): void {
    const button = document.createElement('button');
    switch (pageNum) {
      case 1:
        button.innerHTML = '<i class="fas fa-angle-left"></i>';
        button.classList.add('prev-arrow');
        this.parentElement.append(button);
        this.renderNumberPage(pageNum);
        break;
      case this.all:
        this.renderNumberPage(pageNum);
        button.innerHTML = '<i class="fas fa-angle-right"></i>';
        button.classList.add('next-arrow');
        this.parentElement.append(button);
        break;
      default:
        this.renderNumberPage(pageNum);
        break;
    }
  }

  renderDotsPagination(): void {
    const span = document.createElement('span');
    span.classList.add('rest-page');
    span.innerHTML = '...';
    this.parentElement.append(span);
  }

  renderPagination(): void {
    if (this.all === 1) {
      return;
    }
    const links = [1, this.all];
    for (let i = this.current - 2; i <= this.current + 2; i++) {
      if (i < 1 || i > this.all) {
        continue;
      }
      links.push(i);
    }
    const uniqLinks = [...new Set(links)];
    uniqLinks.sort((a, b) => a - b);
    for (let i = 0; i < uniqLinks.length; i++) {
      this.renderLinkPagination(uniqLinks[i]);
      if ( (i + 1) < uniqLinks.length && (uniqLinks[i] + 1 !== uniqLinks[i + 1]) ) {
        this.renderDotsPagination();
      }
    }
  }
}

export default Paginator;

