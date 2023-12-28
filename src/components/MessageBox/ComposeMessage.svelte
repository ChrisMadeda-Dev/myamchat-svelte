<script>
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { auth, db } from '../../lib/firabase/firebase';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { store } from '../../store/Store';

	let user;
	let messageOut;

	let inputState = false;

	let recUid;
	let recName;

	$: {
		recUid = $store.currentRecUid;
		if (recUid !== '') {
			inputState = true;
		} else {
			inputState = false;
		}
	}

	onMount(() => {
		recName = localStorage.getItem('rec-name');

		onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				user = authUser;
			}
		});
	});

	function addMessage() {
		if ((user, recUid)) {
			const recRef = collection(db, `users/${recUid}/chats/${user.uid}/chat`);
			const senderRef = collection(db, `users/${user.uid}/chats/${recUid}/chat`);

			const out = {
				recName: recName,
				recUid: recUid,
				senderName: localStorage.getItem('u-name'),
				senderUid: user.uid,
				message: messageOut,
				createdAt: serverTimestamp()
			};

			addDoc(recRef, out);
			addDoc(senderRef, out);

			messageOut = '';
		} else {
			alert('Error: Message not sent');
		}
	}
</script>

<div class="compose-message">
	{#if inputState}
		<input
			disabled={inputState}
			class="input-message"
			type="text"
			placeholder="Type Message"
			bind:value={messageOut}
		/>
		<button disabled={inputState} on:click={addMessage} class="btn-send">Send</button>
	{/if}
</div>

<style>
	.compose-message {
		flex: 0 0 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: '';
		box-sizing: border-box;
	}

	.compose-message > .input-message {
		flex: 0 0 60%;
		height: 50px;
		padding: 20px;
		background-color: white;
		border-radius: 10px;
		outline: solid 1px;
	}

	.compose-message > .btn-send {
		flex: 0 0 20%;
		height: 50px;
		background-color: steelblue;
		border-radius: 5px;
		margin: 0px 15px;
		color: whitesmoke;
	}
</style>
