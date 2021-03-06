'use strict';

const utils = require('../core/utils');

module.exports = function voiceChannelSwitch(dispatcher, member, channel, oldChannel) {
	if (!dispatcher.dyno.isReady || !member || !channel.guild) return Promise.reject();

	if (dispatcher.config.handleRegion && !utils.regionEnabled(channel.guild, dispatcher.config)) return Promise.reject();

	return new Promise((resolve, reject) => {
		dispatcher.dyno.guilds.getOrFetch(channel.guild.id).then(guildConfig => resolve({
				member: member,
				channel: channel,
				oldChannel: oldChannel,
				guild: channel.guild,
				guildConfig: guildConfig,
			})).catch(() => reject());
	});
};
