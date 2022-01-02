<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
  import gsap from 'gsap';

  export let chars;
  let scrollSpeed = 140;

  let el = [];
  let letters = [];
  let idx = 0;
  let endLetter = [];

  const IMGptrn = /<img class="emoticon" src="http:\/\/static-cdn.jtvnw.net[^>]*\/?>/g;
  const dispatch = createEventDispatcher();

  onMount(() => {
    if(!chars) return;

    if(chars.match(IMGptrn)){
      letters = [chars];
      return;
    }

    let tickInt = setInterval(()=>{
      if(idx > chars.length-1){
        dispatch('stopped')
        clearInterval(tickInt);
        tickInt = null;
        return;
      }

      letters = chars.split('');
      endLetter = [...endLetter, letters[idx]];
      idx++;
    }, scrollSpeed);
  });

  function fadeIn(node){
    gsap.from(node, { color: '#00F', opacity: 0, duration: .5 });
  }
</script>

<span style="display: inline-flex">
  <!--
  {#if letters[idx]}
    {letters[idx]}
  {/if}
  -->

  {#each endLetter as letter, iidx}
  <!-- {letter} -->
  <span class='letter' transition:fadeIn>{@html letter}</span>
  {/each}
</span>

<style>
  .letter{
      width: 13px;
      display: inline-flex;
      align-items: flex-end;
      }
</style>
