import { useState, useEffect, useCallback } from 'react';

import {
    API_GET_CurrentWeather,
    API_GET_FetchWeatherForecast,
    API_GET_FetchMoment,
} from '../global/constants';

async function asyncFetchCurrentWeather(locationName) {
    try {
        const res = await fetch(
            `${API_GET_CurrentWeather}&locationName=${locationName}`
        );
        const data = await res.json();
        const locationData = await data.records.location[0];

        const weatherElements = locationData?.weatherElement.reduce(
            (neededElements, item) => {
                if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
                    neededElements[item.elementName] = item.elementValue;
                }
                return neededElements;
            },
            {}
        );

        return {
            observationTime: data?.records?.location[0]?.time?.obsTime,
            locationName: data?.records?.location[0]?.locationName,
            temperature: weatherElements?.TEMP,
            windSpeed: weatherElements?.WDSD,
            humid: weatherElements?.HUMD,
        };
    } catch (error) {
        throw new Error(error);
    }
}

async function asyncFetchWeatherForecast(cityName) {
    try {
        const res = await fetch(
            `${API_GET_FetchWeatherForecast}&locationName=${cityName}`
        );
        const data = await res.json();
        const locationData = await data.records.location[0];

        const weatherElements = locationData?.weatherElement.reduce(
            (neededElements, item) => {
                if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
                    neededElements[item.elementName] = item?.time[0]?.parameter;
                }
                return neededElements;
            },
            {}
        );

        return {
            cityName: locationData?.locationName,
            description: weatherElements?.Wx?.parameterName,
            weatherCode: weatherElements?.Wx?.parameterValue,
            rainPossibility: weatherElements?.PoP?.parameterName,
            comfortability: weatherElements?.CI?.parameterName,
        };
    } catch (error) {
        throw new Error(error);
    }
}

async function asyncFetchMoment(sunriseCityName) {
    try {
        const now = new Date();

        const nowDate = Intl.DateTimeFormat('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
            .format(now)
            .replace(/\//g, '-');

        const res = await fetch(
            `${API_GET_FetchMoment}&locationName=${sunriseCityName}&dataTime=${nowDate}`
        );
        const data = await res.json();
        const locationData = await data.records.locations.location[0].time;

        const sunTimestamp = locationData[0].parameter.reduce(
            (neededElements, item) => {
                if (['日出時刻', '日沒時刻'].includes(item.parameterName)) {
                    neededElements[item.parameterName] = item.parameterValue;
                }
                return neededElements;
            },
            {}
        );

        const sunriseTimestamp = new Date(
            `${locationData[0].dataTime} ${sunTimestamp['日出時刻']}`
        ).getTime();
        const sunsetTimestamp = new Date(
            `${locationData[0].dataTime} ${sunTimestamp['日沒時刻']}`
        ).getTime();

        const nowTimeStamp = now.getTime();

        return sunriseTimestamp <= nowTimeStamp &&
            nowTimeStamp <= sunsetTimestamp
            ? 'day'
            : 'night';
    } catch (error) {
        throw new Error(error);
    }
}

const useWeatherApi = ({ locationName, cityName, sunriseCityName }) => {
    const [weatherElement, setWeatherElement] = useState({
        cityName: '',
        observationTime: new Date(),
        locationName: '',
        temperature: 0,
        windSpeed: 0,
        humid: 0,
        description: '',
        weatherCode: '',
        rainPossibility: '',
        comfortability: '',
        currMoment: '',
        isLoding: true,
    });

    const fetchData = useCallback(() => {
        const fetchingData = async () => {
            try {
                const [currentWeather, weatherForecast, moment] =
                    await Promise.all([
                        asyncFetchCurrentWeather(locationName),
                        asyncFetchWeatherForecast(cityName),
                        asyncFetchMoment(sunriseCityName),
                    ]);

                console.log('成功抓取資料', {
                    ...currentWeather,
                    ...weatherForecast,
                    moment,
                });

                setWeatherElement({
                    ...currentWeather,
                    ...weatherForecast,
                    currMoment: moment,
                    isLoding: false,
                });
            } catch (error) {
                throw new Error(error);
            }
        };

        setWeatherElement((preState) => ({
            ...preState,
            isLoding: true,
        }));

        fetchingData();
    }, [locationName, cityName, sunriseCityName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [weatherElement, fetchData];
};

export default useWeatherApi;
