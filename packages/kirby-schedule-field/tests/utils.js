import { mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

// Mock Kirby components that your plugin uses
const mockComponents = {
  'k-field': {
    template: '<div class="k-field"><slot></slot></div>',
    props: ['label', 'help']
  },
  'k-button': {
    template: '<button @click="$emit(\'click\', $event)"><slot></slot></button>',
    props: ['icon', 'theme', 'variant']
  },
  'k-draggable': {
    template: '<div class="k-draggable"><slot></slot></div>',
    props: ['list', 'options', 'element']
  },
  'k-options-dropdown': {
    template: '<div class="k-options-dropdown" @click="$emit(\'action\', \'test\')"></div>',
    props: ['options', 'text', 'icon', 'size']
  },
  'k-grid': {
    template: '<div class="k-grid"><slot></slot></div>'
  }
}

// Register mock components globally
Object.keys(mockComponents).forEach(name => {
  localVue.component(name, mockComponents[name])
})

export function createWrapper(component, options = {}) {
  const defaultOptions = {
    localVue,
    mocks: {
      $helper: globalThis.$helper,
      $library: globalThis.$library,
      $t: globalThis.$t,
      $panel: globalThis.$panel,
      $emit: vi.fn()
    },
    stubs: {
      ...mockComponents
    }
  }

  return mount(component, {
    ...defaultOptions,
    ...options
  })
}

// Helper to create mock events and items
export function createMockEvent(overrides = {}) {
  return {
    instanceId: 'event-1',
    itemId: 'item-1',
    startTime: '09:00:00',
    endTime: '10:00:00',
    startDate: '2023-01-01',
    dayOfWeek: 1,
    duration: 1,
    recurring: false,
    recurringEndDate: null,
    ...overrides
  }
}

export function createMockItem(overrides = {}) {
  return {
    id: 'item-1',
    title: 'Test Event',
    location: 'Test Location',
    color: '#ff0000',
    ...overrides
  }
}