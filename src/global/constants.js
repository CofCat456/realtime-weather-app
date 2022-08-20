export const API_HOST = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore';

export const API_Authorization = 'CWB-B9307C6F-B487-4F2F-BF24-A849813BCE9D';

export const API_GET_CurrentWeather = `${API_HOST}/O-A0003-001?Authorization=${API_Authorization}`;

export const API_GET_FetchWeatherForecast = `${API_HOST}/F-C0032-001?Authorization=${API_Authorization}`;

export const API_GET_FetchMoment = `${API_HOST}/A-B0062-001?Authorization=${API_Authorization}`;
