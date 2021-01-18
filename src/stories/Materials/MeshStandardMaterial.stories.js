import MeshStandardMaterial from '@/components/organisms/MeshStandardMaterial.vue';

export default {
  title: 'Materials/MeshStandardMaterial',
  component: MeshStandardMaterial,
};

const Template = () => ({
  components: { MeshStandardMaterial },
  template: '<mesh-standard-material />',
});

export const Basic = Template.bind({});
