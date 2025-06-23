/**
 * @typedef {Object} Event
 * @property {string} itemId - The ID of the event.
 * @property {string} startDate - The start time of the event.
 * @property {number} dayOfWeek - The day of the week of the event.
 * @property {string} instanceId - The instance ID of the event.
 * @property {string} startTime - The start time of the event.
 * @property {string} endTime - The end time of the event.
 * @property {number} duration - The duration of the event in hours.
 * @property {boolean} recurring - Indicates if the event is recurring.
 * @property {string?} recurringEndDate - The end date of the recurring event.
 */

/**
 * @template TElement - The type of the element being dragged.
 *
 * @typedef {Object} DragChangeEvent
 * @property {Object} added
 * @property {TElement} added.element - the added element
 * @property {number} added.newIndex - the index of the element after addition
 *
 * @property {Object} removed
 * @property {TElement} removed.element - the removed element
 * @property {number} removed.oldIndex - the index of the element before removal
 *
 * @property {Object} moved
 * @property {number} moved.newIndex - the current index of the moved element
 * @property {number} moved.oldIndex - the old index of the moved element
 * @property {TElement} moved.element - the moved element
 */

export {};
