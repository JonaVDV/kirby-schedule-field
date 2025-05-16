<?php

use Kirby\Data\Yaml;
use Kirby\Cms\App as Kirby;
use Kirby\Filesystem\F;
use Kirby\Form\Form;
use Kirby\Exception\InvalidArgumentException;
use Kirby\Toolkit\A;
use Kirby\Toolkit\Str;

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
                'create' => function (array $fields = []) {
                    return $fields;
                }
            ],
            'methods' => [
                'form' => function (array $values = []) {
                    return new Form([
                        'fields' => $this->attrs['create'] ?? [],
                        'values' => $values,
                        'model'  => $this->model
                    ]);
                },
            ],
            'validations' => [
                'schedule' => function ($value) {
                    if (empty($value['items']) === true) {
                        return true;
                    }
                    $values = A::wrap($value['items']);
                    foreach ($values as $index => $value) {
                        $form = $this->form($value);

                        foreach ($form->fields() as $field) {
                            $errors = $field->errors();
                            if (empty($errors) === false) {

                                throw new InvalidArgumentException([
                                    'key'  => 'structure.validation',
                                    'data' => [
                                        'field' => $field->label() ?? Str::ucfirst($field->name()),
                                        'index' => $index + 1
                                    ]
                                ]);
                            }
                        }
                    }
                }
            ]
        ]
    ],
    'translations' => [
        'en' => Yaml::decode(F::read(__DIR__ . '/languages/en.yml')),
        'nl' => Yaml::decode(F::read(__DIR__ . '/languages/nl.yml')),
    ],
    'fieldMethods' => include __DIR__ . '/lib/field-methods.php',
]);
