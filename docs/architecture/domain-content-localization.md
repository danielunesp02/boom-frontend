# Domain Content Localization

## Problem

The first i18n patch translated only UI labels.

However, domain content such as:

- Mathematics
- Fractions
- Equivalent fractions
- Review equivalent fractions

still came from the API in English.

## Decision

The frontend must send the selected locale to the backend.

The backend must return localized domain labels whenever the data represents user-facing educational content.

## Current PoC Mechanism

Frontend sends:

```text
Accept-Language: pt-BR
X-Boom-Locale: pt-BR
```

Backend reads the locale and returns localized dashboard data.

## Current Supported Locales

```text
en-US
pt-BR
it-IT
es-ES
```

## Future Database Model

When domain persistence is introduced, avoid storing only one display name in the core table.

Recommended pattern:

```text
subject
subject_translation

topic
topic_translation

skill_node
skill_node_translation

learning_objective
learning_objective_translation
```

Example:

```text
subject
- id
- code
- created_at
- updated_at

subject_translation
- id
- subject_id
- locale
- name
- description
```

## Rule

UI labels are translated in the frontend.

Educational/domain content is localized by the backend.
