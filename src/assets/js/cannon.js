import * as THREE from 'three';
import * as CANNON from 'cannon';
import initCannonDebugRenderer from './cannonDebugRenderer';

const customCannon = {
  // world
  createWorld(gravity = { x: 0, y: 0, z: 0 }, iterations, tolerance) {
    const world = new CANNON.World();
    // ぶつかっている可能性のあるオブジェクト同士を見つける
    world.broadphase = new CANNON.NaiveBroadphase();
    this.setWorldParams(world, gravity, iterations, tolerance);
    return world;
  },
  setWorldParams(world, gravity = { x: 0, y: 0, z: 0 }, iterations = 5, tolerance = 0.1) {
    const { x: gX, y: gY, z: gZ } = gravity;
    world.gravity.set(gX, gY, gZ);
    /* eslint-disable no-param-reassign */
    // 反復計算回数
    world.solver.iterations = iterations;
    // 許容値
    world.solver.tolerance = tolerance;
    /* eslint-enable */
  },
  // material
  createCube(name, mass, position = { x: 0, y: 0, z: 0 }, size = { x: 0, y: 0, z: 0 }) {
    const material = new CANNON.Material(name);
    const { x: positionX, y: positionY, z: positionZ } = position;
    const { x: sizeX, y: sizeY, z: sizeZ } = size;
    const body = new CANNON.Body({
      material,
      mass,
      position: new CANNON.Vec3(positionX, positionY, positionZ),
      shape: new CANNON.Box(new CANNON.Vec3(sizeX / 2, sizeY / 2, sizeZ / 2)),
    });
    body.angularVelocity.set(0, 0, 0);
    body.angularDamping = 0.1;
    return { material, body };
  },
  createBall(name, mass, position = { x: 0, y: 0, z: 0 }, radius) {
    const material = new CANNON.Material(name);
    const { x: positionX, y: positionY, z: positionZ } = position;
    const body = new CANNON.Body({
      material,
      mass,
      position: new CANNON.Vec3(positionX, positionY, positionZ),
      shape: new CANNON.Sphere(radius),
    });
    body.angularVelocity.set(0, 0, 0);
    body.angularDamping = 0.1;
    return { material, body };
  },
  createTable(name, mass, position = { x: 0, y: 0, z: 0 }, size = { x: 0, y: 0, z: 0 }) {
    const { material, body } = this.createCube(name, mass, position, size);
    return { material, body };
  },
  createNet(name, mass, position = { x: 0, y: 0, z: 0 }, size = { x: 0, y: 0, z: 0 }) {
    const { material, body } = this.createCube(name, mass, position, size);
    return { material, body };
  },
  createRacket(
    bladeParams, gripParams, position = { x: 0, y: 0, z: 0 },
  ) {
    // TODO: bodyにaddShapeすることで複数の形状をまとめることができるらしい
    const {
      name: bladeName, mass: bladeMass, radius: bladeRadius, height: bladeHeight,
    } = bladeParams;
    const bladeMaterial = new CANNON.Material(bladeName);
    const { x: bladePositionX, y: bladePositionY, z: bladePositionZ } = position;
    const bladeBody = new CANNON.Body({
      bladeMaterial,
      mass: bladeMass,
      position: new CANNON.Vec3(bladePositionX, bladePositionY, bladePositionZ),
      shape: new CANNON.Cylinder(bladeRadius, bladeRadius, bladeHeight / 2, 8),
    });

    const {
      name: gripName, mass: gripMass, width: gripWidth, height: gripHeight, depth: gripDepth,
    } = gripParams;
    const gripSize = { x: gripWidth, y: gripHeight, z: gripDepth };
    const gripPositionX = bladePositionX - (bladeRadius / 2) - (gripHeight / 2);
    const gripPositionY = bladePositionY - (gripWidth / 2);
    const gripPositionZ = bladePositionZ;
    const gripPosition = { x: gripPositionX, y: gripPositionY, z: gripPositionZ };
    const {
      material: gripMaterial, body: gripBody,
    } = this.createCube(gripName, gripMass, gripPosition, gripSize);
    gripBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI * (11 / 18));
    return {
      blade: {
        material: bladeMaterial,
        body: bladeBody,
      },
      grip: {
        material: gripMaterial,
        body: gripBody,
      },
    };
  },
  // contactMaterial
  createContactMaterial(material1, material2, options) {
    const baseOptions = {
      contactEquationRelaxation: 3, // TODO: 生成された接触方程式の緩和時間？とは？？
      contactEquationStiffness: 10000000, // TODO: 生成された接触方程式の剛性？とは？？
      friction: 0.3, // 摩擦係数
      frictionEquationRelaxation: 3, // TODO: 生成された摩擦方程式の緩和時間？とは？？
      frictionEquationStiffness: 10000000, // TODO: 生成された摩擦方程式の剛性？とは？？
      restitution: 0.3, // 反発係数
    };
    const contactMaterial = new CANNON.ContactMaterial(
      material1,
      material2,
      { ...baseOptions, ...options },
    );
    return contactMaterial;
  },
  // method
  setPosition(material, position = { x: null, y: null, z: null }) {
    const { x, y, z } = position;
    material.body.position.set(
      x || material.body.position.x,
      -y || material.body.position.y,
      z || material.body.position.z,
    );
  },
  toss(body, velocity = { x: 0, y: 0, z: 0 }) {
    // const { x: velocityX, y: velocityZ, z: velocityZ, };
    const { x, y, z } = velocity;
    body.velocity.set(x, y, z);
  },
  // helper
  createCannonDebugRendferer(scene, world) {
    initCannonDebugRenderer(THREE, CANNON);
    return new THREE.CannonDebugRenderer(scene, world);
  },
};

export {
  CANNON,
  customCannon,
};
