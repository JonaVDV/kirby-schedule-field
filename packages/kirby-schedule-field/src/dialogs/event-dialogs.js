/**
 * @satisfies {() => import("../../plugin").FieldsDefinition}
 */
export const eventTimeFields = () => ({
  startTime: {
    type: "time",
    label: window.panel.$t("dialog.event.edit.start"),
    required: true,
  },
  endTime: {
    type: "time",
    label: window.panel.$t("dialog.event.edit.end"),
    required: true,
  },
  recurring: {
    type: "toggle",
    label: window.panel.$t("dialog.event.time.recurring"),
    help: window.panel.$t("dialog.event.time.recurring.help"),
    default: false,
    required: false,
  },
  recurringEndDate: {
    when: {
      recurring: true,
    },
    type: "date",
    label: window.panel.$t("dialog.event.time.recurringEndDate"),
    help: window.panel.$t("dialog.event.time.recurringEndDate.help"),
    required: false,
    min: new Date().toISOString().split("T")[0],
  },
});

/**
 * @satisfies {() => import("../../plugin").FieldsDefinition}
 */
export const eventEditFields = () => ({
  dayOfWeek: {
    type: "select",
    label: window.panel.$t("dialog.event.edit.day"),
    options: [
      { value: 0, text: window.panel.$t("dialog.event.edit.day.sunday") }, // Translate day
      { value: 1, text: window.panel.$t("dialog.event.edit.day.monday") }, // Translate day
      {
        value: 2,
        text: window.panel.$t("dialog.event.edit.day.tuesday"),
      },
      {
        value: 3,
        text: window.panel.$t("dialog.event.edit.day.wednesday"),
      },
      {
        value: 4,
        text: window.panel.$t("dialog.event.edit.day.thursday"),
      },
      { value: 5, text: window.panel.$t("dialog.event.edit.day.friday") }, // Translate day
      {
        value: 6,
        text: window.panel.$t("dialog.event.edit.day.saturday"),
      },
    ],
  },
  ...eventTimeFields(),
});
export function openDeleteDialog(onSubmit) {
  window.panel.dialog.open({
    component: "k-remove-dialog",
    props: {
      text: window.panel.$t("dialog.event.delete.confirm"), // Translate text
    },
    on: {
      submit: () => {
        onSubmit();
        window.panel.dialog.close();
      },
    },
  });
}

/**
 * Opens a Kirby Form Dialog and returns a Promise that resolves with the
 * submitted data, or null if the dialog is cancelled/closed.
 * @template {import("../../plugin").FieldsDefinition} F
 * @param {F} fields
 * @param {Partial<import("../../plugin").FieldsToDataType<F>>} initialValue
 * @param {*} options
 * @returns {Promise<import("../../plugin").FieldsToDataType<F>> | null}
 */
export function openFormDialogAsync(fields, initialValue = {}, options) {
  return new Promise((resolve) => {
    /**
     * @type {import("../../plugin").FormDialogOptions<F>}
     */
    const dialogOptions = {
      component: "k-form-dialog",
      props: {
        fields,
        value: initialValue,
        ...options,
      },
      on: {
        submit: (data) => {
          window.panel.dialog.close();
          resolve(data);
        },
      },
    };
    window.panel.dialog.open(dialogOptions);
  });
}
/**
 * Opens a Kirby Form Drawer and returns a Promise that resolves with the
 * submitted data, or null if the drawer is cancelled/closed.
 * @template {import("../../plugin").FieldsDefinition} F
 * @param {F} fields
 * @param {Partial<import("../../plugin").FieldsToDataType<F>>} initialValue
 * @param {*} options
 * @returns {Promise<import("../../plugin").FieldsToDataType<F>> | null}
 */
export function openFormDrawerAsync(fields, initialValue = {}, options) {
  return new Promise((resolve) => {
    /**
     * @type {import("../../plugin").PanelDrawerOptions<F>}
     */
    const drawerOptions = {
      component: "k-form-drawer",
      props: {
        fields,
        value: initialValue,
        ...options,
      },
      on: {
        submit: (data) => {
          window.panel.drawer.close();
          resolve(data);
        },
      },
    };
    window.panel.drawer.open(drawerOptions);
  });
}
