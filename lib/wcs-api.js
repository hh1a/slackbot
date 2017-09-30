'use strict';
const wcsconf = JSON.parse(process.env.wcs);
//const wcsconf = require('../../config/env.json')['wcs'];
const util = require('../lib/util.js');
const wdc = require('watson-developer-cloud');
const wcs = wdc.conversation({
	  username: wcsconf.WATSON_USERNAME,
	  password: wcsconf.WATSON_PASSWORD,
	  version: 'v1',
	  version_date: '2017-05-26'
});
const WATSON_WORKSPACE_ID = wcsconf.WATSON_WORKSPACE_ID;

module.exports = {
	/**
	* Watson Conversationにメッセージを送信する
	* @param {string} userId  LINE User ID
	* @param {string} query   質問
	* @param {function} callback コールバック関数。
	*/
	request: (userId, query, callback) => {
		query = query.replace(/\n/g,' ');
		wcs.message({
			workspace_id: WATSON_WORKSPACE_ID,
			input: { 'text': query },
			context: util.getUserData(userId, "watson_context")
		}, (err, response) => {
			if (err) {
				console.log('*** Watson Conversation *** error: '+ e.message);
				callback([]);
			} else {
				util.putUserData(userId, "watson_context", response.context);
				callback(response);
			}
		});
	}
};
