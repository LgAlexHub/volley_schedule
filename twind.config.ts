import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme : {
    extend : {
      backgroundImage : {
        'volley': "url('/volley.jpg')",
      }
    }
  }
} as Options;
