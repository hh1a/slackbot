'use strict';
const moment = require('moment');

var gTbl = {};	//ユーザ情報テーブル

module.exports = {
	/**
	 * 時刻を取得する
	 **/
	getTime: () => {
		return moment().format('YYYY-MM-DD HH:mm:ss');
	},

	/**
	* ユーザ情報を保管する
	* @param {string} id  LINE User ID
	* @param {string} key 連想配列のキー
	* @param {string} val ユーザ情報
	*/
	putUserData: (id, key, val) => {
		let mTbl = gTbl[id];
		if(mTbl == null) {
			mTbl = {};
			mTbl[key] = val;
			gTbl[id] = mTbl;
		} else {
			mTbl[key] = val;
		}
		console.log('*** debug *** user data: ' + JSON.stringify(gTbl));
	},

	/**
	* ユーザ情報を取得する
	* @param {string} id  LINE User ID
	* @param {string} key 連想配列キー
	*/
	getUserData: (id, key) => {
		  if(gTbl[id] == null || gTbl[id][key] == null){
		    return null;
		  }
		  return gTbl[id][key];
	},
};

