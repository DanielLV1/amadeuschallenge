export const PASSENGER_TYPES = ['Adults', 'Youth', 'Children', 'Infants'] as const;
export type PassengerType = typeof PASSENGER_TYPES[number];

export interface FlightContext {
    origin?: string;
    originIata?: string;
    destination?: string;
    destinationIata?: string;
    departureDate?: string;
    passengers?: Partial<Record<PassengerType, number>>;
    farePrice?: number;
    baggageOption?: string;
}

// acepta adults ADULTS o Adults desde el feature
export function toPassengerType(value: string): PassengerType {
    const found = PASSENGER_TYPES.find(t => t.toLowerCase() === value.trim().toLowerCase());
    if (!found) {
        throw new Error(`Tipo de pasajero invalido: "${value}". Usa ${PASSENGER_TYPES.join(', ')}`);
    }
    return found;
}
