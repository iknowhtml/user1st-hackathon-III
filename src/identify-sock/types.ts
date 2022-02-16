import { getHashToComponent } from './utils';

export type ComponentDataSelector = [selector: string, attributeKeys: string[]];

export type ComponentDataSelectors = ComponentDataSelector[];

export type ElementAttributeKeys = keyof Element;

type DataElementAttributesRecord = Record<string, Element[ElementAttributeKeys]>;
export type DataElementToAttributesMap = Map<Element, DataElementAttributesRecord>;
export type ComponentToDataElementsMap = Map<Element, DataElementToAttributesMap>;

export type HashToComponentRecord = Awaited<ReturnType<typeof getHashToComponent>>;
