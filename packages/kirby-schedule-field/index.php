<?php

use Kirby\Data\Yaml;
use Kirby\Cms\App as Kirby;
use Kirby\Cms\Structure;
use Kirby\Cms\StructureObject;
use Kirby\Content\Field;
use Kirby\Filesystem\F;
use Kirby\Form\Fields;
use Kirby\Form\Form;
use Kirby\Toolkit\A;


load([
    'IMA\\KirbyScheduleField\\Methods\\FieldMethods' => __DIR__ . '/methods/fieldMethods.php',
]);

Kirby::plugin('IMA/kirby-schedule-field', [
    'fields' => [
        'extends' => 'structure',
        'schedule' => [
            'props' => [
                'value' => function ($value = null) {
                    if (is_array($value)) {
                        return $value;
                    }
                    try {
                        $decoded = Yaml::decode($value ?? '');
                        if (!isset($decoded['events'])) $decoded['events'] = [];
                        if (!isset($decoded['items'])) $decoded['items'] = [];
                        return $decoded;
                    } catch (\Throwable $th) {
                        return [
                            'events' => [],
                            'items' => [],
                        ];
                    }
                },
                'fields' => function ($fields = []) {
                    return $fields;
                }
            ],
        ]
    ],
    'translations' => [
        'en' => Yaml::decode(F::read(__DIR__ . '/languages/en.yml')),
        'nl' => Yaml::decode(F::read(__DIR__ . '/languages/nl.yml')),
    ],
    'fieldMethods' => [
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
    ],
]);
