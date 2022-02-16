import {
  ComponentDataSelectors,
  ComponentToDataElementsMap,
  DataElementToAttributesMap,
  ElementAttributeKeys,
  HashToComponentRecord,
} from 'identify-sock/types';
import { hashString } from 'utils';

const getDataElementAttributes = (dataElement: Element, attributeKeys: string[]) => {
  const dataElementAttributes = attributeKeys.reduce((attributes, attributeKey) => {
    const attributeValue = dataElement[attributeKey as ElementAttributeKeys];
    if (attributeValue === null) {
      throw Error(`Attribute value for ${attributeKey} cannot be null.`);
    }
    return { ...attributes, [attributeKey]: attributeValue };
  }, {});
  return dataElementAttributes;
};

const getComponentToDataElementsMap = (
  components: Element[],
  componentDataSelectors: ComponentDataSelectors
) => {
  const componentToDataElements: ComponentToDataElementsMap = new Map();
  components.forEach((component) => {
    const dataElementToAttributes: DataElementToAttributesMap = new Map();
    componentDataSelectors.forEach(([selector, attributeKeys]) => {
      const dataElement = component.querySelector(selector);
      if (dataElement === null) {
        throw Error(`Data element with selector ${selector} cannot be null.`);
      }

      const dataElementAttributes = getDataElementAttributes(dataElement, attributeKeys);

      dataElementToAttributes.set(dataElement, dataElementAttributes);
    });

    componentToDataElements.set(component, dataElementToAttributes);
  });

  return componentToDataElements;
};

export const getHashToComponent = async (
  componentsSelector: string,
  componentDataSelectors: ComponentDataSelectors
) => {
  const components = [...document.querySelectorAll(componentsSelector)];

  const componentToDataElementsMap = getComponentToDataElementsMap(
    components,
    componentDataSelectors
  );

  console.info(
    'Component Data Elements Attributes Map Data Structure:',
    componentToDataElementsMap
  );

  const DataElementToAttributes = [...componentToDataElementsMap.values()];

  const componentsDataElementsAttributesValues = DataElementToAttributes.map(
    (dataElementToAttributes) => [...dataElementToAttributes.values()]
  ).map((dataElementsAttributes) =>
    dataElementsAttributes.map((dataElementAttributes) => Object.values(dataElementAttributes))
  );

  const normalizedComponentsAttributesValues = componentsDataElementsAttributesValues.map(
    (dataElementAttributesValues) =>
      dataElementAttributesValues.reduce(
        (normalizedValue, attributesValue) => `${normalizedValue}${attributesValue.toString()}`,
        ''
      )
  );

  const componentHashes = await Promise.all(normalizedComponentsAttributesValues.map(hashString));

  const componentToHash = componentHashes.reduce<Record<string, Element>>(
    (accumulator, hash, i) => ({ ...accumulator, [hash]: components[i] }),
    {}
  );

  return componentToHash;
};

export const invertHashToComponent = (hashToComponent: HashToComponentRecord) => {
  const componentToHash = new Map<Element, string>();
  Object.entries(hashToComponent).forEach(([hash, component]) =>
    componentToHash.set(component, hash)
  );

  return componentToHash;
};
