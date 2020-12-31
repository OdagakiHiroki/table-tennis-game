import RotateBox from '@/components/organisms/RotateBox.vue';

export default {
  title: 'Materials/RotateBox',
  component: RotateBox,
};

const Template = () => ({
  components: { RotateBox },
  template: '<rotate-box />',
});

export const Basic = Template.bind({});
