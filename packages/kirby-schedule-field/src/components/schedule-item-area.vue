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
        :current-locale="currentLocale"
        :time-range-start="timeRangeStart"
        :time-range-end="timeRangeEnd"
        :current-day="currentDay"
        @delete-event="deleteEvent"
        @create-event="createEvent"
        @edit-event="editEvent"
        @move-event="moveEvent"
      />
    </div>
  </k-field>
</template>

<script lang="js">
import  weekOfYear  from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import LangNl from "dayjs/locale/nl";
import isBetween from "dayjs/plugin/isBetween";
import ScheduleEventItem from "./schedule-event-item.vue";
import ScheduleTable from "./schedule-table.vue";
import {defineComponent, computed} from 'vue'
import CreateItem from "./create-item.vue";
import { openItemDeleteDialog } from "../dialogs/item-dialogs";


/**
 * @typedef {Object} Value
 * @property {import('./schedule-event-item.vue').Event[]} events
 * @property {import('./create-item.vue').Item[]} items
 * @property {import('./schedule-event-item.vue').Event[]} recurringEvents
 *
 * @typedef {Object} createProps
 * @property {Object[]} fields
 *
 */


export default defineComponent({
  extends: "k-field",
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
      /**
       * @type {Value['recurringEvents']}
       * @description The recurring events, that are visible for a certain period of time.
       */
      recurringEvents: [],
      currentDay: this.$library.dayjs(),
      currentLocale: 'en',

    };
  },
  provide() {
    return {
      allItems: computed(() => this.items),
      allEvents: computed(() => this.events),
      allRecurringEvents: computed(() => this.recurringEvents),
    }
  },
  beforeMount() {
    this.$library.dayjs.extend(weekOfYear);
    this.$library.dayjs.extend(advancedFormat);
    this.$library.dayjs.extend(isBetween);

    const localeCode = window.panel.translation.code;
    this.currentLocale = localeCode;

    if (window.panel.translation.code === "nl") {
      console.log("Setting locale to:", window.panel.translation.code);

      this.$library.dayjs.locale(LangNl);
      console.log(this.$library.dayjs.locale());
    } else {

      this.$library.dayjs.locale(window.panel.translation.code);
    }
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
        this.recurringEvents = newValue.recurringEvents || [];

        this.$emit("input", {
          items: newValue.items,
          events: newValue.events,
          recurringEvents: newValue.recurringEvents,
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
          recurringEvents: this.recurringEvents,
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
          recurringEvents: this.recurringEvents,
        });
      }

    },
    goToToday() {
      this.currentDay = this.$library.dayjs();
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
     * @param eventData {import('./schedule-event-item.vue').Event}
     */
    createEvent(eventData) {
      this.events.push(eventData);
      this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
        });
    },
    /**
     * @param payload {Object}
     * @param payload.instanceId {string}
     * @param payload.newValues {Partial<import('./schedule-event-item.vue').Event>}
     */
    moveEvent({instanceId, newValues}) {
      const index = this.events.findIndex((event) => event.instanceId === instanceId);
      if (index === -1) {
        console.error("Event not found for instanceId:", instanceId);
        return;
      }
      const event = this.events[index];
      const updatedEvent = {
        ...event,
        startTime: newValues.startTime,
        dayOfWeek: newValues.dayOfWeek,
        startDate: newValues.startDate,
      };

      this.events.splice(index, 1, updatedEvent);
      this.$emit("input", {
        items: this.items,
        events: this.events,
        recurringEvents: this.recurringEvents,
      });
    },

    /**
     *
     * @param id {string}
     * @param newValues {import('./schedule-event-item.vue').Event}
     */
    editEvent(id, newValues) {
      console.log("Editing event with id:", id, "New values:", newValues);

      const index = this.events.findIndex((event) => event.instanceId === id);
      if (index !== -1) {
        const startTimeString = newValues.start;
        const endTimeString = newValues.end;

        // Recalculate duration
        const startDateTime = this.$library.dayjs(`2000-01-01 ${startTimeString}`);
        const endDateTime = this.$library.dayjs(`2000-01-01 ${endTimeString}`);
        const durationInMinutes = endDateTime.diff(startDateTime, "minute");
        const newDuration = ((durationInMinutes / 60) * 1000) / 1000;
        this.events[index] = { ...this.events[index],
          ...newValues,
          startTime: newValues.start,
          endTime: newValues.end,
          dayOfWeek: Number(newValues.day),
          duration: newDuration,
        };
        this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
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
        })

        this.events = this.events.filter((event) => {
          return event.itemId !== id;
        });

        this.$emit("input", {
            items: this.items,
            events: this.events,
            recurringEvents: this.recurringEvents,
        });
      })

    },


    /**
     *
     * @param instanceId {string}
     */
    deleteEvent(instanceId) {
      console.log("Deleting event with instanceId:", instanceId);

      this.events = this.events.filter((event) => {
        return event.instanceId !== instanceId;
      })

      this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
      });
    }
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
