<script>
	import { writable } from 'svelte/store';
	import ChatItem from './chatItem.svelte';
	import { db, auth } from '../../lib/firabase/firebase';
	import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	let user;
	export let chats = writable([]);

	onMount(() => {
		onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				user = authUser;
				localStorage.removeItem('rec-uid');
				getChats();
			}
		});
	});

	async function getChats() {
		if (user) {
			console.log('in chats ');
			const chatRef = collection(db, `users/${user.uid}/chats`);

			const snapShot = await getDocs(chatRef);

			if (snapShot.docs.length > 0) {
				snapShot.forEach((doc) => {
					chats.update((chat) => [...chat, doc.data()]);
				});
			} else {
				console.log('Error getting chats');
			}
		}
	}
</script>

<div class="chat-list">
	{#if $chats.length > 0}
		{#each $chats as chat}
			<ChatItem {chat} {user} />
		{/each}
	{:else}
		<div class="no-chat">
			<p>ADD NEW CHAT</p>
		</div>
	{/if}
</div>

<style>
	.chat-list {
		width: 100%;
		flex: 0 0 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 10px;
		gap: 8px;
	}
	.no-chat {
		width: 100%;
		flex: 0 0 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.no-chat > p {
		font-weight: bold;
		color: darkgray;
		font-size: 20px;
		padding: 5px;
		transition: 0.5s ease-in-out;
		font-family: monospace;
	}

	.no-chat>p:hover{
		color: coral;
	}
</style>
