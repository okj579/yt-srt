<script setup lang="ts">
import { SubtitleTree } from "~/src/SubtitleTree";

const [videoId, subData] = useRoute().hash?.slice(1).split(";");
if (!videoId || !subData) navigateTo("/");

const subtitles = SubtitleTree.fromSerialized(await decompressString(subData));
</script>

<template>
  <div>
    <SubtitlePlayer
      class="subtitlePlayer"
      :videoId="videoId"
      :subtitles="subtitles"
    />
  </div>
</template>

<style scoped>
.subtitlePlayer {
  margin: 0 auto;
  width: 1280px;
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}
</style>
