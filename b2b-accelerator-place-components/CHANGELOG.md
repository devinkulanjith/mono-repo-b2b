# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.15.0] - 2021-04-26

### Added

- New translations.

### Changed

- Crowdin configuration file.

## [0.14.2] - 2021-02-26
### Changed
- All components request country information in a standardiezed way.
- Typings were updated to match original types.

## [0.14.1] - 2021-02-23
### Fixed
- `LocationInput` error state is handled properly.

## [0.14.0] - 2021-02-12
### Added
- New hook `useAddressForm` to control `AddressForm` inner state.

## [0.13.11] - 2021-02-03
### Fixed
- Empty fields being hidden inside address form.

## [0.13.10] - 2021-02-01
### Fixed
- Whitespace truncated in address fields delimiters.

## [0.13.9] - 2021-01-08
### Fixed
- Geolocation on Safari.

## [0.13.8] - 2020-12-30
### Fixed
- Eslint and prettier issues.

## [0.13.7] - 2020-12-29
### Added
- `LocationSearch` results can now be restricted per country.

## [0.13.6] - 2020-12-16
### Added
- `LocationSearch` uses a session token.

## [0.13.5] - 2020-12-11
### Added
- `id` to the input and button used to insert postal code through e2e tests.

## [0.13.4] - 2020-12-09
### Added
- `LocationSearch` displays provider logo.

## [0.13.3] - 2020-12-09
### Added
- `className` prop to `LocationCountry` component.

## [0.13.2] - 2020-12-02
### Fixed
- `undefined` message id for postal code field.

## [0.13.1] - 2020-11-19
### Fixed
- `LocationCountry` label is now displayed.
- Failure message will no longer show up when starting to type on `LocationSearch`.

### Added
- Label id prop for `LocationCountry`.
- Loading state after selecting an address on `LocationSearch`.

## [0.13.0] - 2020-11-17
### Added
- `formatAddressToString` utility function.

### Changed
- Added line height to place details inside `AddressForm`.
- Removed edit icon and replace by plain text in `AddressForm`.

## [0.12.0] - 2020-10-30
### Changed
- Allow `onSuccess` to return a promise and wait for its fulfillment
  before removing loading state.

### Fixed
- Postal code mask not applied on blur in `LocationInput` component.

## [0.11.0] - 2020-10-29
### Changed
- `LocationSearch` component now send queries to `vtex.geolocation-graphql-interface` instead of `places-graphql`.

## [0.10.0] - 2020-09-01
### Added
- `LocationSearch`.

## [0.9.1] - 2020-08-18

## [0.9.0] - 2020-07-15
### Added
- Prop `mandatoryEditableFields` to `AddressForm` component.

## [0.8.1] - 2020-07-09
### Fixed
- Add onSuccess prop to DeviceCoordinates.
- Fix reverse geocode execution in DeviceCoordinates.

## [0.8.0] - 2020-07-02
### Changed
- Updated components to read rules from `address-context` instead of using the country rules
  inside the app.

## [0.7.2] - 2020-06-22
### Fixed
- Remove default text `-` when reactivating NumberOption.
- Focus NumberOption input after activating it.

## [0.7.1] - 2020-06-02
### Added
- Prop `hiddenFields` to `PlaceDetails` component.

### Changed
- `LocationCountry` now shows the country flag alongside their name.

### Fixed
- `LocationCountry` shown with only one country.
- Unable to submit `LocationInput` form by pressing enter.
- Locale string os postal code in portuguese.
- Forgotten postal code URL didn't work.
- Format of brazilian postal codes wasn't correct.
- `AddressForm` didn't show invalid fields in the collapsed version.
- No way to change the address in `AddressForm` after clicking "edit".
- States were not shown abbreviated in the states dropdown in `AddressForm`.
- Street and number fields weren't in the same line in `PlaceDetails` and `AddressForm`.
- Wrong label of `[Object object]` in states dropdown in `AddressForm`.

### Removed
- Prop `onNoPostalCode` from `LocationInput`.

## [0.7.0] - 2020-04-22
### Added
- Default value for `display` prop in `PlaceDetails` component.
- Prop `hiddenFields` in `AddressForm` component.
- Prop `onNoPostalCode` in `LocationInput` component.
- Prop `variation` in `LocationInput` component.

### Changed
- Update design of `LocationInput` component to match their spec.

### Fixed
- Crash on `AddressForm` when address included the `receiverName` field.

### Removed
- Route `/places`, `Example` component and `store` builder.
- Dependency on `vtex.locale-switcher`.

## [0.6.0] - 2020-03-20
### Added
- `LocationInput` component.
- Styling to `AddressForm` and others.

## [0.5.0] - 2020-03-16
### Added
- `DeviceCoordinates` component.

## [0.4.0] - 2020-02-27
### Added
- LocationCountry (that uses country from store settings as first option)
- LocationSelect
- Bolivia country JSON
- Initial styling to `AddressForm` (max/min width depending on fantasy name)

### Removed
- `size` property from country JSON objects

## [0.3.0] - 2020-02-17
### Added
- `LocaleSwitcher` dependency to handle locale query strings
- Internationalization
- Max length, and required validations
- Added mock for `AddressContext`
- Added JSON in new format for `ARG`, `BRA` and `USA`, and their TS interface definitions

### Changed
- `AddressForm` now contains an instance of `PlaceDetails`, and an edit button
- `PlaceDetails` and `AddressForm` now consume `address` information directly from `AddressContext` orchestrator
- Simplified `PlaceDetails` tests

## [0.0.4] - 2020-01-17
### Added
- New `AddressContext` dependency (orchestrator component) that provides means to alter global address object.
- New `AddressForm` component

### Changed
- The component should be tested in the `/places` route now, isolated from the rest of the store.

## [0.0.3] - 2020-01-17
### Added
- Automated tests for the PlaceDetails component

### Changed
- Separated PlaceDetails component from the rendered component that adds a Dropdown

## [0.0.2] - 2020-01-09
### Added
- Initial implementation of the PlaceDetails UI component
- Test component that renders PlaceDetails with a Dropdown to select country
