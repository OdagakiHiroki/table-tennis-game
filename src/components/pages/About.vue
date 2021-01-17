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
      canvas: null,
      scene: null,
      camera: null,
      pointLight: null,
      table: null,
    };
  },

  computed: {
  },

  watch: {
  },

  mounted() {
    const { canvas } = this.$refs;
    this.canvas = canvas;
    // ============canvasの世界を作成================
    // createRenderer
    this.renderer = this.$customThree.createWebGLRenderer({
      antialias: true,
      canvas: this.canvas,
      alpha: false,
    });
    // create mesh
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);// 視野角をラジアンに変換
    console.debug(this.canvas.clientHeight);
    const dist = (this.canvas.clientHeight / 2) / Math.tan(fovRad);// ウィンドウぴったりのカメラ距離
    // カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    const cmaeraPosi = { x: 0, y: 0, z: 0 };
    const cmaeraRota = { x: 0, y: 0, z: 0 };
    this.camera = this.$customThree.createPerspectiveCamera(
      fov, this.canvas.clientWidth, this.canvas.clientHeight, 1, dist * 2, cmaeraPosi, cmaeraRota,
    );
    console.debug(dist);
    this.camera.position.z = dist;// カメラを遠ざける
    this.pointLight = this.$customThree.createPointLight(
      0xFFFFFF, 1, 0, 1, { x: 400, y: 400, z: 400 },
    );
    const tableParams = {
      name: 'table',
      width: 300,
      height: 300,
      depth: 300,
      color: 0x09368C,
      mass: 0,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
    this.table = this.createTable(tableParams);
    this.canvas.addEventListener('pointermove', this.move);
    // createScene
    this.scene = this.$customThree.createScene();
    // add scene
    this.scene.add(
      this.pointLight,
      this.table,
    );
    // create controll
    this.orbitControls = this.$customThree.createOrbitControls(this.camera, this.canvas);
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
    createTable(tableParams) {
      const {
        width, height, depth, color,
      } = tableParams;
      const materialParams = { color };
      return this.$customThree.createTable(width, height, depth, materialParams);
    },
    calcRacketPosition(clientX, clientY) {
      // 見えているcanvasに対してxy座標を引いた場合のx、y座標を計算する
      const canvasX = clientX - (this.canvas.clientWidth / 2);
      const canvasY = -(clientY - (this.canvas.clientHeight / 2));
      console.debug('clientX: ', clientX);
      console.debug('canvasX: ', canvasX, 'canvasY: ', canvasY);
      // カメラの回転角を考慮して、cannon.js、three.jsの世界の座標軸で計算する
      // // sin, cosを使用して計算する
      // const dy = canvasY * Math.cos(Math.abs(this.camera.rotation.x));
      // const dz = -canvasY * Math.sin(Math.abs(this.camera.rotation.x));
      // const { y, z } = this.racketParams.initPosition;
      // return {
      //   x: canvasX,
      //   y: y + dy,
      //   z: z + dz,
      // };
    },
    move(e) {
      const canvasX = e.clientX - (this.canvas.clientWidth / 2);
      const canvasY = -(e.clientY - (this.canvas.clientHeight / 2));
      // const { x, y, z } = this.calcRacketPosition(e.clientX, e.clientY);
      console.debug(canvasX, canvasY);
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
