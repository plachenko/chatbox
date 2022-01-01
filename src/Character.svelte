<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
  import gsap from 'gsap';

  export let chars;
  let scrollSpeed = 90;

  let el = [];
  let letters = [];

  const IMGptrn = /<img class="emoticon" src="http:\/\/static-cdn.jtvnw.net[^>]*\/?>/g;
  const dispatch = createEventDispatcher();

  onMount(() => {
    let idx = 0;

    if(!chars) return;
    console.log(chars)

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

      letters = chars.split('');
      console.log(letters);
      idx++;
    }, scrollSpeed);
  });

  function fadeIn(node){
    gsap.from(node, { color: '#00F', opacity: 0, duration: 1 });
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
