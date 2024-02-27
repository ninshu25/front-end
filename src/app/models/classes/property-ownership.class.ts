import { Entities } from "../enums/entites.enum";
import { Options } from "../interfaces/options.interface";

export class PropertyOwnership {

    static options: Options[] = [
        { name: 'Contact Name', value: 'contactId', type: 'select', formField: true, foreignKey: true, foreignKeyValue: Entities.Contact },
        { name: 'Property Name', value: 'propertyId', type: 'select', formField: true, foreignKey: true, foreignKeyValue: Entities.Property },
        { name: 'Price Acquired', value: 'priceAcquisition', type: 'price', formField: true },
        { name: 'Asking Price', value: 'askingPrice', type: 'price', formField: false },
        { name: 'Effective From', value: 'effectiveFrom', type: 'date', formField: true },
        { name: 'Effective Till', value: 'effectiveTill', type: 'date', formField: false }
    ];

    id: string | null = null;

    contactId: string | null = null;

    propertyId: string | null = null;

    askingPrice: number | null = null;

    priceAcquisition: number | null = null;

    deleted: boolean = false;

    effectiveFrom: Date = new Date();

    effectiveTill: Date | null | null = null;  
}
