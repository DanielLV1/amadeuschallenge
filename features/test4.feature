Feature: Flight search on Avianca

  Scenario: Search round trip flights
    Given the user navigates to the Avianca portal
    When the "round trip" option is verified by default
    And selects "one way" option
    And the destination is "San Andres"
    And selects a enabled departure date
    Then validates the departure date format
    When selects the passengers:
      | type   | quantity |
      | Adults |        2 |
    Then validates the total passengers selected
    When confirm initial search
    Then selects best price flight
    Then validates all fare options are displayed
    And selects the cheapest fare
    Then the upgrade pop-up opens if present
    Then validates the trip summary and continue
    And selects continue without sign in
    When fills passenger information:
      | passengerIndex | dataFile             | isBookingHolder |
      |              1 | normalPassenger.json | false           |
      |              2 | holderPassenger.json | true            |
    Then selects continue to payment
    Then the Request Services screen opens
    When selects "No, I have what I need" if baggage menu is present
