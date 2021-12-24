<script lang="ts">
	import { onMount } from "svelte";
  import gsap from 'gsap';

  export let char;
  export let type;

  let el;

  onMount(() => {
    switch(type){
      default:
        break;
    }
    gsap.from(el, {color: "#00F", opacity: .3, duration: .2})
  });

</script>

<span class='letter' bind:this={el}>{@html char}</span>

<style>
  .letter{
      height: 36px;
      display: inline-flex;
      align-items: flex-end;
      }
</style>
