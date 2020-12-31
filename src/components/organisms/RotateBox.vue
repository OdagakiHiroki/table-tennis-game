<template>
  <div class='rotate-box'>
    <canvas id="canvas" width="600" height="400"></canvas>
  </div>
</template>

<script>

export default {
  name: 'RotateBox',

  data() {
    return {
      scene: new (this.$THREE).Scene(),
      renderer: null,
      camera: new (this.$THREE).PerspectiveCamera(75, 600 / 400, 0.1, 1000),
      light: new (this.$THREE).DirectionalLight(0xffffff),
      geometry: new (this.$THREE).BoxGeometry(1, 1, 1),
      material: new (this.$THREE).MeshNormalMaterial(),
    };
  },

  computed: {
    cube() {
      return new (this.$THREE).Mesh(this.geometry, this.material);
    },
  },

  mounted() {
    const $canvas = document.getElementById('canvas');
    this.renderer = new (this.$THREE).WebGLRenderer({
      antialias: true,
      canvas: $canvas,
      alpha: true, // NOTE: 背景を透明にする
    });
    this.camera.position.set(0, 0, 2);
    this.light.position.set(0, 0, 10);
    this.scene.add(this.cube);
    this.scene.add(this.light);

    this.animate();
  },

  methods: {
    animate() {
      requestAnimationFrame(this.animate);

      // 現在の時間を秒単位で取得
      const sec = performance.now() / 1000;

      // 1秒で45度回転
      this.cube.rotation.x = sec * (Math.PI / 4);
      this.cube.rotation.y = sec * (Math.PI / 4);

      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
