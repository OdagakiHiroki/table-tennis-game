<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/logo.png">
    <MeshStandardMaterial></MeshStandardMaterial>
  </div>
</template>

<script>
import MeshStandardMaterial from '@/components/organisms/MeshStandardMaterial.vue';

export default {
  name: 'Home',
  components: {
    MeshStandardMaterial,
  },
};
</script>
