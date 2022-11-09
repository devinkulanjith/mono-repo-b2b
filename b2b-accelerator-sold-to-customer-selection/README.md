# Checkout Simulator

This app runs order simulation against SAP and JDE before allowing the user to complete the order on VTEX.

## Prerequisites

1. Add the following section to the order form configuration.

````json
{
    "fields": [
        "lineItemData",
        "poNumber"
    ],
    "id": "checkout-simulation",
    "major": 1
}
````
