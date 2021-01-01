<template>
  <div class="game-main">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'GameMain',

  data() {
    return {
      cameraFov: 100,
      cameraFrustumNearPlane: 0.1,
      cameraFrustumFarPlane: 1000,
      directionalLightColor: 0xFFFFFF,
      directionalLightIntensity: 1,
      ballSize: 4,
      renderer: null,
    };
  },

  computed: {
    canvasWidth() {
      return this.$refs.canvas.clientWidth;
    },
    canvasHeight() {
      return this.$refs.canvas.clientHeight;
    },
    aspectRatio() {
      return this.canvasWidth / this.canvasHeight;
    },
    camera() {
      return this.$customThree.createPerspectiveCamera(
        this.cameraFov,
        this.aspectRatio,
        this.cameraFrustumNearPlane,
        this.cameraFrustumFarPlane,
      );
    },
    directionalLight() {
      return this.$customThree.createDirectionalLight(
        this.directionalLightColor,
        this.directionalLightIntensity,
      );
    },
    plane() {
      return this.$customThree.createPlane(150, 150, 64, 64);
    },
    ball() {
      return this.$customThree.createBall(this.ballSize);
    },
    // helpers
    cameraHelper() {
      return this.$customThree.createCameraHelper(this.camera);
    },
    directionalLightHelper() {
      return this.$customThree.createDirectionalRightHelper(this.directionalLight);
    },
  },

  mounted() {
    // createRenderer
    this.renderer = this.$customThree.createWebGLRenderer({
      antialias: true,
      canvas: this.$refs.canvas,
      alpha: false,
    });
    // setPosition, setRotation
    this.$customThree.setPosition(this.camera, { x: 0, y: 120, z: 150 });
    this.$customThree.setRotation(this.camera, { x: Math.PI / -10 });
    this.$customThree.setPosition(this.directionalLight, { x: 0, y: 150, z: 0 });
    this.$customThree.setRotation(this.plane, { x: Math.PI / -2 });
    this.$customThree.setPosition(this.ball, { x: 30, y: 40, z: 60 });
    // createScene
    const scene = this.$customThree.createScene(this.cameraHelper, this.directionalLightHelper);
    // add scene
    scene.add(
      this.directionalLight,
      this.ball,
      this.plane,
    );
    // render
    this.renderer.render(scene, this.camera);
  },
};
</script>

<style lang="scss" scoped>
.game-main{
  width: 100vw;
  height: 100vh;
  .canvas{
    width: 100%;
    height: 100%;
  }
}
</style>
