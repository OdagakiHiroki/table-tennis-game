<template>
  <div
    class='control-button'
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ControlButton',

  methods: {
    handleMouseDown() {
      this.$emit('mouseDown');
    },
    handleMouseUp() {
      this.$emit('mouseUp');
    },
  },
};
</script>

<style lang="scss" scoped>
.control-button{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #ebebeb;
  border: 1px solid #808080;
  border-radius: 100%;
}
</style>
