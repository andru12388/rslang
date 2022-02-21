import RenderView from './js/view/render';
import AppController from './js/controller/controller';
import PreloaderPage from './js/module/components/preloader';
import BackToHeader from './js/module/components/backHeader';
import './styles/main.sass';

const preloaderPage = new PreloaderPage();
preloaderPage.preloaderApp();
const render = new RenderView();
await render.render();
const ui = new AppController();
ui.listenerAll();
const backToHeader = new BackToHeader();
backToHeader.upHeader();