<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
  import gsap from 'gsap';

  export let chars;
  export let type;

  let scrollSpeed = 20;

  let el = [];
  let letters = [];

  const IMGptrn = /<img class="emoticon" src="http:\/\/static-cdn.jtvnw.net[^>]*\/?>/g;
  const dispatch = createEventDispatcher();

  onMount(() => {
    let idx = 0;

    if(chars.match(IMGptrn)){
      letters = [chars];
      return;
    }

    let tickInt = setInterval(()=>{
      if(idx >= chars.length-1){
        clearInterval(tickInt);
        dispatch('stopped')
        tickInt = null;
      }

      letters = [...letters, chars.split('')[idx]];

      idx++;
    }, scrollSpeed);
  });

  function fadeIn(node){
    gsap.from(node, { color: '#00F', opacity: 0 });
  }
</script>

<span style="display: inline-flex">
  {#each letters as letter, idx}
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
