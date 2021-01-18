<template>
  <div class='posiiton-controller'>
    <div class="items top">
      <ControlButton
        class='control-button'
        @mouseDown='mouseDownTop'
        @mouseUp='mouseUpTop'
      >
        <span>↑</span>
      </ControlButton>
    </div>
    <div class="items center">
      <ControlButton
        class='control-button'
        @mouseDown='mouseDownLeft'
        @mouseUp='mouseUpLeft'
      >
        <span>←</span>
      </ControlButton>
      <ControlButton
        class='control-button'
        @mouseDown='mouseDownRight'
        @mouseUp='mouseUpRight'
      >
        <span>→</span>
      </ControlButton>
    </div>
    <div class="items bottom">
      <ControlButton
        class='control-button'
        @mouseDown='mouseDownBottom'
        @mouseUp='mouseUpBottom'
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
    mouseDownTop() {
      this.$emit('mouseDownTop');
    },
    mouseUpTop() {
      this.$emit('mouseUpTop');
    },
    mouseDownLeft() {
      this.$emit('mouseDownLeft');
    },
    mouseUpLeft() {
      this.$emit('mouseUpLeft');
    },
    mouseDownRight() {
      this.$emit('mouseDownRight');
    },
    mouseUpRight() {
      this.$emit('mouseUpRight');
    },
    mouseDownBottom() {
      this.$emit('mouseDownBottom');
    },
    mouseUpBottom() {
      this.$emit('mouseUpBottom');
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
