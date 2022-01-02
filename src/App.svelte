<script lang="ts">
	import { afterUpdate, onMount } from "svelte";
	import Message from './Message.svelte';
	import Menu from './Menu.svelte';

  export let settings;

	let ws;
	let connected = false;
  let twitchConnected = false;
	let messages = [];
  let curMsgIdx = 0;
  let menuOpen = false;

  let containerEl;
  let msgEl;

  let twitchUsrObj = {
    username: localStorage.getItem('username') || '',
    oauth: localStorage.getItem('oauth') || '',
    channel: localStorage.getItem('channel') || ''
  };

  const scrollMsg = (type) => msgEl?.scroll({ top: msgEl.scrollHeight, behavior: type });

	onMount(()=>{
    connect();

    /* test_connect(); */

    addEventListener('keyup', (e)=>{
      if(e.key == '`') menuOpen = !menuOpen;
    });
	});

  function test_connect(){
    connected = true;

    let word = ['test', 'raaaaaahsdfasd', 'uh', 'something', 'hmm'];
    let words = '';


    let tMesg = {
      user: 'tester',
      color: '#F0000F',
      message: ''
    }

    populate_test(tMesg);

    setInterval(() => {
      populate_test(tMesg);
    }, 5000)
  }

  function populate_test(tmsg){
    const word = ['test', 'raaaaaahsdfasd', 'uh', 'something', 'hmm'];
    let words = '';

      for(let i = 0; i <= ~~(Math.random()*30)+1; i++){
        const ranWord = word[~~(Math.random()*word.length-1)];
        words += ranWord + ' ';
      }

      tmsg.message = words;
      messages = [...messages, tmsg];
  }

	function connect(){
		ws = new WebSocket('ws://localhost:6969');

		ws.onopen = (e) => {
			connected = true;

      if(twitchUsrObj.username.length && twitchUsrObj.oauth.length && twitchUsrObj.channel.length){
          const obj = {
            type: 'cred',
            payload: twitchUsrObj
          }
          ws.send(JSON.stringify(obj));
      }
		};

		ws.addEventListener('close', (e)=> {
			setTimeout(() => {
				connected = false;
				connect();
			}, 1000);
		});

		ws.onmessage = (e) => {
			const data = JSON.parse(e.data);

      if(data.type == 'serverEvt'){
        twitchConnected = data.payload == 'twConnected' ? true : false;
        if(twitchConnected) menuOpen = false;
        return;
      }

			messages = [...messages, data];
      // if(!messages.length) messages = [...tmpMessages];
		};
	}

	function stopEvt(){
    setTimeout(() => {
      curMsgIdx++;
    }, 200);
	}

  function sendData(e){
    const usrObj = e.detail;
    const obj = {
      type: 'cred',
      payload: usrObj
    }
    ws.send(JSON.stringify(obj))
  }

  function twitchDisconnectEvt(e){
    const obj = {
      type: 'disconnect'
    }
    ws.send(JSON.stringify(obj))
  }

  function updateEvt(e){
    if(e.detail){
      scrollMsg('smooth');
    } else {
      scrollMsg('instant');
    }
  }

</script>

<main>
  <div id="container" bind:this={containerEl}>

    {#each Array(4) as block, idx}
      <div class="block" id="block{idx}">
        <div class="innerBlock" />
      </div>
    {/each}

    {#if menuOpen}
      <Menu
        on:twitchDisconnect={twitchDisconnectEvt}
        on:sendData={sendData}
        bind:connected={twitchConnected}
        bind:username={twitchUsrObj.username}
        bind:oauth={twitchUsrObj.oauth}
        bind:channel={twitchUsrObj.channel}
        />
    {/if}

    <div id="messages" bind:this={msgEl} style="backgroundColor: {settings.bgcolor}">
      {#if !connected}
      <div id="wsError">Connecting...</div>
      {/if}


      {#each messages as mesg, idx}
        {#if idx <= curMsgIdx}
        <Message
          on:update={updateEvt}
          on:stopped={stopEvt}
          bind:msg={mesg.message}
          bind:usr={mesg.user}
          bind:color={mesg.color}
          />
        {/if}
      {/each}

    </div>

  </div>
</main>

<style>
main {
  padding: 5px;
  }

#mouseContainer{
  width: 100%;
  height: 100%;
  z-index: 9999;
  position: absolute;
  left: 0px;
  top: 0px;
  }

.block {
  background-color:#000;
  border:2px solid #FFF;
  position: absolute;
  padding: 3px;
  box-shadow: 0px 0px 10px #000;
  z-index: 9998;
  }
  .innerBlock {
    background-color:#FFF;
    width: 4px;
    height: 4px;
    }
    #block0{
      top: -5px;
      left: -5px;
      }
    #block1{
      top: -5px;
      right: -5px;
      }
    #block2{
      bottom: -5px;
      left: -5px;
      }
    #block3{
      bottom: -5px;
      right: -5px;
      }

#container {
  border: 2px solid #FFF;
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  color: #FFF;
  box-sizing: border-box;
  padding: 5px;
  position: absolute;
  left: 10px;
  }

#messages{
  position: relative;
  padding: 0px 10px 5px 10px;
  background-color: #000;
  border: 2px solid #FFF;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  scroll-behavior: smooth;
  }
  #messages::-webkit-scrollbar {
    display: none;
    }

#wsError{
	background-color:#F00;
	color:#FFF;
  border-bottom: 2px solid;
  border-top: 2px solid;
  line-height: 1.5em;
	text-align: center;
	padding: 10px;
	position: absolute;
	width: 100%;
  font-size: 1em;
	box-sizing:border-box;
	bottom: 10%;
  left: 0px;
  z-index: 9998;
	}
</style>
