<script setup lang="ts">
const isExtension = useIsExtension();
const form = ref({
  url: (useRoute().query.url as string) || "",
  temperature: 1,
});
const twitterCard = ref();
const facebookCard = ref();
const { generate: genImg } = useImageAi();

onMounted(() => {
  if (form.value.url) {
    handleImport({ ...form.value });
  }
});
async function handleImport(e: typeof form.value) {
  form.value = { ...e };
  if (!form.value.url) return;
  twitterCard.value.generate();
  facebookCard.value.generate();
  genImg(form.value.url);
}
</script>
<template>
  <h1 v-if="!isExtension" class="text-4xl my-10">
    Social Media Post Generator
  </h1>
  <UrlForm v-if="!isExtension" v-bind="form" @submit="handleImport"></UrlForm>
  <div>
    <CardTwitter ref="twitterCard" v-bind="form" class="mb-10" />
    <CardFacebook ref="facebookCard" v-bind="form" class="mb-10" />
    <CardImages :url="form.url" class="mb-10" />
  </div>
</template>
