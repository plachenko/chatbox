<script lang="ts">
	import { onMount } from "svelte";
  import gsap from 'gsap';

  export let char;
  export let type;
  export let lbreak = false;

  let el;

  onMount(() => {
    // console.log(char)
    if(char == '\n') lbreak = true;
    switch(type){
      default:
        break;
    }
    gsap.from(el, {color: "#00A", opacity: .3, duration: .4});
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
