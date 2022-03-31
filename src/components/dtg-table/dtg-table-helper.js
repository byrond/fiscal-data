export const loadTimerDelay = 500;
const debounceDelay = 400;
// Make sure we have a small delay that is not negative.
export const netLoadingDelay = (loadTimerDelay > debounceDelay) ? loadTimerDelay - debounceDelay : 100;

export const loadingTimeout = (loadCanceled, callback) => {
  if (!loadCanceled && callback) {
    callback(true);
  }
}

function createMissingConfigs(keys, columnConfig) {
    const indexed = {};

    if (columnConfig) {
        columnConfig.forEach(obj => indexed[obj.property] = obj);
    }

    return keys.map(property => {
        if (!indexed[property]) {
            return {
                property: property,
                name: property
            }
        }
    }).filter(item => item);
}

export function setColumns(dataProperties, columnConfig) {
    const { excluded, keys } = dataProperties;
    const propsWithNoConfig = createMissingConfigs(keys, columnConfig);
    columnConfig = columnConfig || [];

    columnConfig.sort((a, b) => {
        if (a.order < b.order) {
            return -1
        } else if (a.order > b.order) {
            return 1
        } else {
            return 0
        }
    });

    const configWithMissing = columnConfig.concat(propsWithNoConfig);

    return configWithMissing.filter(c => !excluded.includes(c.property));
}

export function buildColumnConfig(fields) {
    return fields.map(f => {
      return {
        property: f.columnName,
        name: f.prettyName,
        type: f.dataType,
        order: f.isPrimaryDateCol ? -1 : f.order || 1
      };
    });
}
