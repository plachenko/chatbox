import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
    settings: {
      bgcolor: '#000000',
      textcolor: '#FFFFFF',
      chromacolor: '#00FF00'
    }
	}
});

export default app;
