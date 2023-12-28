<script>
	import MessageCont from './MessageCont.svelte';
	import { auth, db } from '../../lib/firabase/firebase';
	import { collection, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	import { store } from '../../store/Store';

	let user;
	let messages = writable([]);

	let recUid;

	onMount(() => {
		recUid = localStorage.getItem('rec-uid');
		onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				user = authUser;
				getMessages();
			}
		});
	});

	$: {
		//Call the function when recUid is changed ie chat is selected
		getMessages($store.currentRecUid);
	}

	async function getMessages(recUid) {
		if ((recUid, user)) {
			const id = recUid;

			//Reset Messages Array
			messages.update(() => []);

			const messagesRef = collection(db, `users/${user.uid}/chats/${id}/chat`);
			const q = query(messagesRef, orderBy('createdAt', 'desc'));
			const unsubscribe = onSnapshot(q, (docs) => {
				messages.update(() => []);
				docs.forEach((doc) => {
					messages.update((msg) => [...msg, doc.data()]);
				});
			});
		}
	}
</script>

<div class="message-box">
	{#if $messages.length > 0}
		{#each $messages as msg}
			<MessageCont message={msg} {user} />
		{/each}
	{:else}
		<div class="no-messages">
			<p>WELCOME TO MYA|\/|CHAT</p>
			<p>|o_o|</p>
		</div>
	{/if}
</div>

<style>
	.message-box {
		flex: 0 0 100%;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 8px;
		background-color: '';
		overflow-y: auto;
		overflow-x: hidden;
	}
	.no-messages {
		width: 100%;
		flex: 0 0 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: aliceblue;
	}

	.no-messages > p {
		font-weight: bold;
		color: darkgray;
		font-size: 20px;
		padding: 5px;
		transition: 0.5s ease-in-out;
		font-family: monospace;
		background-color:'';
	}

	.no-messages>p:hover{
		color: green;
	}
</style>
