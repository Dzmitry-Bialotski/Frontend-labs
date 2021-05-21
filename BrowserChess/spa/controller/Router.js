import HomeView from './../views/HomeView.js';
import LoginView from './../views/LoginView.js';
import RegisterView from './../views/RegisterView.js';
import ProfileView from './../views/ProfileView.js';
import CreateRoomView from './../views/CreateRoomView.js';
import PlayView from './../views/PlayView.js';

import UrlParser from './UrlParser.js';
import UserService from './../services/UserService.js';

const routes = {
    '/': HomeView,
    '/login': LoginView,
    '/register': RegisterView,
    '/profile': ProfileView,
    '/create-room': CreateRoomView,
    '/play/:id': PlayView
}

const Router = async() => {
    const content = document.querySelector('main');
    const request = UrlParser.parseRequestUrl();
    const parsedURL = (request.resource ? ('/' + request.resource) : '/') +
        (request.id ? '/:id' : '');
    const page = routes[parsedURL] ? routes[parsedURL] : HomeView;
    let currentUser = UserService.getUserFromLocalStorage();
    if (page === LoginView || page === RegisterView || page === HomeView) {
        content.innerHTML = await page.render();
        await page.afterRender();
    } else if (currentUser == null) {
        content.innerHTML = await LoginView.render();
        window.location.hash = '/login';
        await LoginView.afterRender();
    } else if (page === ProfileView || page === CreateRoomView) {
        if (auth.currentUser) {
            content.innerHTML = await page.render();
            await page.afterRender();
        } else {
            content.innerHTML = await LoginView.render();
            window.location.hash = '/login';
            await LoginView.afterRender();
        }
    } else if (page === PlayView) {
        if (auth.currentUser) {
            content.innerHTML = await page.render();
            await page.afterRender(Number.parseInt(request.id));
        } else {
            content.innerHTML = await LoginView.render();
            window.location.hash = '/login';
            await LoginView.afterRender();
        }
    } else {
        content.innerHTML = await HomeView.render();
        window.location.hash = '/';
        await HomeView.afterRender();
    }
}
window.addEventListener('hashchange', Router);