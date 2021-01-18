<template>
  <div class="game-main">
    <canvas ref="canvas" class="canvas"></canvas>
    <ControlButton
      class='action-button'
      @press='handleAction'
    >
      <span>{{actionButtonText}}</span>
    </ControlButton>
    <PositionController
      class="position-controller"
      @pressTop="startMoveRacket('Top')"
      @upTop="stopMoveRacket('Top')"
      @pressLeft="startMoveRacket('Left')"
      @upLeft="stopMoveRacket('Left')"
      @pressRight="startMoveRacket('Right')"
      @upRight="stopMoveRacket('Right')"
      @pressBottom="startMoveRacket('Bottom')"
      @upBottom="stopMoveRacket('Bottom')"
    />
  </div>
</template>

<script>
import ControlButton from '@/components/atoms/ControlButton.vue';
import PositionController from '@/components/molecules/PositionController.vue';

const RALLY_STATUS = {
  before: 0,
  during: 1,
  after: 2,
};

export default {
  name: 'GameMain',

  components: {
    ControlButton,
    PositionController,
  },

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
        fov: 70,
        near: 0.1,
        far: 1000,
        position: {
          x: 0,
          y: 140,
          z: 222,
        },
        rotation: {
          x: Math.PI / -6,
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
          y: 76 + (5 / 2) + 2, // tablePositionHeight - tableHeight / 2 - ballRadius
          z: 102,
        },
      },
      racketParams: {
        bladeParams: {
          name: 'racketBlade',
          mass: 100,
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
        initPosition: { // three.jsのgroupしたものとcannon.jsのposition差を埋めるために使用
          x: 30,
          y: 76,
          z: 160,
        },
        isControllableTop: false,
        isControllableLeft: false,
        isControllableRight: false,
        isControllableBottom: false,
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
    aspectRatio() {
      return this.canvasWidth / this.canvasHeight;
    },
    actionButtonText() {
      return this.rallyStatus === RALLY_STATUS.before ? 'トス ' : 'スイング';
    },
  },

  watch: {
    rallyStatus(rallyStatus) {
      if (rallyStatus === RALLY_STATUS.during) {
        this.addDuringRallyEvent(this.canvas);
      }
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
    // this.phyWorld.addBody(this.phyRacket.grip.body);
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
    this.camera = this.createCamera(this.cameraParams, this.aspectRatio);
    this.pointLight = this.createPointLight(this.pointLightParams);
    this.room = this.createRoom(this.roomParams);
    this.table = this.createTable(this.tableParams);
    this.net = this.createNet(this.netParams);
    this.ball = this.createBall(this.ballParams);
    this.racket = this.createRacket(this.racketParams);
    // create helper
    this.cameraHelper = this.createCameraHelper(this.camera);
    this.pointLightHelper = this.createPointLightHelper(this.pointLight);
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
    this.orbitControls = this.$customThree.createOrbitControls(this.camera, this.canvas);
    // set debugger
    this.cannonDebugRenderer = this.$customCannon.createCannonDebugRendferer(
      this.scene, this.phyWorld,
    );
    // add event
    // this.addBeforeRallyEvent(this.canvas);
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
      this.setRacketPosition();
      // update debugRender
      this.cannonDebugRenderer.update();
      this.renderer.render(this.scene, this.camera);
      // update controll
      // this.orbitControls.update();
    },
    changeRallyStatus(rallyStatus) {
      this.rallyStatus = rallyStatus;
    },
    changeRacketControllabe(direction, isControllable) {
      const key = `isControllable${direction}`;
      this.racketParams = { ...this.racketParams, [key]: isControllable };
    },
    // create object funbctions
    createCamera(cameraParams, aspectRatio) {
      const { fov, near, far } = cameraParams;
      return this.$customThree.createPerspectiveCamera(fov, aspectRatio, near, far);
    },
    createPointLight(pointLightParams) {
      const {
        color, intensity, distance, decay,
      } = pointLightParams;
      return this.$customThree.createPointLight(color, intensity, distance, decay);
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
    // addBeforeRallyEvent(targetElment) {
    //   targetElment.addEventListener('click', this.ballToss);
    // },
    addDuringRallyEvent() {
      // // targetElment.addEventListener('mousedown', this.startMoveRacket);
      // // targetElment.addEventListener('mousemove', this.moveRacket);
      // // targetElment.addEventListener('mouseup', this.releaseRacket);
      // targetElment.addEventListener('pointerdown', this.startMoveRacket);
      // targetElment.addEventListener('pointermove', this.moveRacket);
      // targetElment.addEventListener('pointerup', this.releaseRacket);
    },
    calcRacketPosition(clientX, clientY) {
      return {
        x: clientX - (this.canvasWidth / 2),
        y: clientY - (this.canvasHeight / 2),
      };
    },
    setRacketPosition() {
      this.moveRacketTop('Top');
      this.moveRacketLeft('Left');
      this.moveRacketRight('Right');
      this.moveRacketBottom('Bottom');
      const { x, y, z } = this.racketParams.initPosition;
      this.$customCannon.setPosition(this.phyRacket.blade, this.racketParams.position);

      // const { bladeParams, gripParams, position } = this.racketParams;
      // const { width: gripWidth, height: gripHeight } = gripParams;
      // const { radius: bladeRadius } = bladeParams;
      // const gripPositon = this.$customCannon.calcRacketGripPosition(
      //   gripWidth, gripHeight, bladeRadius, position,
      // );
      // this.$customCannon.setPosition(this.phyRacket.grip, gripPositon);
      const vec3 = this.$customThree.calcPosition(
        this.phyRacket.blade.body.position,
        { x: -x, y: -y, z: -z },
      );
      this.racket.position.copy(vec3);
      // NOTE: 回転も必要ならここで計算して設定する
      this.racket.quaternion.copy(this.phyRacket.blade.body.quaternion);
    },
    // racket control
    startMoveRacket(key) {
      this.changeRacketControllabe(key, true);
    },
    // TODO: 共通化
    moveRacketTop(direction) {
      const isControllable = this.racketParams[`isControllable${direction}`];
      if (!isControllable) {
        return;
      }
      const dy = 1;
      this.racketParams.position = {
        ...this.racketParams.position,
        y: this.racketParams.position.y + dy,
      };
      this.racketParams = { ...this.racketParams, position: this.racketParams.position };
    },
    moveRacketLeft(direction) {
      const isControllable = this.racketParams[`isControllable${direction}`];
      if (!isControllable) {
        return;
      }
      const dx = 1;
      this.racketParams.position = {
        ...this.racketParams.position,
        x: this.racketParams.position.x - dx,
      };
      this.racketParams = { ...this.racketParams, position: this.racketParams.position };
    },
    moveRacketRight(direction) {
      const isControllable = this.racketParams[`isControllable${direction}`];
      if (!isControllable) {
        return;
      }
      const dx = 1;
      this.racketParams.position = {
        ...this.racketParams.position,
        x: this.racketParams.position.x + dx,
      };
      this.racketParams = { ...this.racketParams, position: this.racketParams.position };
    },
    moveRacketBottom(direction) {
      const isControllable = this.racketParams[`isControllable${direction}`];
      if (!isControllable) {
        return;
      }
      const dy = 1;
      this.racketParams.position = {
        ...this.racketParams.position,
        y: this.racketParams.position.y - dy,
      };
      this.racketParams = { ...this.racketParams, position: this.racketParams.position };
    },
    stopMoveRacket(direction) {
      this.changeRacketControllabe(direction, false);
    },
    // action control
    handleAction() {
      if (this.rallyStatus === RALLY_STATUS.before) {
        this.ballToss();
        return;
      }
      if (this.rallyStatus === RALLY_STATUS.during) {
        this.swingRacket();
      }
    },
    ballToss() {
      if (this.rallyStatus === RALLY_STATUS.before) {
        this.$customCannon.toss(this.phyBall.body, { x: 0, y: 16, z: 0 });
        this.rallyStatus = RALLY_STATUS.during;
      }
    },
    swingRacket() {
      this.$customCannon.swing(this.phyRacket.blade.body, { x: 0, y: 1, z: 0 });
      console.debug('swing!!', this.phyRacket);
      // const dz = 10;
      // this.racketParams.position = {
      //   ...this.racketParams.position,
      //   z: this.racketParams.position.z - dz,
      // };
      // this.racketParams = { ...this.racketParams, position: this.racketParams.position };
    },
  },
};
</script>

<style lang="scss" scoped>
.game-main{
  position: relative;
  width: 100vw;
  height: 100vh;
  .canvas{
    width: 100%;
    height: 100%;
  }
  .action-button{
    position: absolute;
    bottom: 40px;
    left: 40px;
    width: 200px;
    border-radius: 16px;
  }
  .position-controller{
    position: absolute;
    bottom: 40px;
    right: 40px;
  }
}
</style>
