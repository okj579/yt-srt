<script setup lang="ts">
import type { SubtitleTree } from "@@/src/SubtitleTree";
const { videoId, subtitles } = defineProps<{
  videoId: string;
  subtitles: SubtitleTree;
}>();

const currentSubtitle = ref();

function updateSubtitle(currentTime: number) {
  if (
    currentSubtitle.value &&
    currentSubtitle.value.end >= currentTime &&
    currentSubtitle.value.start <= currentTime
  ) {
    return;
  }

  currentSubtitle.value = subtitles.find(currentTime);
}
</script>

<template>
  <div class="container">
    <YoutubePlayer
      class="player"
      :videoId="videoId"
      @progress="updateSubtitle"
    />
    <div class="captions">
      <div v-for="text in currentSubtitle?.text ?? []">{{ text }}</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  overflow: hidden;
}

.player,
.captions {
  width: 100%;
  height: 100%;
  position: absolute;
}

.captions {
  height: auto;
  bottom: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;

  pointer-events: none;
}

.captions > * {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px 20px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
}
</style>
