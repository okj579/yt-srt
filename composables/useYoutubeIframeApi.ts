export function useYoutubeIframeApi(): Promise<typeof YT> {
  useHead({
    script: [
      {
        src: "https://www.youtube.com/iframe_api",
        async: true,
      },
    ],
  });

  return new Promise((resolve) => {
    if ((window as any).YT?.ready) {
      (window as any).YT.ready(resolve);
    } else {
      (window as any).onYouTubeIframeAPIReady = resolve;
    }
  }).then(() => (window as any).YT);
}
