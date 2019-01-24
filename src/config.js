export const GET_OBJECT_VALUES = function (obj) {
	return Object.keys(obj).map(item => obj[item]);
};

export const ROUTES = {
	SLIDES: 'slides',
	EVENT: 'event',
};

export const ROUTES_VALUES = GET_OBJECT_VALUES(ROUTES);

export const API_DOMAIN = 'https://api.wc19.mobyman.org/api';

export const API_ROUTES = {
	INITIAL: '/initial',
	QR: '/get?',
	GET_EVENT: '/get?id=',
};
