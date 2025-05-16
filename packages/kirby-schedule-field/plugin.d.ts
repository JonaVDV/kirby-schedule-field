import dayjs, { type Dayjs } from "dayjs";
import { type Component, ComponentPublicInstance } from "vue";

declare module "vue" {
  interface ComponentCustomProperties {
    $library: {
      dayjs: typeof dayjs;
    };
    $panel: typeof window.panel;
    $t: typeof window.panel.$t;
    $helper: {
      /**
       * Checks if the coponent is registered globally
       * @param name the name of the component
       * @returns true if the component is registered globally, false otherwise
       */
      isComponent: (name: string) => boolean;
      /**
       * Debounces the callback function
       * @param callback the function to debounce
       * @param delay the delay in milliseconds
       * @returns the debounced function
       */
      debounce: (callback: () => any, delay: number) => () => any;
      string: {
        /**
         * Converts a camelCase string to kebab-case.
         * @param str the string to convert
         * @returns the string in kebab-case
         */
        camelToKebab: (str: string) => string;
        /**
         * Escapes HTML in string
         * @param str the string to escape
         * @returns the escaped HTML string
         */
        escapeHtml: (str: string) => string;
        /**
         * Turns first letter of each word uppercase
         * @param str
         * @returns the string with the first letter of each word in uppercase
         */
        ucwords: (str: string) => string;
        /**
         * Turns escaped HTML entities into actual characters again:
         * @param str the string to unescape
         * @returns the unescaped string
         */
        unescapeHTML: (str: string) => string;
        /**
         * Returns a unique ID
         * @returns a string representing the unique ID
         */
        uuid: () => string;
        /**
         * Replaces template placeholders in string with provided values
         * @param str the string to replace
         * @param values the values to replace
         * @returns the string with replaced values
         */
        template: (str: string, values: Record<string, string>) => string;
        /**
         * Turns first letter uppercase
         * @param str the string to capitalize
         * @returns the string with the first letter in uppercase
         */
        ucfirst: (str: string) => string;
        /**
         * Removes HTML from a string
         * @param str the string to strip
         * @returns the string without HTML
         */
        stripHTML: (str: string) => string;
        /**
         * Convert string to ASCII slug
         * @param str the string to slugify
         * @param rules Array of custom rules for replacing characters, e.g. `[{ "ä": "ae" }]`
         * @param allowed Allowed characters, default is `a-z0-9`
         * @param separator Separator to use, default is `-`
         * @returns the slugified string
         */
        slug: (
          str: string,
          rules?: Array<Record<string, string>>,
          allowed?: string,
          separator?: string
        ) => string;
        /**
         * Trims the given character(s) at the end of the string
         * @param str the string to trim
         * @param char the character(s) to trim
         * @returns the trimmed string
         */
        rtrim: (str: string, char: string) => string;
        /**
         * Generate random alpha-num string of specified length
         * @param length the length of the string to generate
         * @returns a random alpha-num string of the specified length
         */
        random: (length: number) => string;
        /**
         * Prefixes string with 0 until length is reached
         * @param str the string to pad
         * @param length the length to pad to
         * @returns the padded string
         */
        pad: (str: string, length: number) => string;
        /**
         * Trims the given character(s) at the beginning of the string
         * @param str the string to trim
         * @param char the character(s) to trim
         * @returns the trimmed string
         */
        ltrim: (str: string, char: string) => string;
        /**
         * Turns first letter lowercase
         * @param str the string to decapitalize
         * @returns the string with the first letter in lowercase
         */
        lcfirst: (str: string) => string;
        /**
         * Checks if a string is empty
         * @param str the string to check
         * @returns true if the string is empty, false otherwise
         */
        isEmpty: (str: string) => boolean;
        /**
         * Checks if string contains an emoji
         * @param str the string to check
         * @returns true if the string contains an emoji, false otherwise
         */
        hasEmoji: (str: string) => boolean;
      };
      field: {
        subfields: (field: any, fields: FieldsDefinition) => FieldsDefinition;
      };
    };
  }
}

type FieldTypes =
  | "blocks"
  | "checkboxes"
  | "color"
  | "date"
  | "email"
  | "files"
  | "headline"
  | "info"
  | "layout"
  | "line"
  | "link"
  | "list"
  | "multiselect"
  | "number"
  | "object"
  | "pages"
  | "password"
  | "radio"
  | "range"
  | "select"
  | "slug"
  | "structure"
  | "tags"
  | "tel"
  | "text"
  | "textarea"
  | "time"
  | "toggle"
  | "toggles"
  | "url"
  | "users"
  | "writer";

type FieldTypeToJsType<T extends FieldTypes | undefined> = T extends
  | "time"
  | "date" // Dates are often strings in forms (YYYY-MM-DD)
  | "email"
  | "link"
  | "password"
  | "tel"
  | "text"
  | "textarea"
  | "url"
  | "slug"
  | "color"
  | "headline" // Not really input types, but treat as string if present
  | "info"
  | "line"
  ? string
  : T extends "toggle"
  ? boolean
  : T extends "number" | "range"
  ? number
  : T extends "checkboxes" | "multiselect" | "tags"
  ? string[] // Assuming array of strings, adjust if values can be numbers
  : T extends "select" | "radio"
  ? string | number // Value depends on options provided
  : T extends "files" | "pages" | "users"
  ? any[] // Array of specific structures, simplified
  : T extends "structure" | "object"
  ? Record<string, any> // Simplified object structure
  : T extends "blocks" | "layout" | "list" | "writer" | "toggles"
  ? any // Complex types, simplified
  : unknown; // Fallback for unknown or undefined types

// --- Helper Type: Define the structure of a single field definition ---
interface FieldDefinition {
  type: FieldTypes;
  label?: string;
  required?: boolean;
  default?: any;
  when?: Record<string, boolean>;
  // Allow any other properties Kirby fields might have
  [key: string]: any;
}

// --- Helper Type: Define the structure for the fields object ---
// Using a generic constraint to ensure values are FieldDefinition
export type FieldsDefinition = Record<string, FieldDefinition>;

// --- Helper Type: Generate the Value/Submit data type based on FieldsDefinition ---
// This maps keys and attempts to map types, considering the 'required' flag.
// Note: This cannot perfectly model fields hidden by 'when' conditions.
export type FieldsToDataType<F extends FieldsDefinition | undefined> =
  F extends FieldsDefinition
    ? {
        // Use mapped types to iterate over the keys of the inferred FieldsDefinition F
        // Use '-?' to remove optionality for required fields, keep it for non-required
        [K in keyof F as F[K]["required"] extends true
          ? K
          : never]-?: FieldTypeToJsType<F[K]["type"]>;
      } & {
        // Add optional properties for fields where required is not true
        [K in keyof F as F[K]["required"] extends true
          ? never
          : K]?: FieldTypeToJsType<F[K]["type"]>;
      }
    : Record<string, any>; // Fallback if F is undefined or not FieldsDefinition

// --- Base Dialog Options ---
interface BaseDialogOptions {
  component: string; // Use string here, specific components use literal types
  props?: Record<string, any>; // Looser type for base props
  // on?: Record<string, (...args: any[]) => void>;
  // Allow other properties like 'size', etc.
  // [key: string]: any;
}

// --- Specific interface for k-form-dialog ---
// Uses a generic F constrained to FieldsDefinition
export interface FormDialogOptions<F extends FieldsDefinition>
  extends Omit<BaseDialogOptions, "component" | "props" | "on"> {
  component: "k-form-dialog";
  props: {
    fields: F; // Use the inferred generic F directly
    // Value type uses Partial<> as not all fields might be initially provided
    // It also ensures keys match the fields definition
    value: FieldsToDataType<F>;
  };
  on: {
    // Submit data type is derived from the fields definition F
    submit: (data: FieldsToDataType<F>) => void;
    cancel?: () => void;
    // Other events
    // [key: string]: (...args: any[]) => void;
  };
}

// --- Specific interface for k-remove-dialog ---
interface RemoveDialogOptions
  extends Omit<BaseDialogOptions, "component" | "props" | "on"> {
  component: "k-remove-dialog";
  props: {
    text: string;
    // Other k-remove-dialog specific props
    [key: string]: any;
  };
  on: {
    submit: () => void; // No data passed on submit
    cancel?: () => void;
    // Other events
    [key: string]: (...args: any[]) => void;
  };
}

interface TextDrawerOptions {
  component: "k-text-drawer";
  props: {
    /**
     * the default icon for the drawer header
     */
    icon?: string;
    text: string;
    disabled?: boolean;
    title: string;
  };
}

interface FormDrawerOptions<F extends FieldsDefinition> {
  component: "k-form-drawer";
  props: {
    title: string;
    icon?: string;
    fields: F; // Use the inferred generic F directly
    value?: FieldsToDataType<F>;
  };
  on?: {
    submit: (data: FieldsToDataType<F>) => void;
    cancel?: () => void;
  };
}

// --- Union type for all possible dialog options ---
// Add other specific dialog types here if needed
// The generic <F> allows inference when a FormDialogOptions object is passed
type PanelDialogOptions<F extends FieldsDefinition = FieldsDefinition> =
  | FormDialogOptions<F>
  | RemoveDialogOptions
  | BaseDialogOptions; // BaseDialogOptions acts as a fallback

export type PanelDrawerOptions<F extends FieldsDefinition = FieldsDefinition> =
  | FormDrawerOptions<F>
  | TextDrawerOptions;

// --- Global Window Augmentation ---
declare global {
  interface Window {
    panel: {
      /**
       * Translation function for Kirby Panel.
       * @param key the translation key
       * @param options optional parameters for the translation
       * @returns the translation string
       */
      $t: (key: string, options?: Record<string, any>) => string;
      dialog: {
        /**
         * Opens a Kirby Panel dialog.
         * For k-form-dialog, types for `props.value` and `on.submit` data
         * are inferred based on the `props.fields` definition.
         * @param options The dialog configuration object.
         */
        open: <F extends FieldsDefinition>( // Infer the specific Fields structure F
          options: PanelDialogOptions<F> // Use the union type; TS will match against the specific variants
        ) => Promise<void>; // Assuming it returns a Promise, adjust if needed
        close: () => void;
      };
      // Add other panel properties/methods if needed
      drawer: {
        /**
         * Opens a Kirby Panel drawer.
         * For k-form-drawer, types for `props.value` and `on.submit` data
         * are inferred based on the `props.fields` definition.
         * @param options The drawer configuration object.
         * @returns
         */
        open: <F extends FieldsDefinition>(
          options: PanelDrawerOptions<F>
        ) => Promise<void>;
        close: () => void;
      };
      plugin: (
        name: string,
        options: {
          fields: Record<string, Component>;
        }
      ) => void;
    };
  }
}
export {};
