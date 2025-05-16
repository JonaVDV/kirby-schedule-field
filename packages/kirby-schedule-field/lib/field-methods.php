<?php

use Kirby\Content\Field;
use Kirby\Toolkit\A;


return [
    'toEvents' => function (Field $field): array { // Return type hint changed to array
        $value = $field->yaml(); // Decode YAML to array
        $events = $value['events'] ?? [];
        $items = $value['items'] ?? [];

        // Create an associative array of items keyed by their 'id' for faster lookup
        $itemsById = A::keyBy($items, 'id');

        $resolvedEvents = array_map(function ($event) use ($itemsById) {
            $itemId = $event['itemId'] ?? null;
            $item = $itemsById[$itemId] ?? null;
            $event['content'] = $item;
            $user = null;
            if ($item['lecturer'] && size($item['lecturer']) > 0) {
                $user = kirby()->users()->find($item['lecturer'][0]['id']) ?? null;
            }

            $event['content']['lecturer'] = $user ? [
                'name' => ($user->name()->or(''))->value(),
                'link' => $user->link()->toPage()?->uri(),
                'description' => $user->description()->value(),
                'avatar' => $user->avatar() ? [
                    'url' => $user->avatar()->url(),
                    'alt' => $user->name()->value(),
                ] : null,
            ] : null;
            unset($event['itemId']);

            return $event;
        }, $events);

        return $resolvedEvents; // Return the array of resolved events
    }
];
