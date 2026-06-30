# I18n and Locale Strategy

## Initial Supported Locales

```text
en-US
pt-BR
it-IT
es-ES
```

## Current PoC Behavior

The frontend stores the selected locale in local storage:

```text
boom.user.locale
```

It also tries to persist the locale through:

```text
PUT /api/v1/users/me/preferences
```

Backend persistence is optional in the PoC and will become mandatory after authentication and user profile persistence are implemented.

## Why These Four Languages

- English: international baseline and engineering default.
- Portuguese Brazil: primary language for the initial family/user context.
- Italian: target school/country context.
- Spanish: broad international expansion language.

## Future Improvements

- Persist locale in real user settings.
- Translate domain data from backend.
- Translate validation errors.
- Add date/number formatting helpers.
- Add locale-aware curriculum names.
- Support school/tenant default locale.
