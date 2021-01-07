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
      cannonDebugRenderer: null,
      phyWorld: null,
      scene: null,
      renderer: null,
      orbitControls: null,
      phyWorldParams: {
        gravity: {
          x: 0,
          y: -9.8,
          z: 0,
        },
        iterations: 5,
        tolerance: 0.1,
      },
      cameraParams: {
        fov: 70,
        near: 0.1,
        far: 1000,
        position: {
          x: 0,
          y: 140,
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
        name: 'table',
        width: 152.5,
        height: 5,
        depth: 274,
        color: 0x09368C,
        mass: 0,
        position: {
          x: 0,
          y: 76,
          z: 0,
        },
      },
      netParams: {
        name: 'net',
        width: 152.5,
        height: 15.25,
        depth: 1,
        color: 0x09008A,
        mass: 0,
        opacity: 0.6,
        position: {
          x: 0,
          y: 76 + 7.125 + 2.5,
          z: 0,
        },
      },
      ballParams: {
        name: 'ball',
        radius: 2,
        color: 0xFFFFFF,
        mass: 100,
        position: {
          x: 30,
          y: 92,
          z: 102,
        },
      },
      racketParams: {
        bladeParams: {
          name: 'racketBlade',
          mass: 0,
          radius: 10,
          height: 6,
        },
        gripParams: {
          name: 'racketGrip',
          mass: 0,
          width: 6,
          height: 10,
          depth: 2,
        },
        position: {
          x: 30,
          y: 76,
          z: 160,
        },
      },
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
    phyTable() {
      const {
        name, mass, position, width, height, depth,
      } = this.tableParams;
      const size = { x: width, y: height, z: depth };
      return this.$customCannon.createTable(name, mass, position, size);
    },
    net() {
      const {
        width, height, depth, color, opacity,
      } = this.netParams;
      const materialParams = { color, opacity };
      return this.$customThree.createNet(width, height, depth, materialParams);
    },
    phyNet() {
      const {
        name, mass, position, width, height, depth,
      } = this.netParams;
      const size = { x: width, y: height, z: depth };
      return this.$customCannon.createNet(name, mass, position, size);
    },
    ball() {
      const { radius, color } = this.ballParams;
      return this.$customThree.createBall({ radius, color });
    },
    phyBall() {
      const {
        name, mass, position, radius,
      } = this.ballParams;
      return this.$customCannon.createBall(name, mass, position, radius);
    },
    // contactMaterial
    phyContactTableAndBall() {
      const options = {
        friction: 0.8, // 摩擦係数
        restitution: 0.8876, // 反発係数
      };
      return this.$customCannon.createContactMaterial(
        this.phyTable.material,
        this.phyBall.material,
        options,
      );
    },
    phyContactNetAndBall() {
      const options = {
        friction: 0.8, // 摩擦係数
        restitution: 0.1, // 反発係数
      };
      return this.$customCannon.createContactMaterial(
        this.phyNet.material,
        this.phyBall.material,
        options,
      );
    },
    racket() {
      const { bladeParams, gripParams, position } = this.racketParams;
      return this.$customThree.createRacket(bladeParams, gripParams, position);
    },
    phyRacket() {
      const { bladeParams, gripParams, position } = this.racketParams;
      return this.$customCannon.createRacket(bladeParams, gripParams, position);
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
    // ============物理シミュレーションの世界を作成================
    const { gravity, iterations, tolerance } = this.phyWorldParams;
    this.phyWorld = this.$customCannon.createWorld(gravity, iterations, tolerance);
    this.phyWorld.add(this.phyBall.body);
    this.phyWorld.add(this.phyTable.body);
    this.phyWorld.add(this.phyNet.body);
    this.phyWorld.add(this.phyRacket.blade.body);
    this.phyWorld.add(this.phyRacket.grip.body);
    this.phyWorld.addContactMaterial(this.phyContactTableAndBall);
    this.phyWorld.addContactMaterial(this.phyContactNetAndBall);
    // ============canvasの世界を作成================
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
    // createScene
    this.scene = this.$customThree.createScene(this.cameraHelper, this.pointLightHelper);
    // add scene
    this.scene.add(
      this.pointLight,
      this.room,
      this.table,
      this.net,
      this.ball,
      this.racket,
    );
    // create controll
    this.orbitControls = this.$customThree.createOrbitControls(this.camera, canvas);
    // set debugger
    this.cannonDebugRenderer = this.$customCannon.createCannonDebugRendferer(
      this.scene, this.phyWorld,
    );
    // render
    this.animate();
  },

  methods: {
    animate() {
      requestAnimationFrame(this.animate);
      this.phyWorld.step(1 / 60);
      this.ball.position.copy(this.phyBall.body.position);
      this.ball.quaternion.copy(this.phyBall.body.quaternion);
      this.table.position.copy(this.phyTable.body.position);
      this.table.quaternion.copy(this.phyTable.body.quaternion);
      this.net.position.copy(this.phyNet.body.position);
      this.net.quaternion.copy(this.phyNet.body.quaternion);
      // update debugRender
      this.cannonDebugRenderer.update();
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
