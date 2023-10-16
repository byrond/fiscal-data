import {
  filterUniqueValues,
  annualAggregation,
  api120UniqueAggregation,
  transformAPI130,
  transformAPI129,
  transformAPI146,
  transformAPI144,
} from './highlighted-datasets-config';
import testHelpers from './test-helpers';

describe('Highlighted Datasets Config', () => {
  const consoleWarn = console.warn;
  beforeAll(() => {
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.warn = consoleWarn;
  });

  describe('filterUniqueValues', () => {
    it('returns the array param, or an empty array, if input params are invalid', () => {
      const testArray = [1, 2, 3];
      expect(filterUniqueValues()).toStrictEqual([]);
      expect(filterUniqueValues(testArray)).toStrictEqual(testArray);
      expect(filterUniqueValues(null, 'testField')).toStrictEqual([]);
    });

    it('returns an array of unique value keys', () => {
      const testArray = [
        { make: 'Ford', model: 'Taurus' },
        { make: 'Ford', model: 'Fusion' },
        { make: 'Honda', model: 'Accord' },
        { make: 'Chevy', model: 'Impala' },
        { make: 'Ford', model: 'F-150' },
        { make: 'Honda', model: 'Pilot' },
      ];
      const field = 'make';
      expect(filterUniqueValues(testArray, field)).toStrictEqual(['Ford', 'Honda', 'Chevy']);
    });
  });

  describe('annualAggregation', () => {
    it('exits gracefully if called with invalid params', () => {
      jest.clearAllMocks();
      expect(annualAggregation(null)).toStrictEqual([]);
      expect(annualAggregation({})).toStrictEqual([]);
      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it('returns a summed array on innermost years of data when outermost years are incomplete', () => {
      const isPerfectYearArr = false; // Outermost years don't have January - December
      const api120DataArr = testHelpers.getAPI120DataArr(isPerfectYearArr);
      const apiArray = api120DataArr.resArray;
      const fields = api120DataArr.fields;

      expect(annualAggregation({ data: apiArray }, fields.year, fields.month, fields.aggregationField, null)).toStrictEqual(
        api120DataArr.transformedArray
      );
    });

    it('allows a unique aggregation function to return a summed array on innermost years of data when outermost years are incomplete', () => {
      const isPerfectYearArr = false; // Outermost years don't have January - December
      const api120DataArr = testHelpers.getAPI120DataArr(isPerfectYearArr);
      const apiArray = api120DataArr.resArray;
      const fields = api120DataArr.fields;

      expect(annualAggregation({ data: apiArray }, fields.year, fields.month, fields.aggregationField, api120UniqueAggregation)).toStrictEqual(
        api120DataArr.transformedUniqueAggArray
      );
    });

    it('allows a unique aggregation function to return a summed array on all years of data when outermost years are complete', () => {
      const isPerfectYearArr = true; // Outermost years don't have January - December
      const api120DataArr = testHelpers.getAPI120DataArr(isPerfectYearArr);
      const apiArray = api120DataArr.resArray;
      const fields = api120DataArr.fields;

      expect(annualAggregation({ data: apiArray }, fields.year, fields.month, fields.aggregationField, api120UniqueAggregation)).toStrictEqual(
        api120DataArr.transformedUniqueAggArray
      );
    });
  });

  it('transform for API 130 (DTS) transform', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => {
      return new Date(new Date(2021, 8, 7, 12).valueOf());
    });
    const api130Data = testHelpers.getAPI130Data();

    expect(transformAPI130(api130Data.res)).toStrictEqual(api130Data.postTransformData);
  });

  it('transform for API 129 (DTS) transform', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => {
      return new Date(new Date(2021, 7, 31, 12).valueOf());
    });
    const api129Data = testHelpers.getAPI129Data();

    expect(transformAPI129(api129Data.res)).toStrictEqual(api129Data.postTransformData);
  });

  it('transform for API 146 (Avg Interest Rates) transform', () => {
    const api146Data = testHelpers.getAPI146Data();
    expect(transformAPI146(api146Data.res)).toStrictEqual(api146Data.postTransformData);
  });

  it('transform for API 1444 (U.S. Treasury-Owned Gold) transform', () => {
    const api144Data = testHelpers.getAPI144Data();
    expect(transformAPI144(api144Data.res)).toStrictEqual(api144Data.postTransformData);
  });
});
