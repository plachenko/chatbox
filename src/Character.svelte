<script lang="ts">
	import { onMount } from "svelte";
  import gsap from 'gsap';

  export let char;
  export let type;
  export let lbreak = false;

  let el;

  onMount(() => {
    if(char == '\n') lbreak = true;
    switch(type){
      default:
        break;
    }
    gsap.from(el, {color: "#00A", opacity: .6, duration: .2});
  });

</script>

<span class='letter' style="display: {lbreak ? 'block' : 'inline-flex'}; height: {lbreak ? '0px' : '36px'}" bind:this={el}>{@html char}</span>

<style>
  .letter{
      /* width: 13px; */
      /* display: inline-flex; */
      align-items: flex-end;
      }
</style>
