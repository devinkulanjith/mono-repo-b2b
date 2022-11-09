# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.25] - 2022-04-26

### Fixed

- Fixed `CL` unavailability in sold to selection
- Fixed undefined variables in checkout

### Added

- Added impersonation info to simulation response

## [1.1.24] - 2022-04-11

### Fixed

- Downgraded VTEX API version

## [1.1.23] - 2022-04-11

### Fixed

- Updated SASS version

## [1.1.22] - 2022-04-09

### Fixed

- Fixed both shipping form and result appearing

## [1.1.21] - 2022-04-08

### Fixed

- Fixed both buttons appearing for Punchout
- Fixed shipping form appearing twice

## [1.1.20] - 2022-04-05

### Fixed

- Restricted Std Lead Time to JDE
- Read small pack attribute from specifications

## [1.1.19] - 2022-04-01

### Fixed

- Added small pack item support
- Fixed alignment of schedule line text in cart

## [1.1.18] - 2022-04-01

### Fixed

- Sent pixel event for sold to auto selection
- Fixed vendor name

## [1.1.17] - 2022-04-01

### Fixed

- Fixed live chat company for auto-selected sold to

## [1.1.16] - 2022-04-01

### Fixed

- Added company for SalesForce chat

## [1.1.15] - 2022-04-01

### Fixed

- Changed the schedule line text

## [1.1.14] - 2022-03-29

### Changed

- Changed the payment-confirmation modal text.

## [1.1.13] - 2022-03-25

### Fixed

- Fixed base URL for Punchout

## [1.1.12] - 2022-03-24

### Fixed

- Added at the latest text to SAP delivery lines

## [1.1.11] - 2022-03-23

### Fixed

- Added at the latest text to delivery lines

## [1.1.10] - 2022-03-18

### Added

- Added external metadata validation

### Changed

- Used single end-point for P2G simulation and metadata

## [1.1.9] - 2022-03-18

### Fixed

- Fixed SAP simulation global error handling

## [1.1.8] - 2022-03-18

## [1.1.7] - 2022-03-15

### Fixed

- Added corporate name to sales account

## [1.1.6] - 2022-03-08

### Fixed

- Added support for external marketplace simulation

## [1.1.5] - 2022-03-07

### Fixed

- Hid PO for Punchout sessions

## [1.1.4] - 2022-03-07

### Fixed

- Prevented deleted sold to account being selected
- Retained user validation for Punchout sessions

## [1.1.3] - 2022-02-25

### Fixed

- Fixed manual price setting

## [1.1.2] - 2022-02-24

### Fixed

- Fixed simulation TLS handshake error

## [1.1.1] - 2022-02-22

## [1.1.0] - 2022-02-22

### Added

- Auto select ship to if there is only one option

## [1.0.98] - 2022-02-18

### Fixed

- Fixed `CL` not found

## [1.0.97] - 2022-02-18

### Fixed

- Skipped OF user validation for Punchout

## [1.0.96] - 2022-02-17

### Fixed

- Fixed the Product Availability Info for JDE
- Fixed the Add Certifications lable on checkout

## [1.0.95] - 2022-02-16

### Fixed

- Changed JDE certification to `CC`

## [1.0.94] - 2022-02-16

### Fixed

- Bypassed OF user validation for Punchout session in checkout

## [1.0.93] - 2022-02-16

### Fixed

- Bypassed OF user validation for Punchout session

## [1.0.92] - 2022-02-14

## Fixed

- Altered wording of order simulate return message

## [1.0.91] - 2022-02-11

### Fixed

- Showed taxes if the values are `0`

## [1.0.90] - 2022-02-11

### Added

- Added the name field to, sold to and ship to in checkout page

### Fixed

- Added asterisk to shipping info PO Number
- Fixed empty cart error in checkout

## [1.0.89] - 2022-02-11

### Fixed

- Removed certification pricing validation

## [1.0.88] - 2022-02-11

## [1.0.87] - 2022-02-11

### Fixed

- Validated pricing only if item exists

## [1.0.86] - 2022-02-11

### Fixed

- Ignored price check if certificate not available

## [1.0.85] - 2022-02-11

### Fixed

- Prevented placing order if pricing not returned

## [1.0.84] - 2022-02-10

## [1.0.83] - 2022-02-10

### Fixed

- Added real data for JDE certification

## [1.0.82] - 2022-02-10

### Fixed

- Fixed rendition of place order and punch back

## [1.0.81] - 2022-02-10

### Added

- Added punch back button

## [1.0.80] - 2022-02-09

### Fixed

- Fixed JDE global errors

## [1.0.79] - 2022-02-09

### Fixed

- Added more error logging

## [1.0.78] - 2022-02-09

### Fixed

- Added better error logging

## [1.0.77] - 2022-02-09

### Fixed

- Added JDE UoM support
- Added the auto select sold to account.
- Added soldtoaccount selection prompt for multiple soldtoaccount users
- Added query loading condition to show modal
- handled soldtoaccount selection prompt when slod to account not selected

### Changed

- Got rid of tax provider

## [1.0.76] - 2022-02-08

### Fixed

- Increased service TTL

### Removed

- Removed the T&C pop up

## [1.0.75] - 2022-02-07

### Fixed

- Fixed display value of UoM at checkout

## [1.0.74] - 2022-02-03

## [1.0.73] - 2022-02-03

### Fixed

- Fixed the app vendor

## [1.0.72] - 2022-02-03

### Added

- Added health check end-point

## [1.0.71] - 2022-02-02

### Changed

- Changed the vendor name and do a new release to sbdsefuat

## [1.0.70] - 2022-02-01

### Fixed

- Automated checkout asset generation

## [1.0.69] - 2022-01-31

# Added

- Added the name field to sold to account selector

## [1.0.68] - 2022-01-27

### Changed

- Add css handlers to `SoldToAccountListWrapper` and `SoldToAccountSelector` components
- Changed the layout of sold to account selector table

## [1.0.67] - 2022-01-24

### Fixed

- Added sold to account query timing

## [1.0.66] - 2022-01-24

### Fixed

- Chunked where clause to fetch sold to accounts

## [1.0.65] - 2022-01-21

## [1.0.64] - 2022-01-20

## [1.0.63] - 2022-01-12

## [1.0.62] - 2022-01-12

### Fixed

- Changed the Agora end-point to UAT for non-prod

## [1.0.61] - 2022-01-07

### Fixed

- Added delivery information for JDE

## [1.0.60] - 2022-01-06

### Fixed

- Updated payment data iff the value is greater than `0`

## [1.0.59] - 2022-01-06

## [1.0.58] - 2022-01-06

## [1.0.57] - 2022-01-06

### Fixed

- Fixed expected JDE response
- Fixed JDE mocks
- Fixed JDE mocks in client

## [1.0.56] - 2021-12-23

### Fixed

- Fixed `400` for clearing cart items
- Added possible fix for order form ID unavailability

## [1.0.55] - 2021-12-22

### Fixed

- Added unit of measure for JDE
- Added logs for simulation

## [1.0.54] - 2021-12-21

### Fixed

- Pointed Agora to dev

## [1.0.53] - 2021-12-17

### Fixed

- Added script to disable Sentry

## [1.0.52] - 2021-12-17

### Fixed

- Added support for prod and UAT for simulation

## [1.0.51] - 2021-12-16

### Fixed

- Switched to Agora production
- Changed vendor to production
- Fixed checkout shipping logic
- Fixed review order details href
- Fixed quantity update in checkout
- Added pointer to quantity buttons
- Hid all phone fields
- Set payments on successful simulation
- Set default items list to empty array
- Used try catch block for tax provider
- Tweaked service config for tax provider

## [1.0.50] - 2021-11-19

### Fixed

- Hid phone field from checkout
- Fixed simulation global errors not being displayed

## [1.0.49] - 2021-11-19

### Fixed

- Limited simulation prices to `2` decimal places

## [1.0.48] - 2021-11-18

### Fixed

- Fixed taxes from the simulation

## [1.0.47] - 2021-11-17

### Fixed

- Got rid of the account for search query
- Included tax/shipping in the total

## [1.0.46] - 2021-11-16

### Removed

- Removed freight massage

## [1.0.45] - 2021-11-16

### Fixed

- Fixed validation for po number input in shipping data form
- Altered error messages in shipping data checkout form
- Fixed show more address information
- Fixed mobile view issue in show more address information
- Showed up to 4 decimal places in checkout

## [1.0.44] - 2021-11-15

### Fixed

- Fixed sold to selection error for impersonation

## [1.0.43] - 2021-11-11

### Fixed

- Fixed infinite loading on successful simulation

## [1.0.42] - 2021-11-11

### Fixed

- Prevented saving address
- Stopped treating SAP exceptions as successes

## [1.0.41] - 2021-11-11

### Fixed

- Showed delivery date list in cart

### Changed

- Displayed simulation pricing in checkout

## [1.0.40] - 2021-11-10

- Fixed choose product button URL for production

## [1.0.39] - 2021-11-10

### Fixed

- Fixed choose product button URL for production

## [1.0.38] - 2021-11-10

### Fixed

- Fixed choose product button
- Fixed tax UI in checkout

## [1.0.37] - 2021-11-10

### Fixed

- Added separate totalizer section
- Fixed choose product button

## [1.0.36] - 2021-11-08

### Fixed

- Added separate minicart with correct pricing

## [1.0.35] - 2021-11-08

### Fixed

- Added numeric stepper behavior to quantity update

## [1.0.34] - 2021-11-05

## [1.0.33] - 2021-11-05

### Fixed

- Fixed the simulation items total price

## [1.0.32] - 2021-11-05

### Fixed

- Stopped clearing the cart

## [1.0.31] - 2021-11-03

### Fixed

- Removed cloning option

## [1.0.30] - 2021-11-03

### Fixed

- Emptied cart in real time on invalidate

## [1.0.29] - 2021-11-02

### Fixed

- Fixed the missing schema in conflict resolving.

## [1.0.28] - 2021-11-02

### Added

- Added Ecommerce function availability logic resolver

## [1.0.27] - 2021-11-02

### Fixed

- Divided net value by quantity for unit price
- Invalidated order form on logout

## [1.0.26] - 2021-11-01

### Fixed

- Handled not set custom data
- Emptied cart when user changed

## [1.0.25] - 2021-10-28

### Fixed

- Fixed import statement for SCSS
- Fixed sold to pagination
- Fixed sold to search
- Added sold to selection button

## [1.0.24] - 2021-10-28

### Fixed

- Added the Terms & Conditions link to the Terms and Conditions Modal

## [1.0.23] - 2021-10-27

### Fixed

- Prevented order form update if same sold to selected
- Cleared cart in case sold to account changed

## [1.0.22] - 2021-10-26

### Fixed

- Fixed undefined delivery date

## [1.0.21] - 2021-10-26

### Fixed

- Fixed item delivery date
- Removed mock simulation from UI

## [1.0.20] - 2021-10-25

### Fixed

- Created order form in case user does not match

## [1.0.19] - 2021-10-25

### Fixed

- Used default sc as `1` and currency as `USD`

## [1.0.18] - 2021-10-25

### Fixed

- Used settings to determine the sales channel on simulate
- Used default trade policy `1`

## [1.0.17] - 2021-10-25

### Fixed

- Stopped setting payment method to avoid `400`
- Invalidated simulation data in case user changes
- Showed error on sold to selection
- Fixed `409` on removing custom data
- Validated sold to account selection
- Added order form profile data on sold to selection
- Hid logout link in checkout
- Added scheduled delivery dates after simulation
- Stopped firing order form updated event on quantity update

## [1.0.16] - 2021-10-22

### Fixed

- Fixed quantity badge width
- Fixed minicart metadata update

## [1.0.15] - 2021-10-22

### Fixed

- Stopped setting sold to from previous cart

## [1.0.14] - 2021-10-22

### Fixed

- Stopped adding metadata on quantity change

## [1.0.13] - 2021-10-22

### Fixed

- Fixed simulated item prices for SAP
- Added access check
- Added line item total and quantity
- Changed requested delivery date input label
- Added 7 day lead for requested delivery date
- Fixed simulation box content
- Updated metadata on quantity update
- Disabled price update from UI
- Fixed checkout cart on mobile

## [1.0.12] - 2021-10-22

### Fixed

- Reloaded page on sold to account selection

## [1.0.11] - 2021-10-22

### Fixed

- Allowed only logged-in users to checkout

## [1.0.10] - 2021-10-21

### Fixed

- Pointed SAP request to production

## [1.0.9] - 2021-10-21

### Fixed

- Ignored custom unit multiplier
- Made the static contents translatable
- Added support for attachments
- Removed for loop for jQuery selector
- Removed generated checkout assets
- Fixed checkout URLs for production
- Added loggers for order form ID
- Added loggers for context
- Removed erroneous logging
- Fixed pricing display after simulation
- Invalidated order form when order form user changes
- Added item metadata on hashchange
- Fixed pricing display before simulation
- Fixed quantity selector minimum
- Hid seller info in cart
- Removed unit multiplier from the quantity selector
- Reduced cart product name column width
- Showed real quantities in quantity selector
- Changed simulation button text
- Changed back to cart link text
- Hid coupon form
- Changed buy now button text
- Fixed quantity input styling for desktop

### Added

- Added `sapcert` field
- Added `custsku` field
- Added sold to and ship to address fields

## [1.0.8] - 2021-10-08

### Fixed

- Fixed quantity selector invisibility on hashchange

## [1.0.7] - 2021-10-08

### Added

- Added UM, MOQ per sales organization
- Added client plain email to order form
- Added customer SKU solution
- Added the missing dependencies: types/jquery and webpack
- Added the Terms and Conditions Modal to shipping page

### Fixed

- Changed the logic to support new schema
- Added modified checkout JS file
- Fixed sold to selection for impersonated user
- Fixed sold to list on authenticated user toggle
- Fixed minified checkout JS
- Removed item metadata on sold to change
- Handled custom data not set for metadata
- Handled sales org unavailability
- Added defaults to item metadata at checkout
- Fixed cart metadata update on events
- Invalidated order form with new quantity selector
- Showed item requested delivery date

## [1.0.6] - 2021-09-17

### Fixed

- Fixed margin of cart print button

## [1.0.5] - 2021-09-15

### Fixed

- Added potential fix and logging for tax provider

## [1.0.4] - 2021-09-15

### Fixed

- Fixed sold to selection for CSR using old schema

## [1.0.3] - 2021-09-15

### Fixed

- Showed sold to account details on hashchange
- Showed ship to account info in drop-down
- Showed simulation infra errors

## [1.0.2] - 2021-09-07

### Fixed

- Added org account info only if available

## [1.0.1] - 2021-09-03

### Fixed

- Fixed sold to account 

## [1.0.0] - 2021-09-03

### Fixed

- Fetched UoM only if data unavailable
- Updated UoM on order form updated in checkout

### Added

- Added end point to store unit of measure in custom data
- Added GraphQL to store unit of measure in custom data

## [0.1.2] - 2021-08-26

### Changed

- Removed billing options

## [0.1.1] - 2021-08-26

### Fixed

- Fixed UI of sold to selector

## [0.1.0] - 2021-08-26

### Fixed

- Fixed sold to selector styling
- Hid Save Changes button
- Removed base measurement unit from SAP request
- Fixed tax provider
- Added date picker for required delivery date
- Used template literals to render HTML
- Updating resolver, react query with salesOrganizationCode
- Added alert icons to the checkout
- Fixed warnings showing up for wrong items
- Fixed levels for item warnings
- Used custom data for invalidating the order form
- Added organization account information
- Added shipping form validation
- Fixed UI of sold to account in checkout

### Added

- Added warning if no sold to account selected at checkout

## [0.0.4] - 2021-08-20

### Added

- Added PO number input
- Added mock simulation
- Added mock version of tax implementation
- Added message on successful simulation
- Added global error and item warning simulation
- Added preselected sold to account
- Added request/response parsers
- Added required delivery date

### Fixed

- Handled null simulation data at tax calculation
- Showed PO number, sold to and ship to in shipping section
- Improved simulation feedback UI
- Used real cart for simulation where possible
- Ran scripts on hash change
- Fixed incorrect tax calculation
- Fixed checkout flow using smart checkout
- Removed the shipping information submit button
- Showed the selected shipping information
- Showed pricing only when the simulation was run successfully
- Fixed action-less state in simulation
- Changed Payment text to Simulation
- Fixed nullable values
- Fixed cart update on shipping change
- Changed Shipping section header
- Showed item name with warnings
- Fixed shipping address not being able to change
- Added real data for simulation
- Fixed flow errors
- Fixed unit of measurement
- Fixed product list invisibility on simulate
- Refactored stylesheets
- Stopped reloading on simulate success
- Added styling from checkout-ui-custom
- Fixed display of line item errors
- Fixed display of sold to customer number
- Used real end-point for SAP success path
- Added checkout-custom files to version control
- Added selected address on successful simulation
- Hid cart more options
- Added tax information
- Used real end-point for JDE success path
- Hid cart more options
- Cleared ship to, simulation data on sold to change
- Fixed base styling of checkout
- Fixed buy button enabled before simulation
- Removed timer to invalidate order form
- Refreshed page on simulate success
- Invalidated order form if required
- Fixed simulation message positions/styling
- Fixed shipping button width
- Fixed real price display
- Fixed mini cart loader appearing on hash change
- Hid real price from mini cart
- Added real simulation button and fixed styling
- Added loaders to buttons
- Fixed simulate button text
- Invalidated simulation on cart update
- Increased service timeout
- Fixed SAP global error parsing
- Fixed initial version
- Fixed initial version

### Changed

- Added sold to selection to site header
- Used `checkout-ui-custom` instead of `scripts`
- Used MD V1 and changed schema

## [0.0.3] - 2020-10-07

## [0.0.2] - 2020-07-01

### Fixed

- Problems with typings and lint
