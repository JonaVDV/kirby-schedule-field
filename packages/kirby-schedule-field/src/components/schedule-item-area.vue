<template>
  <k-field v-bind="$props" class="k-schedule-field">
    <div>
      <CreateItem
        @delete-items="deleteItem"
        @add-items="saveItem"
        @edit-items="editItem"
        :items="items"
        :fields="create"
        :endpoints="endpoints"
      />
    </div>
    <div class="schedule-navigation">
      <div class="schedule-navigation-buttons">
        <k-button
          icon="angle-left"
          variant="filled"
          theme="blue"
          @click="currentDay = currentDay.subtract(1, 'week')"
        />
        <k-button
          icon="angle-right"
          variant="filled"
          theme="blue"
          @click="currentDay = currentDay.add(1, 'week')"
        />
      </div>
      <span class="week-label">
        {{ displayWeeklabel }}
      </span>
      <k-button
        icon="calendar"
        theme="blue"
        variant="filled"
        @click="goToToday"
      >
        {{ $t("field.schedule.goToToday") }}
      </k-button>
    </div>
    <div>
      <ScheduleTable
        :current-day="currentDay"
        :time-range-start="timeRangeStart"
        :time-range-end="timeRangeEnd"
        @delete-event="deleteEvent"
        @create-event="createEvent"
        @edit-event="editEvent"
        @move-event="moveEvent"
      />
    </div>
  </k-field>
</template>

<script lang="js">
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isBetween from "dayjs/plugin/isBetween";
import ScheduleEventItem from "./schedule-event-item.vue";
import ScheduleTable from "./schedule-table.vue";
import { defineComponent, computed } from "vue";
import CreateItem from "./create-item.vue";
import { openItemDeleteDialog } from "../dialogs/item-dialogs";
import { getLocale } from "../utils/dayjs-languages";

/**
 *
 * @typedef {import('../types/index').Event} Event
 *
 * @typedef {Object} Value
 * @property {import('./schedule-event-item.vue').Event[]} events - The events for the schedule.
 * @property {import('./create-item.vue').Item[]} items - The items for the schedule.
 *
 * @typedef {Object} createProps
 * @property {Object[]} fields - The fields to be used in the create item form.
 *
 */

export default defineComponent({
  components: {
    ScheduleEventItem,
    ScheduleTable,
    CreateItem,
  },
  props: {
    value: {
      /**
       * @type {import('vue').PropType<Value>}
       */
      type: Object,
      default: () => ({
        items: [],
        events: [],
      }),
    },
    timeRangeStart: {
      type: Number,
      default: 8,
    },
    timeRangeEnd: {
      type: Number,
      default: 22,
    },
    create: {
      /**
       * @type {import('vue').PropType<createProps>}
       */
      type: [Object],
    },
    endpoints: Object,
  },
  data() {
    return {
      /**
       * @type {Value['items']}
       */
      items: [],
      /**
       * @type {Value['events']}
       * @description The events for the current week.
       */
      events: [],
      currentDay: this.$library.dayjs(),
      /**
       * @type {Required<Parameters<typeof this.$library.dayjs.locale>[1]> | null}
       */
      userLocale: null,
    };
  },
  provide() {
    return {
      allItems: computed(() => this.items),
      allEvents: computed(() => this.events),
      // currentDay: computed(() => this.currentDay),
    };
  },
  async beforeMount() {
    this.$library.dayjs.extend(weekOfYear);
    this.$library.dayjs.extend(advancedFormat);
    this.$library.dayjs.extend(isBetween);

    const dayJSLang = await getLocale(this.$panel.user.language);
    this.userLocale = dayJSLang;
    this.currentDay = this.$library.dayjs().locale(dayJSLang);
  },
  computed: {
    startOfWeek() {
      return this.currentDay.startOf("week");
    },
    endOfWeek() {
      return this.currentDay.endOf("week");
    },
    displayWeeklabel() {
      // Use the endOfWeek date to determine the year and week number for display
      return this.endOfWeek.format("YYYY-ww");
    },
  },
  watch: {
    value: {
      /**
       *
       * @param newValue {Value}
       */
      handler(newValue) {
        this.items = newValue.items || [];
        this.events = newValue.events || [];

        this.$emit("input", {
          items: newValue.items,
          events: newValue.events,
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     *
     * @param data {import('./create-item.vue').Item}
     */
    saveItem(data) {
      // Logic to save the event
      console.log("Event data:", data.title);
      const id = this.$helper.string.uuid();
      data.id = id;
      this.items.push(data);
      console.log("Items after save:", this.items);

      this.$emit("input", {
        items: this.items,
        events: this.events,
      });
    },
    /**
     *
     * @param data {import('./create-item.vue').Item}
     * @param id {string}
     */
    editItem(data, id) {
      console.log("Editing item with id:", id, "New values:", data);
      const index = this.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...data };
        this.$emit("input", {
          items: this.items,
          events: this.events,
        });
      }
    },
    goToToday() {
      this.currentDay = this.$library.dayjs().locale(this.userLocale);
    },
    form() {
      const fields = this.$helper.field.subfields(this, {
        lecturer: {
          type: "users",
          label: "Lecturer",
          multiple: false,
          required: true,
        },
      });

      console.log(fields);
      return fields;
    },

    /**
     *
     * @param eventData {Event}
     */
    createEvent(eventData) {
      this.events.push(eventData);
      this.$emit("input", {
        items: this.items,
        events: this.events,
      });
    },
    /**
     * @param payload {Object}
     * @param payload.instanceId {string}
     * @param payload.newValues {Partial<Event>}
     */
    moveEvent({ instanceId, newValues }) {
      console.log(
        "Moving event with instanceId:",
        instanceId,
        "New values:",
        newValues,
      );

      const index = this.events.findIndex(
        (event) => event.instanceId === instanceId,
      );
      if (index === -1) {
        console.error("Event not found for instanceId:", instanceId);
        return;
      }
      const event = this.events[index];
      /**
       * @satisfies {Partial<Event>}
       */
      const updatedEvent = {
        ...event,
        startTime: newValues.startTime,
        endTime: newValues.endTime,
        dayOfWeek: parseInt(newValues.dayOfWeek),
        startDate: newValues.startDate,
      };

      console.log(this.events);

      this.events = [
        ...this.events.slice(0, index),
        updatedEvent,
        ...this.events.slice(index + 1),
      ];
      this.$emit("input", {
        items: this.items,
        events: this.events,
      });
    },

    updateValue() {
      this.$emit("input", {
        items: this.items,
        events: this.events,
      });
    },

    /**
     * @param {Object} payload
     * @param {string} payload.instanceId
     * @param {Partial<Event>} payload.newValues
     */
    editEvent({ instanceId, newValues }) {
      console.log(
        "Editing event with id:",
        instanceId,
        "New values:",
        newValues,
      );

      const index = this.events.findIndex(
        (event) => event.instanceId === instanceId,
      );
      if (index !== -1) {
        const startTimeString = newValues.startTime;
        const endTimeString = newValues.endTime;

        // Recalculate duration
        const startDateTime = this.$library.dayjs(
          `2000-01-01 ${startTimeString}`,
        );
        const endDateTime = this.$library.dayjs(`2000-01-01 ${endTimeString}`);
        const durationInMinutes = endDateTime.diff(startDateTime, "minute");
        const newDuration = ((durationInMinutes / 60) * 1000) / 1000;
        this.events[index] = {
          ...this.events[index],
          startTime: newValues.startTime,
          endTime: newValues.endTime,
          dayOfWeek: Number(newValues.dayOfWeek),
          duration: newDuration,
        };
        this.$emit("input", {
          items: this.items,
          events: this.events,
        });
      }
    },

    /**
     * @param item {Item}
     */
    deleteItem(item) {
      const id = item.id;
      openItemDeleteDialog(item, () => {
        this.items = this.items.filter((item) => {
          return item.id !== id;
        });

        this.events = this.events.filter((event) => {
          return event.itemId !== id;
        });

        this.$emit("input", {
          items: this.items,
          events: this.events,
        });
      });
    },

    /**
     *
     * @param instanceId {string}
     */
    deleteEvent(instanceId) {
      console.log("Deleting event with instanceId:", instanceId);

      this.events = this.events.filter((event) => {
        return event.instanceId !== instanceId;
      });

      this.$emit("input", {
        items: this.items,
        events: this.events,
      });
    },
  },
});
</script>

<style>
.k-schedule-table {
  --time-column-width: 4rem;
  --hour-row-height: 4rem;
}
.k-schedule-items-container {
  margin-bottom: var(--spacing-12);
}

.schedule-navigation {
  display: flex;
  padding-inline: var(--spacing-8);
  justify-content: space-between;
  align-items: center;
  padding-block: var(--spacing-4);
  border-start-start-radius: var(--rounded);
  background-color: var(--color-gray-400);
  border-bottom: 2px solid var(--color-border);
}

.week-label {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}

.target-list {
  display: grid;
  grid-auto-flow: dense;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
