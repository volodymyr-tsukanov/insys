

export const transformToChartData = (obj: any, keyName: string, valueName: string) => {
    return Object.entries(obj).map(([key, value]) => ({
        [keyName]: key,
        [valueName]: value
    }));
};