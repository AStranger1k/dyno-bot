'use strict';

const path = require('path');
const util = require('util');
const utils = Loader.require('./core/utils');
const Command = Loader.require('./core/structures/Command');

class LoadCommand extends Command {
	constructor(...args) {
		super(...args);

		this.aliases      = ['loadcommand', 'loadcmd'];
		this.group        = 'Admin';
		this.description  = 'Load a command.';
		this.usage        = 'load [command]';
		this.permissions  = 'admin';
		this.expectedArgs = 1;
	}

	execute({ message, args }) {
		if (!this.dyno) return false;

		if (args[0] === 'all') {
			const promises = [];
			for (let cmd of this.dyno.commands.values()) {
				const name = `${cmd.group}/${cmd.constructor.name}`;
				promises.push(this.loadCommand(message, name));
			}

			return Promise.all(promises)
				.then(data => this.sendCode(message.channel, data.map(d => util.inspect(d)), 'js'))
				.catch(err => this.sendCode(message.channel, err, 'js'));
		}

		return this.loadCommand(message, args[0])
			.then(data => this.sendCode(message.channel, data.map(d => util.inspect(d)), 'js'))
			.catch(err => this.sendCode(message.channel, err, 'js'));
	}

	loadCommand(message, cmd) {
		let filePath = path.join(this.config.paths.commands, cmd);
		filePath = filePath.endsWith('.js') ? filePath : filePath + '.js';

		if (!utils.existsSync(filePath)) {
			return this.error(message.channel, `File does not exist: ${filePath}`);
		}

		return this.dyno.ipc.awaitResponse('reload', { type: 'commands', name: cmd });
	}
}

module.exports = LoadCommand;
