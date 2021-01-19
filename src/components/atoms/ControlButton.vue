<template>
  <div
    class='control-button'
    @mousedown="handlePress"
    @mouseup="handleUp"
    @touchstart.prevent="handlePress"
    @touchend.prevent="handleUp"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ControlButton',

  methods: {
    handlePress() {
      this.$emit('press');
    },
    handleUp() {
      this.$emit('up');
    },
  },
};
</script>

<style lang="scss" scoped>
.control-button{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4vw;
  height: 4vw;
  min-width: 40px;
  min-height: 40px;
  background-color: #ebebeb;
  border: 1px solid #808080;
  border-radius: 100%;
}
</style>
