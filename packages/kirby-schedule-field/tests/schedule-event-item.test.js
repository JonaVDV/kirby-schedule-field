import { describe, it, expect, vi, beforeEach } from 'vitest'
import ScheduleEventItem from '@/components/schedule-event-item.vue'
import { createWrapper, createMockEvent, createMockItem } from './utils.js'

describe('ScheduleEventItem', () => {
  let wrapper
  const mockEvent = createMockEvent()
  const mockItem = createMockItem()

  beforeEach(() => {
    wrapper = createWrapper(ScheduleEventItem, {
      propsData: {
        event: mockEvent
      },
      provide: {
        allItems: [mockItem]
      }
    })
  })

  it('renders event information correctly', () => {
    expect(wrapper.find('.event-title').text()).toBe(mockItem.title)
    expect(wrapper.find('.event-location').text()).toBe(mockItem.location)
    expect(wrapper.find('.event-time').text()).toContain('09:00')
    expect(wrapper.find('.event-time').text()).toContain('10:00')
  })

  it('calculates CSS top value correctly', () => {
    expect(wrapper.vm.cssTopValue).toBe(0) // 09:00 should give 0% offset
  })

  it('emits delete-event when delete action is triggered', async () => {
    const optionsDropdown = wrapper.find('.event-options-trigger')
    await optionsDropdown.trigger('action', 'delete')
    
    // Note: You'll need to implement the actual delete logic test
    // based on how your delete dialog works
  })

  it('finds the correct item from allItems', () => {
    expect(wrapper.vm.item).toEqual(mockItem)
  })

  it('calculates duration correctly', () => {
    expect(wrapper.vm.duration).toBe(1)
  })
})