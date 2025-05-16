import ScheduleItemArea from "./components/schedule-item-area.vue";

window.panel.plugin("IMA/kirby-schedule-field", {
  fields: {
    schedule: ScheduleItemArea,
  },
});
