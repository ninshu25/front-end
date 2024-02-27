import { Options } from "../interfaces/options.interface";

export class Contact {

    static options: Options[] = [
        { name: 'First Name', value: 'firstName', type: 'text', formField: true },
        { name: 'Last Name', value: 'lastName', type: 'text', formField: true },
        { name: 'Phone Number', value: 'phoneNumber', type: 'text', formField: true },
        { name: 'Email', value: 'email', type: 'text', formField: true },
        { name: 'Date Created', value: 'createdDate', type: 'date', formField: false }
    ];

    id: string | null = null;

    name: string | null = null;

    firstName?: string | null = null;

    lastName?: string | null = null;

    phoneNumber: string | null = null;

    email: string | null = null;

    deleted: boolean = false;

    createdDate: Date | null = null;
}
