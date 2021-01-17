<template>
  <div class="game-main">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
const RALLY_STATUS = {
  before: 0,
  during: 1,
  after: 2,
};

export default {
  name: 'GameMain',

  data() {
    return {
      // status
      rallyStatus: RALLY_STATUS.before,
      // base
      canvas: null,
      cannonDebugRenderer: null,
      phyWorld: null,
      scene: null,
      renderer: null,
      orbitControls: null,
      // camera
      camera: null,
      // light
      pointLight: null,
      // mesh
      room: null,
      table: null,
      phyTable: null,
      net: null,
      phyNet: null,
      ball: null,
      phyBall: null,
      racket: null,
      phyRacket: null,
      // contactMaterial
      phyContactTableAndBall: null,
      phyContactNetAndBall: null,
      // helpers
      cameraHelper: null,
      pointLightHelper: null,
      // param
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
        fov: 60,
        near: 1,
        farMagnification: 8,
        position: {
          x: 0,
          // y: 160,
          y: 360,
          z: 80,
        },
        rotation: {
          // x: -30,
          x: 0,
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
          y: 900 * 4,
          z: 222 * 4,
        },
      },
      roomParams: {
        width: 1000 * 4,
        height: 1000 * 4,
        depth: 1000 * 4,
      },
      tableParams: {
        name: 'table',
        width: 152.5 * 4,
        height: 5 * 4,
        depth: 274 * 4,
        color: 0x09368C,
        mass: 0,
        position: {
          x: 0,
          y: 76 * 4,
          z: 0,
        },
      },
      netParams: {
        name: 'net',
        width: 152.5 * 4,
        height: 15.25 * 4,
        depth: 1 * 4,
        color: 0x09008A,
        mass: 0,
        opacity: 0.6,
        position: {
          x: 0,
          y: 76 * 4 + 7.125 * 4 + 2.5 * 4,
          z: 0,
        },
      },
      ballParams: {
        name: 'ball',
        radius: 2 * 4,
        color: 0xFFFFFF,
        mass: 100,
        position: {
          x: 30 * 4,
          y: 76 * 4 + ((5 * 4) / 2) + 2 * 4, // tablePositionHeight - tableHeight / 2 - ballRadius
          z: 102 * 4,
        },
      },
      racketParams: {
        bladeParams: {
          name: 'racketBlade',
          mass: 0,
          radius: 10 * 4,
          height: 6 * 4,
        },
        gripParams: {
          name: 'racketGrip',
          mass: 0,
          width: 6 * 4,
          height: 10 * 4,
          depth: 2 * 4,
        },
        position: {
          x: 30 * 4,
          y: 76 * 4,
          z: 160 * 4,
        },
        initPosition: { // three.jsのgroupしたものとcannon.jsのposition差を埋めるために使用
          x: 30 * 4,
          y: 76 * 4,
          z: 160 * 4,
        },
        isControllble: false,
      },
    };
  },

  computed: {
    canvasWidth() {
      return this.canvas.clientWidth;
    },
    canvasHeight() {
      return this.canvas.clientHeight;
    },
    racketPosition() {
      return this.racketParams.position;
    },
  },

  watch: {
    rallyStatus(rallyStatus) {
      if (rallyStatus === RALLY_STATUS.during) {
        this.addDuringRallyEvent(this.canvas);
      }
    },
    racketPosition(position) {
      // console.debug('position', { ...position });
      this.$customCannon.setPosition(this.phyRacket.blade, position);
    },

  },

  mounted() {
    const { canvas } = this.$refs;
    this.canvas = canvas;
    // ============物理シミュレーションの世界を作成================
    const { gravity, iterations, tolerance } = this.phyWorldParams;
    this.phyWorld = this.$customCannon.createWorld(gravity, iterations, tolerance);
    // create material
    this.phyTable = this.createPhyTable(this.tableParams);
    this.phyNet = this.createPhyNet(this.netParams);
    this.phyBall = this.createPhyBall(this.ballParams);
    this.phyRacket = this.createPhyRacket(this.racketParams);
    // create contactMaterial
    this.phyContactTableAndBall = this.createContactMaterial(
      this.phyTable,
      this.phyBall,
      { friction: 0.8, restitution: 0.8876 },
    );
    this.phyContactNetAndBall = this.createContactMaterial(
      this.phyNet,
      this.phyBall,
      { friction: 0.8, restitution: 0.1 },
    );
    // add world
    this.phyWorld.addBody(this.phyBall.body);
    this.phyWorld.addBody(this.phyTable.body);
    this.phyWorld.addBody(this.phyNet.body);
    this.phyWorld.addBody(this.phyRacket.blade.body);
    this.phyWorld.addBody(this.phyRacket.grip.body);
    this.phyWorld.addContactMaterial(this.phyContactTableAndBall);
    this.phyWorld.addContactMaterial(this.phyContactNetAndBall);
    // ============canvasの世界を作成================
    // createRenderer
    this.renderer = this.$customThree.createWebGLRenderer({
      antialias: true,
      canvas: this.canvas,
      alpha: false,
    });
    // create mesh
    this.camera = this.createCamera(this.cameraParams, this.canvasWidth, this.canvasHeight);
    this.pointLight = this.createPointLight(this.pointLightParams);
    this.room = this.createRoom(this.roomParams);
    this.table = this.createTable(this.tableParams);
    this.net = this.createNet(this.netParams);
    this.ball = this.createBall(this.ballParams);
    this.racket = this.createRacket(this.racketParams);
    // create helper
    this.cameraHelper = this.createCameraHelper(this.camera);
    this.pointLightHelper = this.createPointLightHelper(this.pointLight);
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
    // this.orbitControls = this.$customThree.createOrbitControls(this.camera, this.canvas);
    // set debugger
    this.cannonDebugRenderer = this.$customCannon.createCannonDebugRendferer(
      this.scene, this.phyWorld,
    );
    // add event
    this.addBeforeRallyEvent(this.canvas);
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
      // this.setRacketPosition();
      // update debugRender
      this.cannonDebugRenderer.update();
      this.renderer.render(this.scene, this.camera);
      // update controll
      // this.orbitControls.update();
    },
    changeRallyStatus(rallyStatus) {
      this.rallyStatus = rallyStatus;
    },
    changeRacketControllabe(isControllable) {
      this.racketParams = { ...this.racketParams, isControllable };
    },
    // create object funbctions
    createCamera(cameraParams, canvasWidth, canvasHeight) {
      const {
        fov, near, farMagnification, position, rotation,
      } = cameraParams;
      return this.$customThree.createPerspectiveCamera(
        fov, canvasWidth, canvasHeight, near, farMagnification, position, rotation,
      );
    },
    createPointLight(pointLightParams) {
      const {
        color, intensity, distance, decay, position,
      } = pointLightParams;
      return this.$customThree.createPointLight(color, intensity, distance, decay, position);
    },
    createRoom(roomParams) {
      const { width, height, depth } = roomParams;
      return this.$customThree.createRoom(width, height, depth);
    },
    createTable(tableParams) {
      const {
        width, height, depth, color,
      } = tableParams;
      const materialParams = { color };
      return this.$customThree.createTable(width, height, depth, materialParams);
    },
    createPhyTable(tableParams) {
      const {
        name, mass, position, width, height, depth,
      } = tableParams;
      const size = { x: width, y: height, z: depth };
      return this.$customCannon.createTable(name, mass, position, size);
    },
    createNet(netParams) {
      const {
        width, height, depth, color, opacity,
      } = netParams;
      const materialParams = { color, opacity };
      return this.$customThree.createNet(width, height, depth, materialParams);
    },
    createPhyNet(netParams) {
      const {
        name, mass, position, width, height, depth,
      } = netParams;
      const size = { x: width, y: height, z: depth };
      return this.$customCannon.createNet(name, mass, position, size);
    },
    createBall(ballParams) {
      const { radius, color } = ballParams;
      return this.$customThree.createBall({ radius, color });
    },
    createPhyBall(ballParams) {
      const {
        name, mass, position, radius,
      } = ballParams;
      return this.$customCannon.createBall(name, mass, position, radius);
    },
    createRacket(racketParams) {
      const { bladeParams, gripParams, position } = racketParams;
      return this.$customThree.createRacket(bladeParams, gripParams, position);
    },
    createPhyRacket(racketParams) {
      const { bladeParams, gripParams, position } = racketParams;
      return this.$customCannon.createRacket(bladeParams, gripParams, position);
    },
    // create contactMaterial
    createContactMaterial(material1, material2, options = {}) {
      return this.$customCannon.createContactMaterial(
        material1.material,
        material2.material,
        options,
      );
    },
    // create helper
    createCameraHelper(camera) {
      return this.$customThree.createCameraHelper(camera);
    },
    createPointLightHelper(pointLight) {
      return this.$customThree.createPointLightHelper(pointLight, 30);
    },
    // add event functions
    addBeforeRallyEvent(targetElment) {
      targetElment.addEventListener('click', this.ballToss);
    },
    addDuringRallyEvent(targetElment) {
      targetElment.addEventListener('pointerdown', this.grabRacket);
      targetElment.addEventListener('pointermove', this.moveRacket);
      targetElment.addEventListener('pointerup', this.releaseRacket);
    },
    calcRacketPosition(clientX, clientY) {
      // 見えているcanvasに対してxy座標を引いた場合のx、y座標を計算する
      const canvasX = clientX - (this.canvasWidth / 2);
      const canvasY = -(clientY - (this.canvasHeight / 2));
      // カメラの回転角を考慮して、cannon.js、three.jsの世界の座標軸で計算する
      // sin, cosを使用して計算する
      const dy = canvasY * Math.cos(Math.abs(this.camera.rotation.x));
      const dz = -canvasY * Math.sin(Math.abs(this.camera.rotation.x));
      const { y, z } = this.racketParams.initPosition;
      return {
        x: canvasX,
        y: y + dy,
        z: z + dz,
      };
    },
    // setRacketPosition() {
    //   const { x, y, z } = this.racketParams.initPosition;
    //   const vec3 = this.$customThree.calcPosition(
    //     this.phyRacket.blade.body.position,
    //     { x: -x, y: -y, z: -z },
    //   );
    //   this.racket.position.copy(vec3);
    //   // NOTE: 回転も必要ならここで計算して設定する
    //   this.racket.quaternion.copy(this.phyRacket.blade.body.quaternion);
    // },
    // evnet functions
    ballToss(e) {
      if (this.rallyStatus === RALLY_STATUS.before) {
        this.$customCannon.toss(this.phyBall.body, { x: 0, y: 40, z: 0 });
        e.target.removeEventListener('click', this.ballToss);
        this.rallyStatus = RALLY_STATUS.during;
      }
    },
    grabRacket() {
      this.changeRacketControllabe(true);
    },
    moveRacket(e) {
      const { isControllable } = this.racketParams;
      if (isControllable) {
        const { x, y, z } = this.calcRacketPosition(e.clientX, e.clientY);
        console.debug(x, y, z);
        // sin, cosを使用して計算する
        // const position = { ...this.racketParams.position, x, y };
        this.racketParams = { ...this.racketParams, position: { x, y, z } };
      }
    },
    releaseRacket() {
      this.changeRacketControllabe(false);
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
