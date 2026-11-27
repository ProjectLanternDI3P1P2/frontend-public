<script lang="ts">
export enum ProgressTone {
  ACCENT = "accent",
  SUCCESS = "success",
  DANGER = "danger",
  ARCANE = "arcane",
}
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value: number;
    max?: number;
    label?: string;
    tone?: ProgressTone;
    showValue?: boolean;
  }>(),
  { max: 100, label: "", tone: ProgressTone.ACCENT, showValue: false },
);
</script>

<template>
  <div class="ui-progress" :class="'ui-progress--' + tone">
    <div v-if="label || showValue" class="ui-progress__heading">
      <span v-if="label">{{ label }}</span
      ><span v-if="showValue">{{ Math.round((value / max) * 100) }}%</span>
    </div>
    <progress
      class="ui-progress__track"
      :aria-label="label || 'Progress'"
      :max="max"
      :value="value"
    />
  </div>
</template>

<style scoped lang="scss">
.ui-progress {
  display: grid;
  gap: var(--space-2);
}
.ui-progress__heading {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
.ui-progress__track {
  --progress-fill: var(--color-accent);
  appearance: none;
  width: 100%;
  height: var(--space-3);
  overflow: hidden;
  border: 0;
  border-radius: var(--radius-pill);
  background-color: var(--color-surface-base);
}
.ui-progress__track::-webkit-progress-bar {
  background-color: transparent;
}
.ui-progress__track::-webkit-progress-value {
  border-radius: var(--radius-pill);
  background-color: var(--progress-fill);
  transition: width var(--duration-slow) var(--easing-standard);
}
.ui-progress__track::-moz-progress-bar {
  border-radius: var(--radius-pill);
  background-color: var(--progress-fill);
}
.ui-progress--success .ui-progress__track {
  --progress-fill: var(--color-success);
}
.ui-progress--danger .ui-progress__track {
  --progress-fill: var(--color-danger);
}
.ui-progress--arcane .ui-progress__track {
  --progress-fill: var(--color-arcane);
}
</style>
