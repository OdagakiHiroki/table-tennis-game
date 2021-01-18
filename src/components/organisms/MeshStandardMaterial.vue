<template>
  <div class='mesh-standard-material'>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'MeshStandardMaterial',

  data() {
    return {
      canvasWidth: 600,
      canvasHeight: 400,
      scene: new (this.$THREE).Scene(),
      renderer: null,
      light: new (this.$THREE).DirectionalLight(0xffffff),
      geometry: new (this.$THREE).TorusGeometry(10, 3, 16, 50),
      material: new (this.$THREE).MeshStandardMaterial({ color: 0x6699FF, roughness: 0.5 }),
    };
  },

  computed: {
    donut() {
      return new (this.$THREE).Mesh(this.geometry, this.material);
    },
    camera() {
      return new (this.$THREE).PerspectiveCamera(
        75,
        this.canvasWidth / this.canvasHeight,
        0.1,
        1000,
      );
    },
  },

  mounted() {
    const { canvas } = this.$refs;
    const { clientWidth, clientHeight } = canvas;
    this.canvasWidth = clientWidth;
    this.canvasHeight = clientHeight;
    this.renderer = new (this.$THREE).WebGLRenderer({
      antialias: true,
      canvas,
      alpha: false,
    });
    this.camera.position.set(0, 0, 20);
    this.light.position.set(0, 1, 4);
    this.scene.add(this.donut);
    const lightHelper = new (this.$THREE).DirectionalLightHelper(this.light);
    this.scene.add(this.light);
    this.scene.add(lightHelper);

    this.renderer.render(this.scene, this.camera);
  },
};
</script>

<style lang="scss" scoped>
.mesh-standard-material{
  width: 600px;
  height: 400px;
  .canvas{
    width: 100%;
    height: 100%;
  }
}
</style>
