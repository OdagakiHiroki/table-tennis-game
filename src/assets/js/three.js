import * as THREE from 'three';

const customThree = {
  // scene
  createScene(...objects) {
    const scene = new THREE.Scene();
    const objectLength = objects.length;
    if (objects.length > 0) {
      for (let objIndex = 0; objIndex < objectLength; objIndex += 1) {
        scene.add(objects[objIndex]);
      }
    }
    scene.add(this.createGridHelper(300, 10, 0x8800FF));
    scene.add(this.createAxesHelper(300));
    return scene;
  },
  // renderer
  createWebGLRenderer(params) {
    return new THREE.WebGLRenderer(params);
  },
  // camera
  createPerspectiveCamera(fov = 50, aspectRatio = 1, near = 0.1, far = 2000) {
    return new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  },
  // light
  createDirectionalLight(color = 0xffffff, intensity = 1) {
    return new THREE.DirectionalLight(color, intensity);
  },
  // geometry
  createPlaneGeometry(width = 1, height = 1, widthSegaments = 1, heightSegments = 1) {
    return new THREE.PlaneGeometry(width, height, widthSegaments, heightSegments);
  },
  createBoxGeometry(width = 1, height = 1, depth = 1) {
    return new THREE.BoxGeometry(width, height, depth);
  },
  createSphereGeometory(radius = 1, widthSegments = 8, heightSegments = 6) {
    return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  },
  // material
  createMeshStandardMaterial() {
    const material = new THREE.MeshStandardMaterial();
    return material;
  },
  // mesh
  createMeshObj(geometry, material) {
    return new THREE.Mesh(geometry, material);
  },
  // object
  createPlane(width = 1, height = 1, widthSegaments = 1, heightSegments = 1) {
    const planeGeometry = this.createPlaneGeometry(width, height, widthSegaments, heightSegments);
    const meshStandardMaterial = this.createMeshStandardMaterial();
    return this.createMeshObj(planeGeometry, meshStandardMaterial);
  },
  createCube(width = 1, height = 1, depth = 1) {
    const boxGeometry = this.createBoxGeometry(width, height, depth);
    const meshStandardMaterial = this.createMeshStandardMaterial();
    return this.createMeshObj(boxGeometry, meshStandardMaterial);
  },
  createBall(radius = 1, widthSegments = 100, heightSegments = 100) {
    const ballGeometry = this.createSphereGeometory(radius, widthSegments, heightSegments);
    const meshStandardMaterial = this.createMeshStandardMaterial();
    return this.createMeshObj(ballGeometry, meshStandardMaterial);
  },
  // createHelpers
  createCameraHelper(camera) {
    return new THREE.CameraHelper(camera);
  },
  createDirectionalRightHelper(light) {
    return new THREE.DirectionalLightHelper(light);
  },
  createAxesHelper(size) {
    return new THREE.AxesHelper(size);
  },
  createGridHelper(size = 10, divisions = 10, colorCenterLine = 0x444444, colorGrid = 0x888888) {
    return new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
  },
  // methods
  setPosition(obj, { x = null, y = null, z = null }) {
    obj.position.set(x || obj.position.x, y || obj.position.y, z || obj.position.z);
  },
  setRotation(obj, { x = null, y = null, z = null }) {
    obj.rotation.set(x || obj.rotation.x, y || obj.rotation.y, z || obj.rotation.z);
  },
};

export {
  THREE,
  customThree,
};
