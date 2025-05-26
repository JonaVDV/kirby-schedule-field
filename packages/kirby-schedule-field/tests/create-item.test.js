import { expect, test, describe } from 'vitest';
import { createLocalVue, mount } from '@vue/test-utils'; // Import createLocalVue
import CreateItem from '@/components/create-item.vue';


describe('CreateItem.vue', () => {
  const localVue = createLocalVue(); // Create a local Vue instance for testing

  // check if component gets rendered correctly
  test('renders correctly with default props', async () => {
    const mockItems = [
      { id: '1', title: 'Test Event 1', color: '#ff0000' },
      { id: '2', title: 'Test Event 2', color: '#00ff00' },
    ];
    const mockFields = {
      title: { type: 'text', label: 'Title' },
      
    };

    const wrapper = mount(CreateItem, {
      localVue, // Use localVue
      propsData: { // Use propsData for Vue 2 with @vue/test-utils v1
        items: mockItems,
        fields: mockFields,
      },
      mocks: { // Mocks are a top-level option in v1
        $t: (key) => key, // Simple mock for Kirby's translation function
        $helper: {
          field: {
            subfields: () => ({
              // Mock the structure returned by subfields if necessary
              // For a basic render test, an empty object might suffice
            }),
          },
        },
      },
      stubs: { // Stubs are a top-level option in v1
        'k-field': { template: '<div class="k-field-stub"><slot /></div>' },
        'k-button': { template: '<button class="k-button-stub"><slot /></button>' },
        'k-draggable': { template: '<div class="k-draggable-stub"><slot /></div>' },
        'k-grid': { template: '<div class="k-grid-stub"><slot /></div>' },
        'k-options-dropdown': { template: '<div class="k-options-dropdown-stub"></div>' },
      }
    });

    // Check if the component instance exists
    expect(wrapper.exists()).toBe(true);

    // Check if the main container class is present
    expect(wrapper.classes()).toContain('k-schedule-items-container');

    // Check if the "Add Event" button is rendered
    const addButton = wrapper.find('.k-button-stub'); // Adjusted to find the stubbed button
    expect(addButton.exists()).toBe(true);
    expect(addButton.text()).toBe('field.schedule.addEvent');

    // Check if items are rendered
    const renderedItems = wrapper.findAll('.list-item');
    expect(renderedItems.length).toBe(mockItems.length);

    if (mockItems.length > 0) {
      // Add a check to ensure the first item wrapper exists
      const firstItemWrapper = renderedItems.at(0);
      expect(firstItemWrapper.exists()).toBe(true); // Verify the wrapper itself is valid and the element exists

      expect(firstItemWrapper.text()).toContain(mockItems[0].title);
    }
  });
});


