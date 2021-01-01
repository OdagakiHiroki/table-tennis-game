import * as THREE from 'three';

const customThree = {
  // scene
  createScene() {
    return new THREE.Scene();
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
    const geometry = new THREE.PlaneGeometry(width, height, widthSegaments, heightSegments);
    return geometry;
  },
  createBoxGeometry(width = 1, height = 1, depth = 1) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    return geometry;
  },
  // material
  createMeshStandardMaterial() {
    const material = new THREE.MeshStandardMaterial();
    return material;
  },
  // mesh
  createMeshObj(geometry, material) {
    const meshObj = new THREE.Mesh(geometry, material);
    return meshObj;
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
  // createHelpers
  createCameraHelper(camera) {
    const cameraHelper = new THREE.CameraHelper(camera);
    return cameraHelper;
  },
  createDirectionalRightHelper(light) {
    const lightHelper = new THREE.DirectionalLightHelper(light);
    return lightHelper;
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
