'use strict';
const wcsapi = require('./lib/wcs-api.js');
const util = require('./lib/util.js');
const slacksdk = require('@slack/client');
const slackconf = JSON.parse(process.env.slack);
//const slackconf = require('../config/env.json')['slack'];

const token = slackconf.SLACK_TOKEN;
const slackEvent = slacksdk.RTM_EVENTS;
const rtm = new slacksdk.RtmClient(
	token, {
		logLevel: 'info'
//		logLevel: 'debug'
	});

// RTM接続開始
rtm.start();

// メッセージ処理
rtm.on(slackEvent.MESSAGE, function handleRtmMessage(data) {
	Promise.resolve().then(() => {
		return new Promise((resolve, reject) => {
			let conversation = {
				userId: data.user,
				channel: data.channel,
				slackQuery: data.text,
				team: data.team,
				wcsResult: [],
				slackReplyMessage: ""
			}
//			console.log('*** debug *** conversation:' + JSON.stringify(conversation));

			// Waton Conversation Service処理
			wcsapi.request(conversation.userId, conversation.slackQuery, (res) => {
				conversation.wcsResult = res;
				let context = res.context;
				let replyMessage = "";
				// DB使った処理とかはこの辺に書く
				if (res.output && res.output.text) {
					res.output.text.forEach((text) => {
						replyMessage = text;
					});
				}
				conversation.slackReplyMessage = replyMessage;
				resolve(conversation);
			});
		});
	}).then((conversation) => {
//				console.log('*** debug *** conversation: ' + JSON.stringify(conversation));
				rtm.sendMessage(conversation.slackReplyMessage, conversation.channel);
	}).catch((e) => {
		console.log(e.stack);
	});
});

// 絵文字追加時のアクション
rtm.on(slackEvent.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
	console.log('Reaction added:', reaction);
});

// 絵文字削除時のアクション
rtm.on(slackEvent.REACTION_REMOVED, function handleRtmReactionRemoved(reaction) {
	console.log('Reaction removed:', reaction);
});
