<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let username = '';
  export let oauth = '';
  export let channel = '';
  export let connected = false;

  function sendData(e){
    if(connected){
      dispatch('twitchDisconnect')
      return;
    }
    LSsetData();
    dispatch('sendData', {
      username,
      oauth,
      channel
    });
  }

  function LSsetData(){
    localStorage.setItem('username', username);
    localStorage.setItem('oauth', oauth);
    localStorage.setItem('channel', channel);
  }

  function LSResetData(){
    username = '';
    oauth = '';
    channel = '';

    localStorage.clear();
  }

</script>

<div id="menu">
  <form>
    <fieldset>
      <legend>User Credentials {connected}</legend>
      <div>
        <label for="username">Username</label>
        <input disabled={connected} type="input" bind:value={username} name="username" id="username">
      </div>
      <div>
        <label for="oauth">OAuth</label>
        <input disabled={connected} type="password" bind:value={oauth} name="oauth" id="oauth">
      </div>
      <div>
        <label for="channel">Channel</label>
        <input disabled={connected} type="input" on:input|preventDefault bind:value={channel} name="channel" id="channel">
      </div>
      <div id="submit" on:click={sendData}>
        {#if connected}dis{/if}connect
      </div>
      <!-- <div id="submit" on:click={LSResetData}>Reset</div> -->
    </fieldset>
  </form>
</div>

<style>
  #menu{
    -webkit-app-region: no-drag !important;
  }
  div{
    margin: 10px;
    }

  #submit{
    padding: 10px 0px;
    border: 2px solid;
    text-align: center;
    cursor: pointer;
    box-sizing:border-box;
    user-select: none;
    }
    #submit:hover{
      background-color: #FFF;
      color: #000;
    }
    input{
      width: 100%;
      margin: 10px 0px;
      padding: 10px;
      font-family: 'Golden Sun';
      box-sizing: border-box;
      }


</style>
