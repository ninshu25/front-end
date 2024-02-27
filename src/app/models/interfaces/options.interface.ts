import { Entities } from "../enums/entites.enum";
import { EnumValues } from "../enums/enum-values.enum";

export interface Options<T = string> {
    name: string;
    value: T;
    order?: number;
    type?: string;
    typeValue?: string;
    nullable?: boolean;
    action?: string;
    formField?: boolean;
    foreignKey?: boolean;
    foreignKeyValue?: Entities;
    enum?: boolean;
    enumValue?: EnumValues;
  }