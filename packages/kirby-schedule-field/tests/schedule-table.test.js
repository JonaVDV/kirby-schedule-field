import { describe, it, expect, beforeEach } from 'vitest'
import ScheduleTable from '@/components/schedule-table.vue'
import { createWrapper, createMockEvent } from './utils.js'
import dayjs from 'dayjs'

describe('ScheduleTable', () => {
  let wrapper
  const currentDay = dayjs('2023-01-02') // A Monday

  beforeEach(() => {
    wrapper = createWrapper(ScheduleTable, {
      propsData: {
        timeRangeStart: 8,
        timeRangeEnd: 18,
        currentLocale: 'en',
        currentDay: currentDay
      },
      provide: {
        allEvents: [createMockEvent({
          startTime: '09:00:00',
          startDate: '2023-01-02',
          dayOfWeek: 1
        })],
        allItems: []
      }
    })
  })

  it('generates correct time range', () => {
    const timeRange = wrapper.vm.getTimeRange
    expect(timeRange).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18])
  })

  it('calculates week dates correctly', () => {
    const dates = wrapper.vm.datesOfCurrentWeek
    expect(dates).toHaveLength(7)
    // expect(dates[0].format('YYYY-MM-DD')).toBe('2023-01-02') // Monday
  })

  it('filters events for specific slot correctly', () => {
    const events = wrapper.vm.getEventsForslot(1, 9) // Monday, 9 AM
    expect(events).toHaveLength(1)
    
    const noEvents = wrapper.vm.getEventsForslot(1, 8) // Monday, 8 AM
    expect(noEvents).toHaveLength(0)
  })

  it('calculates dynamic event styles', () => {
    const style = wrapper.vm.getEventDynamicStyle(0, [createMockEvent()])
    expect(style).toEqual({
      '--event-left': '0%',
      '--event-width': '100%'
    })

    const styleWithMultiple = wrapper.vm.getEventDynamicStyle(1, [createMockEvent(), createMockEvent()])
    expect(styleWithMultiple).toEqual({
      '--event-left': '50%',
      '--event-width': '50%'
    })
  })
})