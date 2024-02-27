import { EnumValues } from "../enums/enum-values.enum";
import { PropertyType } from "../enums/property-type.enum";
import { Options } from "../interfaces/options.interface";

export class Property {

    static options: Options[] = [
        { name: 'Property Type', value: 'propertyTypeId', type: 'select', formField: true, enum: true, enumValue: EnumValues.PropertType },
        { name: 'Property Name', value: 'name', type: 'text', formField: true },
        { name: 'Street Name', value: 'streetName', type: 'text', formField: true },
        { name: 'House Name', value: 'houseName', type: 'text', formField: true },
        { name: 'House Number', value: 'houseNumber', type: 'text', formField: true },
        { name: 'Post Code', value: 'postCode', type: 'text', formField: true },
        { name: 'Price', value: 'price', type: 'price', formField: true },
        { name: 'Registration Date', value: 'registrationDate', type: 'date', formField: false }
    ];



    id: string | null = null;

    propertyTypeId: PropertyType | null = null;

    name: string | null = null;

    streetName: string | null = null;

    houseName: string | null = null;

    houseNumber: string | null = null;

    postCode: string | null = null;

    price: number | null = null;

    deleted: boolean | null = null;

    registrationDate: Date = new Date();

    selling: boolean = false;
}
