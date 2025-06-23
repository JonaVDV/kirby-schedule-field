import dayjs, { type Dayjs } from "dayjs";
import { type Component, ComponentPublicInstance } from "vue";
import { type MoveEvent } from "sortablejs";

type Locales = {
  bg: "bg_BG";
  ca: "ca_ES";
  cs: "cs_CZ";
  da: "da_DK";
  de: "de_DE";
  el: "el_GR";
  en: "en_US";
  eo: "eo";
  es_419: "es_419";
  es_ES: "es_ES";
  fa: "fa_IR";
  fi: "fi_FI";
  fr: "fr_FR";
  hu: "hu_HU";
  id: "id_ID";
  is_IS: "is_IS";
  it: "it_IT";
  ko: "ko_KR";
  lt: "lt_LT";
  nb: "nb_NO";
  nl: "nl_NL";
  pl: "pl_PL";
  pt_BR: "pt_BR";
  pt_PT: "pt_PT";
  ro: "ro_RO";
  ru: "ru_RU";
  sk: "sk_SK";
  sv_SE: "sv_SE";
  tr: "tr_TR";
};

type AsciiConversionTable = {
  "/°|₀/": "0";
  "/¹|₁/": "1";
  "/²|₂/": "2";
  "/³|₃/": "3";
  "/⁴|₄/": "4";
  "/⁵|₅/": "5";
  "/⁶|₆/": "6";
  "/⁷|₇/": "7";
  "/⁸|₈/": "8";
  "/⁹|₉/": "9";
  "/À|Á|Â|Ã|Å|Ǻ|Ā|Ă|Ą|Ǎ|Ä|A/": "A";
  "/à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª|æ|ǽ|ä|a|а/": "a";
  "/Б/": "B";
  "/б/": "b";
  "/Ç|Ć|Ĉ|Ċ|Č|Ц/": "C";
  "/ç|ć|ĉ|ċ|č|ц/": "c";
  "/Ð|Ď|Đ/": "Dj";
  "/ð|ď|đ/": "dj";
  "/Д/": "D";
  "/д/": "d";
  "/È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě|Е|Ё|Э/": "E";
  "/è|é|ê|ë|ē|ĕ|ė|ę|ě|е|ё|э/": "e";
  "/Ф/": "F";
  "/ƒ|ф/": "f";
  "/Ĝ|Ğ|Ġ|Ģ|Г/": "G";
  "/ĝ|ğ|ġ|ģ|г/": "g";
  "/Ĥ|Ħ|Х/": "H";
  "/ĥ|ħ|х/": "h";
  "/Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ|И/": "I";
  "/ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı|и|i̇/": "i";
  "/Ĵ|Й/": "J";
  "/ĵ|й/": "j";
  "/Ķ|К/": "K";
  "/ķ|к/": "k";
  "/Ĺ|Ļ|Ľ|Ŀ|Ł|Л/": "L";
  "/ĺ|ļ|ľ|ŀ|ł|л/": "l";
  "/М/": "M";
  "/м/": "m";
  "/Ñ|Ń|Ņ|Ň|Н/": "N";
  "/ñ|ń|ņ|ň|ŉ|н/": "n";
  "/Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ|Ö|O/": "O";
  "/ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º|ö|o|о/": "o";
  "/П/": "P";
  "/п/": "p";
  "/Ŕ|Ŗ|Ř|Р/": "R";
  "/ŕ|ŗ|ř|р/": "r";
  "/Ś|Ŝ|Ş|Ș|Š|С/": "S";
  "/ś|ŝ|ş|ș|š|ſ|с/": "s";
  "/Ţ|Ț|Ť|Ŧ|Т/": "T";
  "/ţ|ț|ť|ŧ|т/": "t";
  "/Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ|У|Ü|U/": "U";
  "/ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ|у|ü|u/": "u";
  "/В/": "V";
  "/в/": "v";
  "/Ý|Ÿ|Ŷ|Ы/": "Y";
  "/ý|ÿ|ŷ|ы/": "y";
  "/Ŵ/": "W";
  "/ŵ/": "w";
  "/Ź|Ż|Ž|З/": "Z";
  "/ź|ż|ž|з/": "z";
  "/Æ|Ǽ/": "AE";
  "/ß/": "ss";
  "/Ĳ/": "IJ";
  "/ĳ/": "ij";
  "/Œ/": "OE";
  "/Ч/": "Ch";
  "/ч/": "ch";
  "/Ю/": "Ju";
  "/ю/": "ju";
  "/Я/": "Ja";
  "/я/": "ja";
  "/Ш/": "Sh";
  "/ш/": "sh";
  "/Щ/": "Shch";
  "/щ/": "shch";
  "/Ж/": "Zh";
  "/ж/": "zh";
};

interface LinkTypes {
  url: {
    detect: (value) => boolean;
    icon: "url";
    id: "url";
    label: string;
    link: (value) => value;
    placeholder: string;
    input: "url";
    value: (value: string) => string;
  };
  page: {
    detect: (value: string) => boolean;
    icon: "page";
    id: "page";
    label: string;
    link: (value) => value;
    placeholder: string;
    input: "text";
    value: (value) => value;
  };
  file: {
    detect: (value: string) => boolean;
    icon: "file";
    id: "file";
    label: string;
    link: (value) => value;
    placeholder: string;
    value: (value) => value;
  };
  email: {
    detect: (value: string) => boolean;
    icon: "email";
    id: "email";
    label: string;
    link: (value: string) => string;
    placeholder: string;
    input: "email";
    value: (value: string) => string;
  };
  tel: {
    detect: (value: string) => boolean;
    icon: "phone";
    id: "tel";
    label: string;
    link: (value: string) => string;
    pattern: "[+]{0,1}[0-9]+";
    placeholder: string;
    input: "tel";
    value: (value: string) => string;
  };
  anchor: {
    detect: (value: string) => boolean;
    icon: "anchor";
    id: "anchor";
    label: "Anchor";
    link: (value: string) => string;
    pattern: "^#.+";
    placeholder: "#element";
    input: "text";
    value: (value: string) => string;
  };
  custom: {
    detect: () => true;
    icon: "title";
    id: "custom";
    label: string;
    link: (value: string) => string;
    input: "text";
    value: (value: string) => string;
  };
}

interface FileUploadParams {
  url: string;
  headers?: Record<string, string>;
  method: string;
  progress?: (event: ProgressEvent) => void;
  success?: (xhr: XMLHttpRequest, file: File, response: any) => void;
}

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
      /**
       * Resolves a color alias to proper css values
       * @param color the color to resolve
       * @returns the resolved color
       * @example
       * ```ts
       * this.$helper.color("purple")
       *
       * // returns var(--color-purple-500)
       * ```
       */
      color: (color: string) => string;
      /**
       *  Natural sort algorithm with unicode support based on @link github.com/bubkoo/natsort:
       * @example
       * ```ts
       * const sorter = sort({
       *   desc: direction === "desc",
       *   insensitive: true
       * });
       * array.sort((a, b) => sorter(a, b)});
       * ```
       */
      /**
       * Uploads a file using XMLHttpRequest
       * @param file the file to upload
       * @param params the parameters for the upload
       * @returns
       */
      upload: (file: File, params: FileUploadParams) => Promise<void>;
      sort: (options: { insensitive?: boolean; desc?: boolean }) => {};
      /**
       * Returns a percentage string for the provided fraction
       *
       * @param {string} fraction fraction to convert to a percentage
       * @param {string} fallback default value if fraction cannot be parsed
       * @param {boolean} vertical Whether the fraction is applied to vertical or horizontal orientation
       */
      ratio: (fraction: string, fallback: string, vertical: boolean) => string;
      /**
       * Checks if provided event is an upload-related event:
       * @param event the event to check
       * @returns true if the event is an upload-related event, false otherwise
       */
      isUploadEvent: <T extends Event>(event: T) => boolean;
      array: {
        /**
         * Creates an array from an object.
         * @param obj the object to convert
         * @template T the type of the object
         * @returns an array of the object's values
         */
        fromObject: <T extends Record<string, any>>(
          obj: T,
        ) => Array<T[keyof T]>;
        /**
         *
         * @param array the array to search in
         * @param query the query to search for
         * @param options the options for the search
         * @param options.min the minimum length of the query to search for
         * @param options.limit the maximum number of results to return
         * @param options.field the field to search in
         * @returns
         */
        search: <T extends Record<string, any>[]>(
          array: T,
          query: string,
          options: {
            min?: number;
            limit?: number;
            field?: keyof T[number];
          },
        ) => Array<T[number]>;
        /**
         *
         * @param array the array to sort
         * @param sortBy the field to sort by, can be in the format `field`, `field asc` or `field desc`
         * @returns the sorted array
         */
        sortBy: <T extends Record<string, any>[]>(
          array: T,
          sortBy:
            | `${keyof T[number]}`
            | `${keyof T[number]} asc`
            | `${keyof T[number]} desc`,
        ) => T;
        /**
         * splits an array into groups by a delimiter entry
         * @param array the array to split
         * @param delimiter the delimiter to split by
         * @returns an array of arrays
         */
        split: <T extends []>(
          array: T,
          delimiter: string,
        ) => Array<Array<T[number]>>;
        /**
         * Wraps a value in an array (ensures the value will be an array)
         * @param value the value to wrap
         * @returns an array containing the value or the value itself if it is already an array
         */
        wrap: <T>(value: T | T[]) => T[];
      };
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
          separator?: string,
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
      file: {
        /**
         * Extracts the extension
         * @param filename
         * @returns the file extension, e.g. "jpg", "png", "pdf"
         */
        extension: (filename: string) => string;
        /**
         * Extracts the filename without extension
         * @param filename
         * @returns the filename without extension
         *
         * @example
         * ```ts
         * this.$helper.file.name("image.jpg") // returns "image"
         * ```
         */
        name: (filename: string) => string;
        /**
         * Creates a nice human-readable file size string with size unit:
         * @returns a human-readable file size string, e.g. "1.5 MB", "200 KB"
         */
        niceSize: (size: number) => string;
      };
      embed: {
        /**
         * Builds a YouTube embed URL
         * @param url the YouTube video URL
         * @param doNotTrack if enabled, the embed will refer to the nocookie version of YouTube
         * @returns the YouTube embed URL or false if invalid
         */
        youtube: (url: string, doNotTrack?: boolean) => string | false;
        /**
         * Builds a Vimeo embed URL
         * @param url the Vimeo video URL
         * @param doNotTrack if enabled, the embed will refer to the dnt (do not track) version of Vimeo
         * @returns the Vimeo embed URL or false if invalid
         */
        vimeo: (url: string, doNotTrack?: boolean) => string | false;
        /**
         * Builds a generic video embed URL
         * @param url the video URL
         * @param doNotTrack if enabled, the embed will refer to the nocookie version of the video platform
         * @returns the video embed URL or false if invalid
         */
        video: (url: string, doNotTrack?: boolean) => string | false;
      };
      link: {
        /**
         * Detects the type of a link
         * @param link the link to detect
         * @returns an object with the type of link and the resolved link
         */
        detect: (link: string) => {
          type: keyof LinkTypes;
          link: string;
        };

        /**
         * Returns preview data for the link
         * @param link the link to get preview data for
         * @returns an object with the preview data
         */
        preview: (link: string) => {
          label: string;
        };
        /**
         * Returns the default types
         */
        types: () => LinkTypes;
      };
      object: {
        /**
         * Checks if value is empty
         * @param value the value to check
         * @returns true if the value is empty, false otherwise
         */
        isEmpty: <T extends Record<string, any>>(value: any) => boolean;
        /**
         * Checks if input is an object
         * @param input the input to check
         * @returns true if the input is an object, false otherwise
         */
        isObject: <T extends Record<string, any>>(input: any) => input is T;
        /**
         * Counts all keys in the object
         * @param obj the object to count keys in
         * @returns the number of keys in the object
         */
        count: <T extends Record<string, any>>(obj: T) => number;
        /**
         * Merges two objects
         * @param target the target object
         * @param source the source object
         * @returns the merged object
         */
        merge: <T extends Record<string, any>, U extends Record<string, any>>(
          target: T,
          source: U,
        ) => T & U;
        /**
         * Check if the objects are identical
         * @param a the first object
         * @param b the second object
         * @returns true if the objects are identical, false otherwise
         */
        same: <T extends Record<string, any>, U extends Record<string, any>>(
          a: T,
          b: U,
        ) => boolean;
        /**
         * Converts to lowercase all keys in an object
         * @param obj the object to convert
         * @returns the object with all keys in lowercase
         */
        toLowerKeys: <T extends Record<string, any>>(
          obj: T,
        ) => {
          [K in keyof T as Lowercase<K>]: T[K];
        };
      };
      keyboard: {
        /**
         * Returns name of meta key for current OS:
         * @returns "Ctrl" for Windows/Linux, "Cmd" for macOS
         */
        metaKey: () => string;
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

interface TextDialogOptions {
  component: "k-text-dialog";
  props: {
    text: string;
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
      user: {
        id: string;
        email: string;
        language: keyof Locales;
        role: string;
        username: string;
      };
      system: {
        /**
         * Returns the site title.
         */
        title: string;
        /**
         * Returns the system locales
         */
        locales: Locales;
        /**
         * If true, the Panel assumes it is installed on a local environment
         */
        isLocal: boolean;
        /**
         * Returns the current CSRF token
         */
        csrf: string;
        /**
         * returns the ascii conversion table.
         */
        ascii: AsciiConversionTable;
      };
      dialog: {
        /**
         * Opens a Kirby Panel dialog.
         * For k-form-dialog, types for `props.value` and `on.submit` data
         * are inferred based on the `props.fields` definition.
         * @param options The dialog configuration object.
         */
        open: <F extends FieldsDefinition>( // Infer the specific Fields structure F
          options: PanelDialogOptions<F>, // Use the union type; TS will match against the specific variants
        ) => Promise<void>; // Assuming it returns a Promise, adjust if needed
        close: () => void;
      };
      translation: {
        direction: "ltr" | "rtl";
        code: string;
        name: string;
        data: Record<string, string>;
      };
      languages: string[];
      /**
       * Global debug mode for Kirby Panel.
       */
      debug: boolean;
      /**
       * returns the current document title
       */
      title: string;
      /**
       * true if multiple languages can be installed
       */
      multilang: boolean;
      config: {
        /**
         * Returns the current debug mode. Use `window.panel.debug` as a shortcut.
         */
        debug: boolean;
        /**
         * If true, the textarea will insert code as kirbytext instead of markdown.
         */
        kirbytext: boolean;
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
          options: PanelDrawerOptions<F>,
        ) => Promise<void>;
        close: () => void;
      };
      plugin: (
        name: string,
        options: {
          fields?: Record<string, Component | string>;
          blocks?: Record<string, Component | string>;
        },
      ) => void;
    };
  }
}

export {};
