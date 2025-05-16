<?php

use Kirby\Data\Yaml;
use Kirby\Cms\App as Kirby;
use Kirby\Filesystem\F;

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
    'fieldMethods' => include __DIR__ . '/lib/field-methods.php',
]);
