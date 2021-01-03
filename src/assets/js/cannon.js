import * as CANNON from 'cannon';

const customCannon = {
  // world
  createWorld(gravity = { x: 0, y: 0, z: 0 }, iterations, tolerance) {
    const world = new CANNON.World();
    // ぶつかっている可能性のあるオブジェクト同士を見つける
    this.setWorldParams(world, gravity, iterations, tolerance);
    return world;
  },
  setWorldParams(world, gravity = { x: 0, y: 0, z: 0 }, iterations, tolerance) {
    const { gX, gY, gZ } = gravity;
    world.gravity.set(gX, gY, gZ);
    /* eslint-disable no-param-reassign */
    world.solver.iterations = iterations;
    world.solver.tolerance = tolerance;
    /* eslint-enable */
  },
};

export {
  CANNON,
  customCannon,
};
