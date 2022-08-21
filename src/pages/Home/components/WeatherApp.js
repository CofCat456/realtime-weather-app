import { useState, useEffect } from 'react';

import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import WeatherCard from './WeatherCard';
import WeatherSetting from './WeatherSetting';

import useWeatherApi from '../../../components/useWeatherApi';
import { findLocation } from '../../../global/utils';

const theme = {
    light: {
        backgroundColor: '#ededed',
        foregroundColor: '#f9f9f9',
        boxShadow: '0 1px 3px 0 #999999',
        titleColor: '#212121',
        temperatureColor: '#757575',
        textColor: '#828282',
    },
    dark: {
        backgroundColor: '#1F2022',
        foregroundColor: '#121416',
        boxShadow:
            '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
        titleColor: '#f9f9fa',
        temperatureColor: '#dddddd',
        textColor: '#cccccc',
    },
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: ${({ theme }) => theme.backgroundColor};
`;

const WeatherApp = () => {
    const storageLocationName = localStorage.getItem('locationName');

    const [currentLocationName, setCurrentLocationName] = useState(
        storageLocationName || '臺北'
    );
    const currentLocation = findLocation(currentLocationName) || {};

    const [weatherElement, fetchData] = useWeatherApi(currentLocation);

    const { currMoment } = weatherElement;

    const [currentTheme, setCurrentTheme] = useState('light');

    const [currentPage, setCurrentPage] = useState('WeatherCard');

    useEffect(() => {
        setCurrentTheme(currMoment === 'day' ? 'light' : 'dark');
    }, [currMoment]);

    useEffect(() => {
        localStorage.setItem('locationName', currentLocationName);
    }, [currentLocationName]);

    return (
        <ThemeProvider theme={theme[currentTheme]}>
            <Container>
                {currentPage === 'WeatherCard' && (
                    <WeatherCard
                        currentLocation={currentLocation}
                        weatherElement={weatherElement}
                        moment={currMoment}
                        fetchData={fetchData}
                        setCurrentPage={setCurrentPage}
                    />
                )}
                {currentPage === 'WeatherSetting' && (
                    <WeatherSetting
                        currLocationName={currentLocation.locationName}
                        setCurrentPage={setCurrentPage}
                        setCurrentLocationName={setCurrentLocationName}
                    />
                )}
            </Container>
        </ThemeProvider>
    );
};

export default WeatherApp;
