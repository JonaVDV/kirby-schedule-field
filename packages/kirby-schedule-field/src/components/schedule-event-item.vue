<template>
  <li
    class="event"
    @dblclick.stop="editEvent(event)"
    :style="{ top: cssTopValue + '%' }"
  >
    <div class="event-content">
      <span class="event-title">{{ item?.title }}</span>
      <span class="event-time"
        >{{ event.startTime.substring(0, 5) }} -
        {{ event.endTime.substring(0, 5) }}</span
      >
      <span class="event-location">{{ item?.location }}</span>
    </div>

    <k-options-dropdown
      :options="itemOptions"
      :text="false"
      icon="dots"
      size="xs"
      class="event-options-trigger"
      @action="handleAction($event)"
    />
  </li>
</template>

<script>
import { defineComponent } from "vue";
import { eventEditDialog, openDeleteDialog } from "../dialogs/event-dialogs";

/**
 * @typedef {Object} Event
 * @property {string} itemId - The ID of the event.
 * @property {string} startDate - The start time of the event.
 * @property {string} endDate - The end time of the event.
 * @property {number} dayOfWeek - The day of the week of the event.
 * @property {string} instanceId - The instance ID of the event.
 * @property {string} startTime - The start time of the event.
 * @property {string} endTime - The end time of the event.
 * @property {number} duration - The duration of the event in hours.
 * @property {boolean} recurring - Indicates if the event is recurring.
 * @property {string | null} recurringEndDate - The end date of the recurring event.
 */

export default defineComponent({
  props: {
    event: {
      /**
       * The event object.
       * @type {import('vue').PropType<Event>}
       */
      type: Object,
      required: true,
    },
  },
  inject: ["allItems"],
  methods: {
    /**
     *
     * @param event {Event}
     */
    deleteEvent(event) {
      openDeleteDialog(() => {
        console.log("Deleting event:", event);
        this.$emit("delete-event", event.instanceId);
      });
    },
    /**
     * Opens the edit dialog for the event. and returns the new values.
     * @param event {Event}
     */
    editEvent(event) {
      eventEditDialog((newValues) => {
        this.$emit("edit-event", event.instanceId, newValues);
      }, event);
    },

    handleAction(action) {
      switch (action) {
        case "edit":
          this.editEvent(this.event);
          break;
        case "delete":
          this.deleteEvent(this.event);
          break;
        default:
          console.warn("Unknown action:", action);
      }
    },
  },
  computed: {
    /**
     * Returns the item object for the event.
     * @returns {import('./create-item.vue').Item | undefined}
     */
    item() {
      return this.allItems.find((item) => item.id === this.event.itemId);
    },
    duration() {
      // Ensure it's a number, provide a default if necessary
      return Number(this.event.duration) || 1;
    },
    cssTopValue() {
      // Calculate the top position based on the event's start time and duration
      const startTime = this.event.startTime.split(":");
      const startHour = Number(startTime[0]);
      const startMinute = Number(startTime[1]);
      const t = (1 / 60) * startMinute;
      return t * 100;
    },
    /**
     * @typedef {Object} ItemOption
     * @property {string} text - The text to display for the option.
     * @property {string} icon - The icon to display for the option.
     * @property {string} click - The action to perform when the option is selected.
     * @property {string} [theme] - The theme for the option.
     *
     * @returns {ItemOption[]}
     */
    itemOptions() {
      return [
        { text: this.$t("dropdown.edit"), icon: "edit", click: "edit" }, // Translate text
        {
          text: this.$t("dropdown.delete"),
          icon: "trash",
          click: "delete",
          theme: "negative",
        }, // Translate text
      ];
    },
  },
  emits: ["delete-event", "edit-event"],
});
</script>

<style scoped>
li.event {
  --duration: v-bind(duration);
  --bg: v-bind(item?.color); /* Default color */
  list-style: none;
  background-color: var(--bg);
  min-height: calc(var(--hour-row-height) * var(--duration));
  position: absolute;
  width: var(--event-width);
  left: var(--event-left);
  z-index: 1;
  border-radius: var(--rounded-sm); /* Use Kirby's border radius */
  box-shadow: var(--shadow-sm); /* Use Kirby's shadow */
  display: flex;
  justify-content: space-between;
  pointer-events: fill;
  align-items: flex-start;
  padding: var(--spacing-1) var(--spacing-2);
  cursor: pointer;
  transition: width 0.3s ease, opacity 1s ease, left 0.3s ease;
}

li.event:hover {
  width: 100%;
  left: 0%;
  z-index: 2;
}

.event-content {
  display: grid;
  gap: var(--spacing-1);
  pointer-events: none;
}

.k-toolbar {
  display: none;
  position: absolute;
  bottom: 100%;
  left: calc(100% - var(--spacing-3));
  z-index: var(--z-toolbar);
}
li.event:hover {
  box-shadow: var(--shadow-lg);
}

.event-time {
  margin-top: auto;
}

.event-time,
.event-location {
  font-size: var(--text-xs); /* Use Kirby's smaller text size */
  color: var(--bg);
  filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
  mix-blend-mode: luminosity;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-title {
  font-weight: var(--font-bold); /* Use Kirby's font weight */
  color: var(--bg);
  filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
  mix-blend-mode: luminosity;
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
