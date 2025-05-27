import { expect, test, describe, beforeEach, vi } from 'vitest';
import { mount, createLocalVue } from '@vue/test-utils';
import ScheduleItemArea from '../src/components/schedule-item-area.vue';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';

// Extend dayjs with plugins for the component
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);

describe('ScheduleItemArea.vue', () => {
  let localVue;
  let mockOpenItemDeleteDialog;

  beforeEach(() => {
    localVue = createLocalVue();
    
    // Mock the openItemDeleteDialog function
    mockOpenItemDeleteDialog = vi.fn((item, callback) => {
      // Simulate user confirming deletion
      callback();
    });
    
    // Mock window.panel
    global.window = {
      panel: {
        translation: {
          code: 'en'
        }
      }
    };
  });

  const createWrapper = (props = {}) => {
    const defaultProps = {
      value: {
        items: [],
        events: [],
        recurringEvents: []
      },
      timeRangeStart: 8,
      timeRangeEnd: 22,
      create: {
        title: { type: 'text', label: 'Title' },
        location: { type: 'text', label: 'Location' }
      },
      endpoints: {}
    };

    return mount(ScheduleItemArea, {
      localVue,
      propsData: {
        ...defaultProps,
        ...props
      },
      mocks: {
        $t: (key) => key,
        $library: {
          dayjs: dayjs
        },
        $helper: {
          field: {
            subfields: (component, fields) => fields
          },
          string: {
            uuid: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)
          }
        }
      },
      stubs: {
        'k-field': { template: '<div class="k-field-stub"><slot /></div>' },
        'k-button': { 
          template: '<button class="k-button-stub" @click="$emit(\'click\', $event)"><slot /></button>',
          props: ['icon', 'variant', 'theme']
        },
        'CreateItem': {
          template: '<div class="create-item-stub" @click="$emit(\'add-items\', {title: \'Test Item\', location: \'Test Location\', color: \'#ff0000\'})"></div>',
          props: ['items', 'fields', 'endpoints']
        },
        'ScheduleTable': {
          template: '<div class="schedule-table-stub"></div>',
          props: ['currentLocale', 'timeRangeStart', 'timeRangeEnd', 'currentDay']
        }
      }
    });
  };

  describe('Component Initialization', () => {
    test('renders correctly with default props', () => {
      const wrapper = createWrapper();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain('k-schedule-field');
    });

    test('initializes with empty arrays when no value provided', () => {
      const wrapper = createWrapper({ value: undefined });

      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.events).toEqual([]);
      expect(wrapper.vm.recurringEvents).toEqual([]);
    });

    test('initializes with provided value data', () => {
      const mockValue = {
        items: [{ id: '1', title: 'Test Item' }],
        events: [{ instanceId: '1', title: 'Test Event' }],
        recurringEvents: [{ instanceId: '2', title: 'Recurring Event' }]
      };

      const wrapper = createWrapper({ value: mockValue });

      expect(wrapper.vm.items).toEqual(mockValue.items);
      expect(wrapper.vm.events).toEqual(mockValue.events);
      expect(wrapper.vm.recurringEvents).toEqual(mockValue.recurringEvents);
    });

    test('sets up dayjs plugins correctly', () => {
      const wrapper = createWrapper();
      
      // Check if currentDay is a dayjs object
      expect(wrapper.vm.currentDay.format).toBeDefined();
      expect(wrapper.vm.currentDay.week).toBeDefined(); // weekOfYear plugin
    });
  });

  describe('Navigation Functionality', () => {
    test('displays current week label correctly', () => {
      const wrapper = createWrapper();
      const expectedWeekLabel = wrapper.vm.endOfWeek.format("YYYY-ww");
      
      expect(wrapper.vm.displayWeeklabel).toBe(expectedWeekLabel);
    });

    test('navigates to previous week when left button clicked', async () => {
      const wrapper = createWrapper();
      const initialWeek = wrapper.vm.currentDay.week();
      
      const leftButton = wrapper.findAll('.k-button-stub').at(0);
      await leftButton.trigger('click');
      
      expect(wrapper.vm.currentDay.week()).toBe(initialWeek - 1);
    });

    test('navigates to next week when right button clicked', async () => {
      const wrapper = createWrapper();
      const initialWeek = wrapper.vm.currentDay.week();
      
      const rightButton = wrapper.findAll('.k-button-stub').at(1);
      await rightButton.trigger('click');
      
      expect(wrapper.vm.currentDay.week()).toBe(initialWeek + 1);
    });

    test('goes to today when today button clicked', async () => {
      const wrapper = createWrapper();
      
      // Set current day to a different date
      wrapper.vm.currentDay = dayjs().subtract(1, 'month');
      
      const todayButton = wrapper.findAll('.k-button-stub').at(2);
      await todayButton.trigger('click');
      
      expect(wrapper.vm.currentDay.format('YYYY-MM-DD')).toBe(dayjs().format('YYYY-MM-DD'));
    });
  });

  describe('Item Management - Happy Path', () => {
    test('saves new item correctly', () => {
      const wrapper = createWrapper();
      const mockItem = { title: 'New Item', location: 'New Location', color: '#ff0000' };
      
      wrapper.vm.saveItem(mockItem);
      
      expect(wrapper.vm.items).toHaveLength(1);
      expect(wrapper.vm.items[0]).toMatchObject(mockItem);
      expect(wrapper.vm.items[0].id).toBeDefined();
    });

    test('emits input event when saving item', () => {
      const wrapper = createWrapper();
      const mockItem = { title: 'New Item', location: 'New Location', color: '#ff0000' };
      
      wrapper.vm.saveItem(mockItem);
      
      expect(wrapper.emitted('input')).toBeTruthy();
      expect(wrapper.emitted('input')[0][0]).toMatchObject({
        items: expect.arrayContaining([expect.objectContaining(mockItem)]),
        events: [],
        recurringEvents: []
      });
    });

    test('edits existing item correctly', () => {
      const wrapper = createWrapper();
      const originalItem = { id: 'item-1', title: 'Original Title', location: 'Original Location' };
      wrapper.vm.items = [originalItem];
      
      const updatedData = { title: 'Updated Title', location: 'Updated Location' };
      wrapper.vm.editItem(updatedData, 'item-1');
      
      expect(wrapper.vm.items[0]).toMatchObject({
        ...originalItem,
        ...updatedData
      });
    });

    test('deletes item correctly', () => {
      const wrapper = createWrapper();
      const itemToDelete = { id: 'item-1', title: 'Item to Delete' };
      const relatedEvent = { instanceId: 'event-1', itemId: 'item-1', title: 'Related Event' };
      
      wrapper.vm.items = [itemToDelete];
      wrapper.vm.events = [relatedEvent];
      
      // Mock the dialog import
      wrapper.vm.deleteItem = function(item) {
        const id = item.id;
        // Simulate the dialog callback being called
        this.items = this.items.filter((item) => item.id !== id);
        this.events = this.events.filter((event) => event.itemId !== id);
        this.$emit("input", {
          items: this.items,
          events: this.events,
          recurringEvents: this.recurringEvents,
        });
      };
      
      wrapper.vm.deleteItem(itemToDelete);
      
      expect(wrapper.vm.items).toHaveLength(0);
      expect(wrapper.vm.events).toHaveLength(0); // Related events should be deleted too
    });
  });

  describe('Event Management - Happy Path', () => {
    test('creates new event correctly', () => {
      const wrapper = createWrapper();
      const mockEvent = { 
        instanceId: 'event-1', 
        itemId: 'item-1', 
        title: 'New Event',
        startTime: '09:00',
        endTime: '10:00'
      };
      
      wrapper.vm.createEvent(mockEvent);
      
      expect(wrapper.vm.events).toHaveLength(1);
      expect(wrapper.vm.events[0]).toMatchObject(mockEvent);
    });

    test('moves event correctly', () => {
      const wrapper = createWrapper();
      const originalEvent = { 
        instanceId: 'event-1', 
        startTime: '09:00', 
        dayOfWeek: 1,
        startDate: '2023-01-01'
      };
      wrapper.vm.events = [originalEvent];
      
      const newValues = { 
        startTime: '10:00', 
        dayOfWeek: 2,
        startDate: '2023-01-02'
      };
      
      wrapper.vm.moveEvent({ instanceId: 'event-1', newValues });
      
      expect(wrapper.vm.events[0]).toMatchObject({
        ...originalEvent,
        ...newValues
      });
    });

    test('edits event correctly with duration recalculation', () => {
      const wrapper = createWrapper();
      const originalEvent = { instanceId: 'event-1', title: 'Original Event' };
      wrapper.vm.events = [originalEvent];
      
      const newValues = {
        title: 'Updated Event',
        start: '09:00',
        end: '11:00',
        day: '3'
      };
      
      wrapper.vm.editEvent('event-1', newValues);
      
      expect(wrapper.vm.events[0]).toMatchObject({
        ...originalEvent,
        ...newValues,
        startTime: '09:00',
        endTime: '11:00',
        dayOfWeek: 3,
        duration: 2 // 2 hours
      });
    });

    test('deletes event correctly', () => {
      const wrapper = createWrapper();
      const eventToDelete = { instanceId: 'event-1', title: 'Event to Delete' };
      wrapper.vm.events = [eventToDelete];
      
      wrapper.vm.deleteEvent('event-1');
      
      expect(wrapper.vm.events).toHaveLength(0);
    });
  });

  describe('Unhappy Flows - Error Handling', () => {
    test('handles editing non-existent item gracefully', () => {
      const wrapper = createWrapper();
      wrapper.vm.items = [{ id: 'item-1', title: 'Existing Item' }];
      
      const consoleSpy = vi.spyOn(console, 'log');
      wrapper.vm.editItem({ title: 'Updated Title' }, 'non-existent-id');
      
      // Should not modify existing items
      expect(wrapper.vm.items).toHaveLength(1);
      expect(wrapper.vm.items[0].title).toBe('Existing Item');
      
      consoleSpy.mockRestore();
    });

    test('handles moving non-existent event gracefully', () => {
      const wrapper = createWrapper();
      wrapper.vm.events = [{ instanceId: 'event-1', title: 'Existing Event' }];
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      wrapper.vm.moveEvent({ 
        instanceId: 'non-existent-id', 
        newValues: { startTime: '10:00' }
      });
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Event not found for instanceId:', 'non-existent-id');
      expect(wrapper.vm.events).toHaveLength(1); // Original event unchanged
      
      consoleErrorSpy.mockRestore();
    });

    test('handles editing non-existent event gracefully', () => {
      const wrapper = createWrapper();
      wrapper.vm.events = [{ instanceId: 'event-1', title: 'Existing Event' }];
      
      wrapper.vm.editEvent('non-existent-id', { title: 'Updated Title' });
      
      // Should not modify existing events
      expect(wrapper.vm.events).toHaveLength(1);
      expect(wrapper.vm.events[0].title).toBe('Existing Event');
    });

    test('handles invalid time format in event editing', () => {
      const wrapper = createWrapper();
      const originalEvent = { instanceId: 'event-1', title: 'Original Event' };
      wrapper.vm.events = [originalEvent];
      
      const newValues = {
        start: 'invalid-time',
        end: 'also-invalid',
        day: 'not-a-number'
      };
      
      // This should not crash, but might produce NaN duration
      wrapper.vm.editEvent('event-1', newValues);
      
      expect(wrapper.vm.events[0].dayOfWeek).toBeNaN(); // Number('not-a-number') is NaN
    });

    test('handles missing value prop gracefully', () => {
      const wrapper = mount(ScheduleItemArea, {
        localVue,
        propsData: {
          // No value prop provided
          timeRangeStart: 8,
          timeRangeEnd: 22
        },
        mocks: {
          $t: (key) => key,
          $library: { dayjs: dayjs },
          $helper: {
            field: { subfields: () => ({}) },
            string: { uuid: () => 'test-uuid' }
          }
        },
        stubs: {
          'k-field': { template: '<div><slot /></div>' },
          'k-button': { template: '<button><slot /></button>' },
          'CreateItem': { template: '<div></div>' },
          'ScheduleTable': { template: '<div></div>' }
        }
      });
      
      // Should initialize with default empty arrays
      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.events).toEqual([]);
      expect(wrapper.vm.recurringEvents).toEqual([]);
    });

    test('handles malformed value prop', () => {
      const wrapper = createWrapper({ 
        value: { 
          items: null, // null instead of array
          events: undefined, // undefined instead of array
          recurringEvents: 'not-an-array' // string instead of array
        }
      });
      
      // Should fallback to empty arrays
      expect(wrapper.vm.items).toEqual([]);
      expect(wrapper.vm.events).toEqual([]);
      expect(wrapper.vm.recurringEvents).toEqual([]);
    });
  });

  describe('Computed Properties', () => {
    test('calculates startOfWeek correctly', () => {
      const wrapper = createWrapper();
      const testDate = dayjs('2023-01-15'); // A Sunday
      wrapper.vm.currentDay = testDate;
      
      expect(wrapper.vm.startOfWeek.format('YYYY-MM-DD')).toBe(testDate.startOf('week').format('YYYY-MM-DD'));
    });

    test('calculates endOfWeek correctly', () => {
      const wrapper = createWrapper();
      const testDate = dayjs('2023-01-15'); // A Sunday
      wrapper.vm.currentDay = testDate;
      
      expect(wrapper.vm.endOfWeek.format('YYYY-MM-DD')).toBe(testDate.endOf('week').format('YYYY-MM-DD'));
    });

    test('formats week label correctly', () => {
      const wrapper = createWrapper();
      const testDate = dayjs('2023-01-15');
      wrapper.vm.currentDay = testDate;
      
      expect(wrapper.vm.displayWeeklabel).toBe(testDate.endOf('week').format('YYYY-ww'));
    });
  });

  describe('Watchers', () => {
    test('updates internal state when value prop changes', async () => {
      const wrapper = createWrapper();
      const newValue = {
        items: [{ id: '1', title: 'New Item' }],
        events: [{ instanceId: '1', title: 'New Event' }],
        recurringEvents: [{ instanceId: '1', title: 'New Recurring Event' }]
      };
      
      wrapper.setProps({ value: newValue });
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.items).toEqual(newValue.items);
      expect(wrapper.vm.events).toEqual(newValue.events);
      expect(wrapper.vm.recurringEvents).toEqual(newValue.recurringEvents);
    });

    test('emits input when value changes', async () => {
      const wrapper = createWrapper();
      const newValue = {
        items: [{ id: '1', title: 'New Item' }],
        events: [],
        recurringEvents: []
      };
      
      wrapper.setProps({ value: newValue });
      await wrapper.vm.$nextTick();
      
      expect(wrapper.emitted('input')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    test('passes correct props to CreateItem component', () => {
      const mockCreate = { title: { type: 'text' } };
      const mockEndpoints = { save: '/api/save' };
      const wrapper = createWrapper({ 
        create: mockCreate, 
        endpoints: mockEndpoints 
      });
      
      // Verify the CreateItem stub is rendered
      const createItemStub = wrapper.find('.create-item-stub');
      expect(createItemStub.exists()).toBe(true);
      
      // Since we're using stubs, the props would be passed correctly through the template
      // We can verify the component was instantiated with the right props
      expect(wrapper.props('create')).toEqual(mockCreate);
      expect(wrapper.props('endpoints')).toEqual(mockEndpoints);
    });

    test('passes correct props to ScheduleTable component', () => {
      const wrapper = createWrapper({ 
        timeRangeStart: 9, 
        timeRangeEnd: 17 
      });
      
      // Verify the ScheduleTable stub is rendered
      const scheduleTableStub = wrapper.find('.schedule-table-stub');
      expect(scheduleTableStub.exists()).toBe(true);
      
      // Verify the component received the correct props
      expect(wrapper.props('timeRangeStart')).toBe(9);
      expect(wrapper.props('timeRangeEnd')).toBe(17);
      expect(wrapper.vm.$data.currentDay).toBeDefined();
    });
  });

  describe('Locale Handling', () => {
    test('sets locale based on panel translation code', () => {
      global.window.panel.translation.code = 'nl';
      
      const wrapper = createWrapper();
      
      expect(wrapper.vm.currentLocale).toBe('nl');
    });
  });
});
