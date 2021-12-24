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
  export let timer = 100;

  let usrEl;
  let sepEl;

  let type = 0;

  let splitMsg;
  let endMsg = [];
  let tmpMsg = [];
  let idx = 0;

  let scrollSpeed = 40;

  onMount(()=>{
    // Check if someone is trying to hack...
    if(msg.match(ELptrn) && !msg.match(IMGptrn)) return;

    // Do the user animation
    gsap.from(usrEl, {x:"-=5", opacity: .5, color: "#F00", duration: .3, onComplete: ()=>{
        // on the animation completion start the string splitting.
        splitfunc();
      }
    });

    // Do the seperator animation
    gsap.from(sepEl, {opacity: 0, x:"+=5", color: "#0F0", duration: .3, delay: .2});
  });

  function splitfunc(){
    //Split the message
    splitMsg = msg.split('|');

    splitMsg.forEach((el)=>{
      if(el.match(IMGptrn)){
        // if it's an emoticon put the entire element.
        tmpMsg = [...tmpMsg, el];
      } else {
        // else split the string, and then on each letter if it's a space replace it with a '&nbsp'
        let letters = el.split('').map(letter => letter.trim().length ? letter : '&nbsp;');

        // append it to the current tmpMsg
        tmpMsg = [...tmpMsg, ...letters];
      }
    });

    let tickInt = setInterval(()=>{
      if(idx >= tmpMsg.length-1){
        clearInterval(tickInt);
        dispatch('stopped')
        tickInt = null;
      }
      endMsg = [...endMsg, tmpMsg[idx]];
      idx++
    }, scrollSpeed);
  }

  afterUpdate(()=>{
    // dispatch update event for autoscroll
    dispatch('update')
  });

</script>

<div class="msgLine">
  <span class="user" style="color: {color}" bind:this={usrEl}>{usr}</span>
  <span class="seperator" bind:this={sepEl}>:</span>
  <span class="message">
    {#each endMsg as inner}
      <Character
        bind:char = {inner}
        bind:type = {type}
        />
    {/each}
  </span>
  <!--
  <span
    class="msg"
    bind:this={msgContainer}>
      {@html endMsg}
  </span>

  -->
</div>

<style>
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
