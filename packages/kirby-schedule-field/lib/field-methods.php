<?php

use Kirby\Content\Field;
use Kirby\Toolkit\A;
use Kirby\Cms\Structure;

return [
    /**
     * Converts the field value to an array of events.
     * @kql-allowed
     */
    'toEvents' => function (Field $field) {
        $value = $field->yaml(); // Decode YAML to array
        $events = $value['events'] ?? [];
        $items = $value['items'] ?? [];

        // Create an associative array of items keyed by their 'id' for faster lookup
        $itemsById = A::keyBy($items, 'id');

        $resolvedEvents = array_map(function ($event) use ($itemsById) {
            $itemId = $event['itemId'] ?? null;
            $item = $itemsById[$itemId] ?? null;
            $event['content'] = $item;
            unset($event['itemId']);

            return $event;
        }, $events);

        return Structure::factory($resolvedEvents, [
            'parent' => $field->parent(),
            'field' => $field
        ]);
    }
];
