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
        fov: 70,
        near: 0.1,
        far: 1000,
        position: {
          x: 0,
          y: 160,
          z: 222,
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
          y: 900,
          z: 222,
        },
      },
      roomParams: {
        width: 1000,
        height: 1000,
        depth: 1000,
      },
      tableParams: {
        width: 152.5,
        height: 5,
        depth: 274,
        color: 0x09368C,
        position: {
          x: 0,
          y: 76,
          z: 0,
        },
      },
      netParams: {
        width: 152.5,
        height: 15.25,
        depth: 1,
        color: 0x09008A,
        position: {
          x: 0,
          y: 76 + 7.125 + 2.5,
          z: 0,
        },
      },
      ballParams: {
        radius: 2,
        color: 0xFFFFFF,
        position: {
          x: 30,
          y: 92,
          z: 142,
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
    // TODO: カメラを遠近感のないものに変更する
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
    table() {
      const {
        width, height, depth, color,
      } = this.tableParams;
      const materialParams = { color };
      return this.$customThree.createTable(width, height, depth, materialParams);
    },
    net() {
      const {
        width, height, depth, color,
      } = this.netParams;
      const materialParams = { color };
      return this.$customThree.createNet(width, height, depth, materialParams);
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
    const { position: tablePosition } = this.tableParams;
    this.$customThree.setPosition(this.table, { ...tablePosition });
    const { position: netPosition } = this.netParams;
    this.$customThree.setPosition(this.net, { ...netPosition });
    const { position: ballPosition } = this.ballParams;
    this.$customThree.setPosition(this.ball, { ...ballPosition });
    // createScene
    this.scene = this.$customThree.createScene(this.cameraHelper, this.pointLightHelper);
    // add scene
    this.scene.add(
      this.pointLight,
      this.room,
      this.table,
      this.net,
      this.ball,
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
