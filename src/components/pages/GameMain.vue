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
      cameraParams: {
        fov: 100,
        near: 0.1,
        far: 1000,
        position: {
          x: 0,
          y: 100,
          z: 150,
        },
        rotation: {
          x: Math.PI / -60,
          y: 0,
          z: 0,
        },
      },
      pointLightParams: {
        color: 0xFFFFFF,
        intensity: 4,
        distance: 0,
        decay: 1,
        position: {
          x: 0,
          y: 250,
          z: 0,
        },
      },
      roomParams: {
        width: 300,
        height: 300,
        depth: 300,
      },
      ballParams: {
        radius: 4,
        color: 0xFFFFFF,
        position: {
          x: 30,
          y: 40,
          z: 60,
        },
      },
      scene: null,
      renderer: null,
      orbitControls: null,
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
      const { fov, near, far } = this.cameraParams;
      return this.$customThree.createPerspectiveCamera(fov, this.aspectRatio, near, far);
    },
    pointLight() {
      const {
        color, intensity, distance, decay,
      } = this.pointLightParams;
      return this.$customThree.createPointLight(color, intensity, distance, decay);
    },
    room() {
      const { width, height, depth } = this.roomParams;
      return this.$customThree.createRoom(width, height, depth);
    },
    ball() {
      const { radius, color } = this.ballParams;
      return this.$customThree.createBall({ radius, color });
    },
    // helpers
    cameraHelper() {
      return this.$customThree.createCameraHelper(this.camera);
    },
    pointLightHelper() {
      return this.$customThree.createPointLightHelper(this.pointLight, 30);
    },
  },

  mounted() {
    const { canvas } = this.$refs;
    // createRenderer
    this.renderer = this.$customThree.createWebGLRenderer({
      antialias: true,
      canvas,
      alpha: false,
    });
    // setPosition, setRotation
    const { position: cameraPosition, rotation: cameraRotation } = this.cameraParams;
    this.$customThree.setPosition(this.camera, { ...cameraPosition });
    this.$customThree.setRotation(this.camera, { ...cameraRotation });
    const { position: pointLightPosition } = this.pointLightParams;
    this.$customThree.setPosition(this.pointLight, { ...pointLightPosition });
    const { position: ballPosition } = this.ballParams;
    this.$customThree.setPosition(this.ball, { ...ballPosition });
    // createScene
    this.scene = this.$customThree.createScene(this.cameraHelper, this.pointLightHelper);
    // add scene
    this.scene.add(
      this.pointLight,
      this.ball,
      this.room,
    );
    // create controll
    this.orbitControls = this.$customThree.createOrbitControls(this.camera, canvas);
    // render
    this.animate();
  },

  methods: {
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      // update controll
      // this.orbitControls.update();
    },
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
