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
              'hidden-mobile': dayIndex !== currentDay.day(),
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
            {{ String(hour).padStart(2, "0") }}:00
          </td>
          <td
            v-for="(date, dayIndex) in datesOfCurrentWeek"
            :key="date.format('dddd') + '-' + hour"
            class="schedule-cell"
            :data-day="date.format('dddd')"
            :data-hour="hour"
            :class="{
              'active-day-cell': currentDay.day() === dayIndex,
              'hidden-mobile': dayIndex !== currentDay.day(),
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
                @delete-event="$emit('delete-event', event.instanceId)"
                @edit-event="
                  (instanceId, newValues) =>
                    $emit('edit-event', instanceId, newValues)
                "
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
import { Dayjs } from "dayjs/";
import { openTimeDialog } from "../dialogs/event-dialogs";
import ScheduleEventItem from "./schedule-event-item.vue";

export default defineComponent({
  components: {
    ScheduleEventItem,
  },
  props: {
    timeRangeStart: Number,
    timeRangeEnd: Number,
    currentLocale: {
      type: String,
    },
    currentDay: {
      /**
       * @type {import('vue').PropType<Dayjs>}
       */
      type: Object,
    },
  },
  data() {
    return {
      currentDay: this.$library.dayjs(),
      /**
       * @type {import('./schedule-event-item.vue').Event[]}
       */
      tempEvents: [],
      draggedEventInstanceId: null,
    };
  },
  beforeMount() {
    this.$library.dayjs.locale(this.currentLocale);
    console.log("Current locale:", this.$library.dayjs.locale());

    // console.log("Subfields:", fields);
  },
  inject: ["allEvents", "allItems"],
  methods: {
    /**
     * @param targetDate {Dayjs}
     * @param changeEvent {DragEvent}
     * @param targetHour {number}
     */
    handleItemDrop(changeEvent, targetDate, targetHour) {
      // Ignore events on the source list or sorts within the same list for move logic
      if (changeEvent.removed || changeEvent.moved) {
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

          openTimeDialog(
            (timeData) => {
              // startTime and endTime are in the format "HH:mm:ss"
              const startTime = timeData.start;
              const endTime = timeData.end;

              // Parse times using dayjs. Using an arbitrary date like '2000-01-01'
              // helps handle time-only parsing consistently.
              const startDateTime = this.$library.dayjs(
                `2000-01-01 ${startTime}`
              );
              const endDateTime = this.$library.dayjs(`2000-01-01 ${endTime}`);
              const duration = endDateTime.diff(startDateTime, "minute");
              // round to 3 decimal places
              const durationInHours = Math.round((duration / 60) * 1000) / 1000;

              const newEvent = {
                /* ... create event object ... */
                itemId: addedElement.id,
                instanceId: this.$helper.string.uuid(),
                dayOfWeek: targetDate.day(),
                startDate: targetDate.format("YYYY-MM-DD"),
                startTime: timeData.start,
                endTime: timeData.end,
                duration: durationInHours,
                recurring: timeData.recurring,
                recurringEndDate: timeData.recurring
                  ? timeData.recurringEndDate
                  : null,
              };
              this.$emit("create-event", newEvent);
            },
            {
              startTime: targetStartTime,
              endTime: targetEndTime,
              recurring: false,
              recurringEndDate: null,
            }
          );
        } else {
          console.log(
            "Added event occurred, but it wasn't a tracked move or a recognized new item.",
            changeEvent.added
          );
        }
      }
    },

    /**
     * @param dragEvent {DragEvent}
     *
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
     *
     * @param {import('./schedule-event-item.vue').Event} event
     * @param {number} newDayIndex
     * @param {number} newStartHour
     */
    handleMove(event, newDayIndex, newStartHour) {
      const newStartTime = String(newStartHour).padStart(2, "0") + ":00:00";
      const currentStartDate = this.$library.dayjs(event.startDate);
      const newStartDate = currentStartDate
        .startOf("week")
        .add(newDayIndex, "day")
        .format("YYYY-MM-DD");

      /**
       * @type {Partial<import('./schedule-event-item.vue').Event>}
       */
      const newEvent = {
        startDate: newStartDate,
        startTime: newStartTime,
        dayOfWeek: newDayIndex,
      };

      this.$emit("move-event", {
        instanceId: event.instanceId,
        newValues: newEvent,
      });
    },

    /**
     *
     * @param dayIndex {number}
     * @param dayOfWeek {number}
     * @param startHour {number}
     *
     *
     * @return {import('./schedule-event-item.vue').Event[]}
     */
    getEventsForslot(dayIndex, startHour) {
      const slotDate = this.startOfWeek.add(dayIndex, "day");
      const formattedSlotDate = slotDate.format("YYYY-MM-DD");
      const formattedStartTime = String(startHour).padStart(2, "0") + ":00:00";
      const filteredEvents = this.events.filter((event) => {
        if (
          event.dayOfWeek !== dayIndex ||
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
            event.recurringEndDate
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
            "[]"
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
     * @returns {number[]} - The list of times in the range from timeRangeStart to timeRangeEnd.
     */
    getTimeRange() {
      return Array.from(
        { length: this.timeRangeEnd - this.timeRangeStart + 1 },
        (_, i) => i + this.timeRangeStart
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
        this.startOfWeek.add(i, "day")
      );
    },
    /**
     * @return {import('./schedule-event-item.vue').Event[]}
     */
    events() {
      return this.allEvents;
    },
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
  emits: ["delete-event", "edit-event", "create-event", "move-event"],
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
