<script lang="ts">
  import gsap from "gsap/all";

	import { onMount, afterUpdate } from "svelte";
	import { createEventDispatcher } from 'svelte';

  import Character from './Character.svelte';

  const dispatch = createEventDispatcher();
  const IMGptrn = /<img class="emoticon" src="http:\/\/static-cdn.jtvnw.net[^>]*\/?>/g;
  const ELptrn = /<[^>]*\/?>/g;

  export let msg;
  export let usr;
  export let color;

  let usrEl;
  let sepEl;

  let splitMsg;
  let endMsg = '';
  let tmpMsg = [];
  let idx = 0;
  let usrDisp = false;

  onMount(()=>{
    // Check if someone is trying to hack...
    if(msg.match(ELptrn) && !msg.match(IMGptrn)) return;

    // Do the user animation and split the string at the end.
    gsap.from(usrEl, {x:"-=5", opacity: 0, color: "#F00", duration: .3, delay: .3,
      onStart: () => {
        usrDisp = true;
        dispatch('update', 1);
      }, onComplete: ()=>{
        splitfunc();

        endMsg = tmpMsg[idx];
        console.log(endMsg[idx]);
      }
    });

    // Do the seperator animation
    gsap.from(sepEl, {opacity: 0, color: "#0F0", duration: .3, delay: .5});
  });

  function splitfunc(){
    //Split the message
    splitMsg = msg.split('|');

    splitMsg.forEach((el)=>{

      // if it's an emoticon put the entire element.
      // else split the string
      const msgPart = el.match(IMGptrn) ? el : el.split(' ');

      tmpMsg = [...tmpMsg, msgPart];
    });

  }

  function stopEvt(){
    if(idx <= tmpMsg.length-1){
      idx++;
      endMsg = tmpMsg[idx-1];
    }else {
      dispatch('stopped');
    }
    // console.log('next word!!', endMsg);
  }

  // dispatch update event for autoscroll
  afterUpdate(()=>{
    if(usrDisp) dispatch('update', 0)
  });

</script>

<div class="msgLine">
  <span class="user" style="color: {color}" bind:this={usrEl}>{usr}</span>
  <span class="seperator" bind:this={sepEl}>:</span>
  <span class="message">
    {#if idx > 0}
    <span class="space">&nbsp;</span>
    {/if}
    <Character
      on:stopped = {stopEvt}
      bind:chars = {endMsg[idx]}
      />
  </span>
</div>

<style>
  .space{
    display: inline-block;
    width: 8px;
  }
  .seperator{
    display: inline-block;
  }
  .user{
    height: 36px;
    display: inline-flex;
    align-items: flex-end;
    }
  .msgLine{
    line-height: 24px;
    }

</style>
