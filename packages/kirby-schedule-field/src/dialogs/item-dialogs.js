/**
 * @typedef {import("../components/create-item.vue").Item} Item
 */

/**
 * @param {Item} item
 * @param {(data: Item) => void} onSubmit
 */
export function openItemEditDialog(item, onSubmit) {
  window.panel.drawer.open({
    component: "k-form-drawer",
    props: {
      title: window.panel.$t("dialog.item.edit.dialogTitle"),
      icon: "edit",
      fields: {
        title: {
          label: window.panel.$t("dialog.item.edit.title"),
          type: "text",
          required: true,
          placeholder: window.panel.$t("dialog.item.placeholder.title"), // Translate placeholder
        },
        location: {
          label: window.panel.$t("dialog.item.edit.location"),
          type: "select",
          options: [
            { value: "Derby's Dojo", text: "Derby's Dojo" },
            { value: "De Brink", text: "De Brink" },
          ],
          required: true,
          placeholder: window.panel.$t("dialog.item.placeholder.location"), // Translate placeholder
        },
        lecturer: {
          label: window.panel.$t("dialog.item.edit.lecturer"),
          type: "users", // select user
          required: true,
          multiple: false,
          placeholder: window.panel.$t("dialog.item.placeholder.lecturer"), // Translate placeholder
          endpoints: {
            field: "kirby-schedule-field/users",
          },
        },
        color: {
          label: window.panel.$t("dialog.item.edit.color"),
          type: "color", // has to select distinct color choices
          required: true,
          placeholder: window.panel.$t("dialog.item.placeholder.color"), // Translate placeholder
        },
      },
      value: {
        title: item.title || "",
        location: item.location || "",
        lecturer: item.lecturer || [],
        color: item.color || "",
      },
    },
    on: {
      submit: (data) => {
        console.log(data);

        onSubmit(data);
        window.panel.drawer.close();
      },
    },
  });
}

export function openItemDeleteDialog(item, onSubmit) {
  window.panel.dialog.open({
    props: {
      text: window.panel.$t("dialog.item.delete.confirm", {
        title: item.title,
      }), // Translate text with variable
      title: window.panel.$t("dialog.item.delete.title"), // Translate title
    },
    component: "k-remove-dialog",
    on: {
      submit: () => {
        onSubmit(item);
        window.panel.dialog.close();
      },
    },
  });
}
