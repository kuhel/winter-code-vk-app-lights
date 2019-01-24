import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vkui-connect';
import App from './App';
import registerServiceWorker from './sw';
import './main.css';

// Init VK App
connect.send('VKWebAppInit', {});

// Service Worker For Cache
registerServiceWorker();

ReactDOM.render(<h1>Пи Пу Пи</h1>, document.getElementById('root'));

const links = Array.from(document.querySelectorAll('a'));

document.addEventListener('click', (e) => {
	if (e.target.nodeName === 'A') {
		e.preventDefault();
		const src = e.target.getAttribute('href');
		if (src) {
			const frame = document.getElementById('frame');
			frame.setAttribute('src', src);
		}
		console.log(e.target);
	}
})
