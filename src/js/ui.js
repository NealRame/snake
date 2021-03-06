import {EventEmitter} from 'events';
import config from 'config';
import Score from 'score';
import Screen from 'screen';
import keyboard from 'keyboard';

const screen_ui = document.getElementById('screen');

const score_ui = document.getElementById('score');

const menu_ui = document.getElementById('menu-box');
const high_scores_ui = document.getElementById('high-scores');
const levels_ui = document.getElementById('levels');
const levels_ui_items = levels_ui.children;

const message_ui = document.getElementById('message-box');

const screen = Screen(screen_ui);

function center(child, parent) {
	const child_box = child.getBoundingClientRect();
	const parent_box = parent.getBoundingClientRect();
	return {
		top: parent_box.top + (parent_box.height - child_box.height)/2 + 'px',
		left: parent_box.left + (parent_box.width - child_box.width)/2 + 'px'
	};
}

function selected_menu_item_index() {
	return Array.prototype.findIndex.call(
		levels_ui_items,
		(item) => item.className === 'active'
	);
}

function selected_menu_item() {
	return levels_ui_items[selected_menu_item_index()];
}

Object.assign(screen_ui, config.screen);

Object.assign(score_ui.style, {width: config.screen.width + 'px'});
Object.assign(screen_ui.style, {
	width: config.screen.width + 'px',
	height: config.screen.height + 'px'
});

const ui = Object.assign(Object.create(new EventEmitter()), {
	screen,
	clearScore() {
		score_ui.innerHTML = '0';
	},
	setScore(v) {
		score_ui.innerHTML = `${v}`;
		return this;
	},
	showMenu() {
		high_scores_ui.innerHTML = '';
		['easy', 'normal', 'hard'].forEach((level) => {
			const high_score = Score(level).best;
			const item = document.createElement('li');
			item.innerHTML = `${level}: ${high_score}`;
			high_scores_ui.appendChild(item);
		});
		Object.assign(menu_ui.style, center(menu_ui, screen_ui));
		Object.assign(menu_ui.dataset, {visible: 'yes'});
	},
	hideMenu() {
		menu_ui.dataset.visible = 'no';
	},
	showMessage(text, title = '') {
		message_ui.innerHTML = '';
		if (title) {
			const h1 = document.createElement('h1');
			h1.innerHTML = title;
			message_ui.appendChild(h1);
		}
		if (text) {
			const span = document.createElement('span');
			span.innerHTML = text;
			message_ui.appendChild(span);
		}
		Object.assign(message_ui.style, center(message_ui, screen_ui));
		Object.assign(message_ui.dataset, {visible: 'yes'});
	},
	hideMessage() {
		message_ui.dataset.visible = 'no';
	}
});

window.addEventListener('resize', () => {
	Object.assign(menu_ui.style, center(menu_ui, screen_ui));
	Object.assign(message_ui.style, center(message_ui, screen_ui));
});

Array.prototype.forEach.call(document.querySelectorAll('#levels li'), (item) => {
	item.addEventListener('click', () => {
		selected_menu_item().className = '';
		item.className = 'active';
		ui.emit('start', item.dataset.level);
	});
});

keyboard
	.on('up', () => {
		const index = selected_menu_item_index();
		levels_ui_items[index].className = '';
		levels_ui_items[(index + levels_ui_items.length - 1)%levels_ui_items.length].className = 'active';
	})
	.on('down', () => {
		const index = selected_menu_item_index();
		levels_ui_items[index].className = '';
		levels_ui_items[(index + 1)%levels_ui_items.length].className = 'active';
	})
	.on('start', () => {
		ui.emit('start', selected_menu_item().dataset.level);
	});

export {ui as default};
