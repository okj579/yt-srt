<script setup lang="ts">
import { SubtitleTree } from "~/src/SubtitleTree";

const ytLink = ref("");
const generatedLink = ref();

const fileInput = ref<HTMLInputElement>();

const patterns = [
  /^([^\/&=\?]+)$/, // videoId
  /\bv=([^\/&=\?]+)/, // https://www.youtube.com/watch?v=_w6PCHutmb4
  /\/\/youtu.be\/([^\/&=\?]+)/, // https://youtu.be/lIbfMjZ0ME4
  /\/embed\/([^\/&=\?]+)/, // https://www.youtube.com/embed/lIbfMjZ0ME4
] as const;
const videoId = computed(() => {
  const link = ytLink.value;
  for (const pattern of patterns) {
    const m = link.match(pattern);
    if (m) return m[1];
  }
});

async function generate() {
  const file = fileInput.value?.files?.[0];
  if (!file) return;

  const tree = SubtitleTree.fromSrt(await file?.text());
  const srtData = await compressString(tree.serialize());
  generatedLink.value = `/watch#${videoId.value};${srtData}`;
}
</script>

<template>
  <div class="container">
    <h1>Add custom subtitles to any Youtube video</h1>

    <form submit.prevent>
      <div class="field">
        <label for="ytLink">Youtube Link</label>
        <input name="ytLink" v-model="ytLink" />
      </div>
      <div class="field">
        <label for="file">SRT file</label>
        <input
          name="file"
          type="file"
          accept=".srt,application/x-subrip"
          ref="fileInput"
        />
      </div>
      <div class="right">
        <button @click.prevent="generate">Generate link</button>
      </div>
    </form>
    <br /><br />
    <NuxtLink v-if="generatedLink" :to="generatedLink">Link</NuxtLink>
  </div>
</template>

<style scoped>
.container {
  padding: 5px 20px;
  margin: 0 auto;
  max-width: 800px;
}
.field {
  display: flex;
}
.field label {
  width: 150px;
}
form {
  width: 400px;
}
.right {
  text-align: right;
}
</style>
