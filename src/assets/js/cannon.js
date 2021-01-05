import * as CANNON from 'cannon';

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
};

export {
  CANNON,
  customCannon,
};
