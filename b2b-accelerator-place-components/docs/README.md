# Place Components

⚠️ **This is an ongoing, unsupported, unfinished and undocumented project. We do not guarantee any results after installation.** ⚠️

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

The Place Components are three components (`PlaceDetails`, `AddressForm`, and `LocationForm`) that are meant to replace the [AddressForm](https://github.com/vtex/address-form) repository.

The Place Components should always be rendered inside their wrapper orchestrator, called [AddressContext](https://github.com/vtex-apps/address-context). This orchestrator provides the address information and an API to alter it.

For all the following components, you can run tests with `vtex test` from the root repository.

To manually test internationalization, you can switch the locale information by adding the query string `?cultureInfo={locale}`, like `?cultureInfo=en`. More information in the [Locale Switcher repository](https://github.com/vtex-apps/locale-switcher).

Country data is sorted according to [Figma designs](https://www.figma.com/file/umwHrHA8nifvQIPEN3DHpX/Onda-Store---Place-Components?node-id=0%3A1) for this project, more specifically, to the [spreadsheet](https://docs.google.com/spreadsheets/d/1_sbwzLlgzFPsddPRTq6kcpbMyoxgOBfb1T8YRQs3k7k/edit#gid=0) defining the mapping between the API names and the "fantasy" names. This fantasy name is explicitly set in the "label" property, and that one is always placed first. The fantasy name of the field determines the styling it receives.

## Place Details

The Place Details component displays a summary of a place according to the address it receives from the wrapper orchestrator, and the description of the structure that receives as prop. There are three variations of PlaceDetails according to the amount of information that needs to be shown in a particular scenario. Below you can see a description of them.

- **Extended**: complete address, with all information that's necessary for carriers and users to identify it.
- **Compact**: displays details gathered through LocationForm or from its info.
- **Minimal**: only the information that the user inputed in LocationInput or LocationSelect.

## Address Form

The Address Form component displays inputs and selects to add/edit information contained in the `Address` object it receives from the wrapper orchestrator, and it also displays already filled data using the `PlaceDetails` component.

At first, the `AddressForm` renders a `PlaceDetails` with compact display mode, and edit button, and the rest of the fields as inputs/selects to complete the information. When the user clicks the edit button, it changes to render a `PlaceDetails` component in minimal display mode, and the rest of the fields as inputs/selects.

In the previous [AddressForm](https://github.com/vtex/address-form) repository, some of the fields are rendered as dropdowns, and some of those dropdowns depend on another (imagine selecting state, and then selecting city). In the new place components, that complex logic is only meant for the `LocationForm` (that is, when first selecting the address).

## Location Form

The Location Form is a component that is used when the user wants to **inserts** address information to a system, it's built up of many components.

### LocationCountry

The Location Country component is meant to replace the current `CountrySelector` component from Checkout V6. It's main task is to let the user select a country, and it has the added functionality of trying to guess a suitable country so that the user is not bothered in selecting such a (nowadays) obvious-to-get information.

### LocationForm

The Location Form component gathers the most basic details about a particular address, and it is formed by three inner components.

#### LocationField (Search)

The Location Search is a component that suggests a list of addresses based on a search term. A plug and play feature allows the usage of a custom address database and search algorithm (this feature is currently under construction).

#### LocationField (Input)

To be done.

#### LocationField (Select)

The LocationField Select renders a set of select components (called `Dropdown` in our styleguide) such that one depends on the other. This is used, for example, to first display a list of states, and based on that selection of states then display a list of cities, and based on the selected cities, to display a list of neighborhoods, etc.

### DeviceCoordinates

The `DeviceCoordinates` component renders a simple button that will ask for your permission to get the location from your device. In case the user allows this, the component will modify the address object from the `address-context` automatically filling data based on the lat/lng information gained through the browser. To do this autocompletion, this component communicates with the `places-graphql` project.

## Configuration 

TBC

## Customization

🚧 To be defined.

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
