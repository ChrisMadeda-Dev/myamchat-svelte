import { writable } from 'svelte/store';

export const store = writable({
	currentRecUid: '',
	currentRecName: 'name'
});
