<template>
  <div class="">
    <table class="schedule-grid">
      <thead>
        <tr class="schedule-header">
          <th class="time-header">{{ $t("field.schedule.time") }}</th>
          <th
            v-for="(date, dayIndex) in datesOfCurrentWeek"
            :key="date.format('YYYY-MM-DD')"
            data-mobile="true"
            class="day-header"
            :class="{
              'hidden-mobile': dayIndex !== dayjs.day(),
            }"
          >
            <span>
              {{ date.format("dddd") }}
            </span>
            <span>
              {{ date.format("MMM-DD") }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="schedule-slots" v-for="hour in getTimeRange" :key="hour">
          <td class="time-cell" data-mobile="true">
            {{ $library.dayjs.interpret(String(hour), "time").format("HH:mm") }}
          </td>
          <td
            v-for="(date, dayIndex) in datesOfCurrentWeek"
            :key="date.format('dddd') + '-' + hour"
            class="schedule-cell"
            :data-day="date.format('dddd')"
            :data-hour="hour"
            :class="{
              'active-day-cell': dayjs.day() === dayIndex,
              'hidden-mobile': dayIndex !== dayjs.day(),
            }"
            data-mobile="true"
          >
            <k-draggable
              class="target-list"
              :options="draggableOptions"
              :list="getEventsForslot(dayIndex, hour)"
              @change="handleItemDrop($event, date, hour)"
              @start="handleDragStart"
              @end="handleDragEnd"
            >
              <ScheduleEventItem
                v-for="(event, index) in getEventsForslot(dayIndex, hour)"
                :key="event.instanceId"
                :event="event"
                :style="
                  getEventDynamicStyle(index, getEventsForslot(dayIndex, hour))
                "
                @delete-event="$emit('delete-event', $event)"
                @edit-event="$emit('edit-event', $event)"
              />
            </k-draggable>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { eventTimeFields, openFormDialogAsync } from "../dialogs/event-dialogs";
import ScheduleEventItem from "./schedule-event-item.vue";
import { getLocale } from "../utils/dayjs-languages";

/**
 * @typedef {import('../types/index').Event} Event
 * @typedef {import('dayjs').Dayjs} Dayjs
 * @typedef {import('../types/index').DragChangeEvent<Event>} DragChangeEvent
 */

export default defineComponent({
  components: {
    ScheduleEventItem,
  },
  props: {
    timeRangeStart: Number,
    timeRangeEnd: Number,
    /**
     * @type {import('vue').PropType<Dayjs>}
     */
    currentDay: Object,
  },

  data() {
    return {
      /**
       * @type {Event[]}
       */
      tempEvents: [],
      draggedEventInstanceId: null,
      currentDay: this.$library.dayjs(),
    };
  },
  inject: ["allEvents", "allItems"],
  async mounted() {
    const dayJSLang = await getLocale(this.$panel.user.language);
    this.currentDay = this.$library.dayjs();
    console.log(this.datesOfCurrentWeek);
  },
  methods: {
    /**
     * Calculates the duration in hours between two time strings.
     * The time strings should be in the format "HH:mm:ss".
     * @param startTime {string} - The start time in "HH:mm:ss" format.
     * @param endTime {string} - The end time in "HH:mm:ss" format.
     */
    calculateDuration(startTime, endTime) {
      const start = this.$library.dayjs(`2000-01-01 ${startTime}`);
      const end = this.$library.dayjs(`2000-01-01 ${endTime}`);
      return end.diff(start, "hour", true);
    },
    /**
     * @param targetDate {Dayjs}
     * @param changeEvent {DragChangeEvent}
     * @param targetHour {number}
     */
    async handleItemDrop(changeEvent, targetDate, targetHour) {
      // Handle removed events (when dragging FROM this slot)
      if (changeEvent.removed) {
        // Don't do anything here - the move will be handled by the added event
        return;
      }

      // Ignore sorts within the same list
      if (changeEvent.moved) {
        return;
      }

      if (changeEvent.added) {
        if (this.draggedEventInstanceId) {
          const event = this.events.find((e) => {
            return e.instanceId === this.draggedEventInstanceId;
          });

          if (!event) {
            console.error("Event not found for dragged instance ID.");
            return;
          }
          console.log(
            "test",
            this.$library.dayjs.Ls[this.$panel.user.language],
          );

          this.handleMove(event, targetDate.day(), targetHour);
        } else if (
          changeEvent.added.element &&
          changeEvent.added.element.id &&
          !changeEvent.added.element.instanceId
        ) {
          const addedElement = changeEvent.added.element;

          const targetStartTime =
            String(targetHour).padStart(2, "0") + ":00:00";
          const targetEndTime =
            String(targetHour + 1).padStart(2, "0") + ":00:00";
          const data = await openFormDialogAsync(
            eventTimeFields(),
            {
              startTime: targetStartTime,
              endTime: targetEndTime,
              recurring: false,
              recurringEndDate: undefined,
            },
            {},
          );

          if (!data) {
            console.warn(
              "Event creation dialog was cancelled or no data returned.",
            );
            return;
          }

          /**
           * @type {any}
           */
          const newEvent = {
            itemId: addedElement.id,
            instanceId: this.$helper.string.uuid(),
            dayOfWeek: targetDate.day(),
            startDate: targetDate.format("YYYY-MM-DD"),
            startTime: data.startTime,
            endTime: data.endTime,
            duration: this.calculateDuration(data.startTime, data.endTime),
            recurring: data.recurring || false,
            recurringEndDate: data.recurring
              ? data.recurringEndDate || null
              : null,
          };

          this.$emit("create-event", newEvent);
        } else {
          console.log(
            "Added event occurred, but it wasn't a tracked move or a recognized new item.",
            changeEvent.added,
          );
        }
      }
    },

    /**
     * @param dragEvent {any}
     */
    handleDragStart(dragEvent) {
      if (!dragEvent.item && !dragEvent.item.__vue__) {
        return null;
      }

      const eventData = dragEvent.item.__vue__.event;
      if (!eventData || !eventData.instanceId) {
        return null;
      }
      this.draggedEventInstanceId = eventData.instanceId;
    },
    /**
     *
     */
    handleDragEnd() {
      this.draggedEventInstanceId = null;
    },
    /**
     * @param {any} event
     * @param {number} newDayIndex
     * @param {number} newStartHour
     */
    async handleMove(event, newDayIndex, newStartHour) {
      console.trace(
        `Moving event ${event.instanceId} to day index ${newDayIndex} and start hour ${newStartHour}`,
      );

      const newStartTime = String(newStartHour).padStart(2, "0") + ":00:00";
      const locale = await getLocale(this.$panel.user.language);
      this.$library.dayjs.locale(locale);

      const currentStartDate = this.$library.dayjs.interpret(event.startDate);
      console.log(currentStartDate.startOf("week").add(newDayIndex - 1, "day"));
      const newStartDate = currentStartDate
        .startOf("week")
        .add(newDayIndex - locale.weekStart, "day")
        .format("YYYY-MM-DD");

      /**
       * @type {any}
       */
      const newEvent = {
        startDate: newStartDate,
        startTime: newStartTime,
        endTime:
          String(newStartHour + event.duration).padStart(2, "0") + ":00:00",
        dayOfWeek: newDayIndex,
      };

      this.$emit("move-event", {
        instanceId: event.instanceId,
        newValues: newEvent,
      });
    },

    /**
     * @param dayIndex {number}
     * @param dayOfWeek {number}
     * @param startHour {number}
     * @returns {any[]}
     */
    getEventsForslot(dayIndex, startHour) {
      const slotDate = this.startOfWeek.add(dayIndex, "day");
      const formattedSlotDate = slotDate.format("YYYY-MM-DD");
      const actualDayOfWeek = slotDate.day();
      const filteredEvents = this.events.filter((event) => {
        if (
          event.dayOfWeek !== actualDayOfWeek ||
          parseInt(event.startTime.split(":")[0], 10) !== startHour
        ) {
          return false;
        }

        // Handle non-recurring events: Check if the event's single date matches the slot date
        if (!event.recurring) {
          return event.startDate === formattedSlotDate;
        }
        // Handle recurring events: Check if the slot's date falls within the event's active range
        else {
          const eventStartDate = this.$library.dayjs(event.startDate);
          const eventRecurringEndDate = this.$library.dayjs(
            event.recurringEndDate,
          );

          if (slotDate.isBefore(eventStartDate, "day")) {
            return false;
          }

          // if the event has no recurring end date, it is considered active indefinitely
          if (!event.recurringEndDate) {
            return true;
          }

          return slotDate.isBetween(
            eventStartDate,
            eventRecurringEndDate,
            "day",
            "[]",
            newDayIndex,
          );
        }
      });

      return filteredEvents;
    },
    /**
     *
     * @param index {number}
     * @param eventsInSlot {Array<import('./schedule-event-item.vue').Event>}
     * @returns {{
     *    '--event-left': string,
     *   '--event-width': string} | {}}
     */
    getEventDynamicStyle(index, eventsInSlot) {
      const totalEvents = eventsInSlot.length;
      // This check might be redundant if v-for doesn't render for empty eventsInSlot,
      // but it's safe.
      if (totalEvents === 0) {
        return {};
      }
      return {
        "--event-left": `${index * (100 / totalEvents)}%`,
        "--event-width": `${100 / totalEvents}%`,
      };
    },
  },
  computed: {
    /**
     * @returns {Dayjs} - The current day as a Dayjs object.
     */
    dayjs() {
      return this.currentDay; // Use computed property instead of data
    },
    /**
     * @returns {number[]} - The list of times in the range from timeRangeStart to timeRangeEnd.
     */
    getTimeRange() {
      return Array.from(
        { length: this.timeRangeEnd - this.timeRangeStart + 1 },
        (_, i) => i + this.timeRangeStart,
      );
    },
    startOfWeek() {
      return this.currentDay.startOf("week");
    },
    endOfWeek() {
      return this.currentDay.endOf("week");
    },
    datesOfCurrentWeek() {
      return Array.from({ length: 7 }, (_, i) =>
        this.startOfWeek.add(i, "day"),
      );
    },
    /**
     * @returns {Event[]}
     */
    events() {
      return this.allEvents;
    },
    /**
     * Returns a formatted string for the week label.
     * The format is "YYYY-ww" where "YYYY" is the year and "ww" is the week number.
     * @returns {string}
     */
    displayWeeklabel() {
      // Use the endOfWeek date to determine the year and week number for display
      return this.endOfWeek.format("YYYY-ww");
    },
    draggableOptions() {
      return {
        group: {
          name: "schedule-items",
          pull: true,
          put: true,
        },
      };
    },
  },
});
</script>

<style>
.schedule-header {
  display: grid;
  width: 100%;
  grid-template-columns: [times] var(--time-column-width) [days] repeat(7, 1fr);
}
.schedule-grid {
  --time-column-width: 4rem;
  --hour-row-height: 4rem;
  --cell-border: 1px solid rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
  display: grid;
}

.schedule-grid:has(.event:is(:hover, :focus)) .event:not(:is(:hover, :focus)) {
  opacity: 0.5;
  transition: all 1s ease;
}

.schedule-slots {
  display: grid;
  grid-auto-rows: minmax(var(--hour-row-height), auto);
  grid-template-columns:
    [times] var(--time-column-width)
    [day-1] 1fr [day-2] 1fr [day-3] 1fr [day-4] 1fr [day-5] 1fr [day-6] 1fr [day-7] 1fr;
  width: 100%;
  position: relative;
}

.time-header,
.day-header {
  padding: var(--spacing-4);
  text-align: center;
  background-color: var(--color-gray-400);
  color: var(--color-black);
  font-weight: var(--font-bold);
  position: sticky;
  top: 0;
  z-index: 10;
}

.time-header {
  display: grid;
  align-content: center;
  grid-column: times;
  grid-row: header;
}

.day-header {
  grid-row: header;
  display: grid;
}

.time-cell {
  grid-column: times;
  text-align: right;
  padding-right: 0.5rem;
  border-bottom: var(--cell-border);
  font-size: var(--text-sm);
  display: grid;
  place-content: center;
}

.active-day-cell {
  background-color: var(--color-blue-400);
}

.schedule-cell {
  border: var(--cell-border);
  min-height: 4rem;
  position: relative;
}

@media (max-width: 768px) {
  .schedule-slots {
    grid-template-columns: [times] 3rem [day] 1fr;
  }

  .schedule-header {
    grid-template-columns: [times] 3rem [days] 1fr;
  }

  .hidden-mobile {
    display: none;
  }
}
</style>
