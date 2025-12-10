const PROXY_CONFIG = [
	{
		context: ['/api'],
		target: process.env['API_URL'] || 'http://localhost:8080',
		secure: false,
		changeOrigin: true,
		logLevel: 'debug',
		bypass: function(_req, _res, _proxyOptions) {
			// console.log(req.url);
		},
		pathRewrite: {
			'/dist': ''
		}
	}
];

module.exports = PROXY_CONFIG;
