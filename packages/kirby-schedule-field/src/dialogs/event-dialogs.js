export function openTimeDialog(onSubmit, event) {
  console.log("openTimeDialog called with event:", event);

  window.panel.dialog.open({
    component: "k-form-dialog",
    props: {
      fields: {
        start: {
          label: window.panel.$t("dialog.event.edit.start"),
          type: "time",
          required: true,
        },
        end: {
          label: window.panel.$t("dialog.event.edit.end"),
          type: "time",
          required: true,
        },
        recurring: {
          label: window.panel.$t("dialog.event.time.recurring"),
          type: "toggle",
          help: window.panel.$t("dialog.event.time.recurring.help"), // Translate help text
          default: false,
          required: false,
        },
        recurringEndDate: {
          when: {
            recurring: true,
          },
          label: window.panel.$t("dialog.event.time.recurringEndDate"),
          type: "date",
          time: false,
          help: window.panel.$t("dialog.event.time.recurringEndDate.help"),
          required: false,
          min: new Date().toISOString().split("T")[0],
        },
      },

      value: {
        start: event.startTime || "00:00:00",
        end: event.endTime || "00:00:00",
        recurring: event.recurring || false,
        recurringEndDate: event.recurringEndDate || null,
      },
    },
    on: {
      submit: (data) => {
        console.log("onSubmit called with data:", data);
        onSubmit(data);
        window.panel.dialog.close();
      },
    },
  });
}

export function eventEditDialog(onSubmit, event) {
  // Get current day index from event.key
  const dayIndex = event.dayOfWeek;

  window.panel.dialog.open({
    component: "k-form-dialog",
    props: {
      fields: {
        day: {
          label: window.panel.$t("dialog.event.edit.day"),
          type: "select",
          options: [
            { value: 0, text: window.panel.$t("dialog.event.edit.day.sunday") }, // Translate day
            { value: 1, text: window.panel.$t("dialog.event.edit.day.monday") }, // Translate day
            {
              value: 2,
              text: window.panel.$t("dialog.event.edit.day.tuesday"),
            }, // Translate day
            {
              value: 3,
              text: window.panel.$t("dialog.event.edit.day.wednesday"),
            }, // Translate day
            {
              value: 4,
              text: window.panel.$t("dialog.event.edit.day.thursday"),
            }, // Translate day
            { value: 5, text: window.panel.$t("dialog.event.edit.day.friday") }, // Translate day
            {
              value: 6,
              text: window.panel.$t("dialog.event.edit.day.saturday"),
            }, // Translate day
          ],
        },
        start: {
          label: window.panel.$t("dialog.event.edit.start"),
          type: "time",
          required: true,
        },
        end: {
          label: window.panel.$t("dialog.event.edit.end"),
          type: "time",
          required: true,
        },
        recurring: {
          label: window.panel.$t("dialog.event.time.recurring"),
          type: "toggle",
          help: window.panel.$t("dialog.event.time.recurring.help"), // Translate help text
          default: false,
          required: false,
        },
        recurringEndDate: {
          when: {
            recurring: true,
          },
          label: window.panel.$t("dialog.event.time.recurringEndDate"),
          type: "date",
          time: false,
          help: window.panel.$t("dialog.event.time.recurringEndDate.help"),
          required: false,
          min: new Date().toISOString().split("T")[0],
        },
      },
      value: {
        day: dayIndex,
        start: event.startTime || "00:00:00",
        end: event.endTime || "00:00:00",
        recurring: event.recurring || false,
        recurringEndDate: event.recurringEndDate || null,
      },
    },
    on: {
      submit: (data) => {
        onSubmit(data);
        window.panel.dialog.close();
      },
    },
  });
}
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
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve, reject) => {
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
