<template>
  <k-field v-bind="$props" class="k-schedule-items-container">
    <k-button @click="openItemAdd" icon="add">
      {{ $t("field.schedule.addEvent") }}
    </k-button>
    <k-draggable
      :list="items"
      :options="sourceOptions"
      element="k-grid"
      style="--columns: 12; gap: 0.5rem"
    >
      <li
        v-for="item in items"
        :key="item.id"
        @dblclick="editItem(item, item.id)"
        :style="{ backgroundColor: item.color }"
        class="list-item"
      >
        <div class="list-item-content" :style="{ color: item.color }">
          <span class="list-item-title">
            {{ item.title }}
          </span>
          <k-options-dropdown
            :options="itemOptions"
            :text="false"
            icon="dots"
            size="xs"
            class="event-options-trigger"
            @action="handleAction($event, item)"
          />
        </div>
      </li>
    </k-draggable>
  </k-field>
</template>

<script>
import { defineComponent } from "vue";
import { openItemEditDialog } from "../dialogs/item-dialogs.js";
import { openFormDrawerAsync } from "../dialogs/event-dialogs.js";
/**
 *@typedef {Object} Item
 *@property {string} id
 *@property {string} location
 *@property {string} title
 *@property {string} color
 */
export default defineComponent({
  extends: "k-structure-field",
  props: {
    items: {
      /**
       * @type {import('vue').PropType<Item[]>}
       */
      type: Array,
      required: true,
    },
    fields: {
      /**
       * @type {import('vue').PropType<import('../../plugin.d.ts').FieldsDefinition>}
       */
      type: [Object], // Matches the 'create' prop type from parent
      required: true,
    },
    endpoints: {
      type: Object,
    },
  },
  computed: {
    sourceOptions() {
      return {
        group: {
          name: "schedule-items",
          pull: "clone",
          put: false,
        },
      };
    },
    itemOptions() {
      return [
        {
          text: this.$t("dropdown.edit"), // Translate text
          icon: "edit",
          click: "edit",
        },
        {
          text: this.$t("dropdown.delete"), // Translate text
          icon: "trash",
          click: "delete",
        },
      ];
    },
  },
  methods: {
    /**
     *
     * @param action {string}
     * @param item {Item}
     */
    handleAction(action, item) {
      switch (action) {
        case "edit":
          this.editItem(item, item.id);
          break;
        case "delete":
          this.deleteItem(item);
          break;
        default:
          break;
      }
    },

    form() {
      const fields = this.$helper.field.subfields(this, this.fields);
      console.log("Form fields:", fields);

      return fields;
    },

    async openItemAdd() {
      const data = await openFormDrawerAsync(this.form(), {}, {});
      if (data) {
        console.log(data);

        this.$emit("add-items", data);
      }
    },
    /**
     *
     * @param {Item} item
     * @param {string} id
     */
    async editItem(item, id) {
      const data = await openFormDrawerAsync(this.form(), item, {});
      if (data) {
        this.$emit("edit-items", data, id);
      }
    },

    /**
     *
     * @param {Item} item
     */
    deleteItem(item) {
      this.$emit("delete-items", item);
    },
  },
  emits: ["add-items", "edit-items", "delete-items"],
});
</script>

<style>
.list-item {
  padding: var(--spacing-2) var(--spacing-3);
  margin-bottom: 5px;
  border: 1px solid var(--color-border);
  border-radius: var(--rounded);
  cursor: grab;
  display: flex;
  align-items: center;
}

.list-item-content {
  display: flex;
  filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
  mix-blend-mode: luminosity;
  opacity: 0.95;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
