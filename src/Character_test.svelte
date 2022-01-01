<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";

  export let chars = 't'

  onMount(() => {
    console.log('mounted')

  });

</script>

<span style="display: inline-flex">
  <span class='letter'>{chars}</span>
  <!--
  {#each letters as letter, idx}
  {/each}
  -->
</span>

<style>
  .letter{
      width: 13px;
      display: inline-flex;
      align-items: flex-end;
      }
</style>
