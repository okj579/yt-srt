<script setup lang="ts">
const { videoId } = defineProps<{
  videoId: string;
}>();

const emit = defineEmits<{
  (e: "progress", position: number): void;
  (e: "play"): void;
  (e: "pause"): void;
  (e: "stop"): void;
}>();

const containerEl = ref<HTMLElement>();
const player = ref<YT.Player>();

onMounted(async () => {
  const YT = await useYoutubeIframeApi();

  const playerEl = document.createElement("div");
  containerEl.value!.appendChild(playerEl);

  player.value = new YT.Player(playerEl, { videoId });
  player.value.addEventListener(
    "onStateChange",
    (event: YT.OnStateChangeEvent) => {
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          onPlay();
          break;
        case YT.PlayerState.PAUSED:
        case YT.PlayerState.BUFFERING:
          onPause();
          break;
        default:
          onStop();
      }
    }
  );
});

const { pause, resume } = useIntervalFn(
  () => emit("progress", player.value!.getCurrentTime()),
  100,
  { immediate: false }
);

function onPlay() {
  emit("play");
  emit("progress", player.value!.getCurrentTime());
  resume();
}
function onPause() {
  emit("pause");
  emit("progress", player.value!.getCurrentTime());
  pause();
}
function onStop() {
  emit("progress", player.value!.getCurrentTime());
  emit("stop");
  pause();
}
</script>

<template>
  <div class="player" ref="containerEl"></div>
</template>

<style scoped>
.player {
  width: 640px;
  height: 320px;
  position: relative;
}
.player:deep() > * {
  width: 100%;
  height: 100%;
}
</style>
