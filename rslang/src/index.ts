import RenderView from './js/view/render';
import AppController from './js/controller/controller';
import './styles/main.sass';

const render = new RenderView();
await render.render();
const ui = new AppController();
ui.listenerAll();