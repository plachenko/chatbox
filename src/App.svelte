<script lang="ts">
	import { afterUpdate, onMount } from "svelte";
	import Message from './Message.svelte';

	let ws;
	let connected = false;
  let msgIdx = 0;
	let messages = [];
  let msgEl;
  let curMsgIdx = 0;

  let curAxis = null;

  let container;
  let mouseCont;

  const scrollMsg = () => msgEl.scrollTop = msgEl.scrollHeight;

	onMount(()=>{
		connect();

    addEventListener('keydown', (e)=>{
      switch(e.which){
        case 88:
          curAxis = 'x';
          break;
        case 90:
          curAxis = 'y';
          break;
      }
    });

    addEventListener('keyup', (e)=>{
      switch(e.which){
        case 88:
          if(curAxis == 'x') curAxis = null;
          break;
        case 90:
          if(curAxis == 'y') curAxis = null;
          break;
      }
    });

    mouseCont.addEventListener('mousemove', (e)=>{
      if(!curAxis) return;
      if(curAxis == 'x'){
        container.style.width = `${e.clientX}px`;
      }else{
        container.style.height = `${e.clientY}px`;
      }
    });
	});

	function connect(){
		ws = new WebSocket('ws://localhost:6969');

		ws.onopen = (e) => {
			connected = true;
		};

		ws.addEventListener('close', (e)=> {
			setTimeout(() => {
				connected = false;
				connect();
			}, 1000);
		});

		ws.onmessage = (e) => {
			const data = JSON.parse(e.data);
			messages = [...messages, data];
      // if(!messages.length) messages = [...tmpMessages];
		};
	}

	function stopEvt(){
		console.log('stopped...');
    curMsgIdx++;
    // if(tmpMessages[msgIdx++]) messages = [...messages, tmpMessages[msgIdx]];
	}
</script>

<main>
  <div bind:this={mouseCont} id="mouseContainer"></div>
  <div id="container" bind:this={container}>

    {#each Array(4) as block, idx}
      <div class="block" id="block{idx}">
        <div class="innerBlock" />
      </div>
    {/each}

    <div id="messages" bind:this={msgEl}>
      {#if !connected}
      <div id="wsError">Connecting...</div>
      {/if}

      {#each messages as mesg, idx}
        {#if idx <= curMsgIdx}
        <Message
          on:update={scrollMsg}
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
  width: 300px;
  height: 400px;
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
	}
</style>
