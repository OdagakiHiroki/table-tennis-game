<template>
  <div class='posiiton-controller'>
    <div class="items top">
      <ControlButton
        class='control-button'
        @press='pressTop'
        @up='upTop'
      >
        <span>↑</span>
      </ControlButton>
    </div>
    <div class="items center">
      <ControlButton
        class='control-button'
        @press='pressLeft'
        @up='upLeft'
      >
        <span>←</span>
      </ControlButton>
      <ControlButton
        class='control-button'
        @press='pressRight'
        @up='upRight'
      >
        <span>→</span>
      </ControlButton>
    </div>
    <div class="items bottom">
      <ControlButton
        class='control-button'
        @press='pressBottom'
        @up='upBottom'
      >
        <span>↓</span>
      </ControlButton>
    </div>
  </div>
</template>

<script>
import ControlButton from '@/components/atoms/ControlButton.vue';

export default {
  name: 'PositionController',

  components: {
    ControlButton,
  },

  methods: {
    pressTop() {
      this.$emit('pressTop');
    },
    upTop() {
      this.$emit('upTop');
    },
    pressLeft() {
      this.$emit('pressLeft');
    },
    upLeft() {
      this.$emit('upLeft');
    },
    pressRight() {
      this.$emit('pressRight');
    },
    upRight() {
      this.$emit('upRight');
    },
    pressBottom() {
      this.$emit('pressBottom');
    },
    upBottom() {
      this.$emit('upBottom');
    },
  },
};
</script>

<style lang="scss" scoped>
.posiiton-controller{
  display: flex;
  flex-direction: column;
  align-items: center;
  .items + .items{
    margin-top: 10px;
  }
  .control-button{
    width: 60px;
    height: 60px;
    & + .control-button{
      margin-left: 80px;
    }
  }
  .top{
    display: flex;
  }
  .center{
    display: flex;
  }
  .bottom{
    display: flex;
  }
}
</style>
