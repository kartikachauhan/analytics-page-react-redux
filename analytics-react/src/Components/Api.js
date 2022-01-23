import axios from "axios";

export const fetchReports = async (range) => {

    let dateReportsApi = {
        from: range.from,
        to: range.to
    };

    return axios.get(`http://go-dev.greedygame.com/v3/dummy/report?startDate=${dateReportsApi.from}&endDate=${dateReportsApi.to}`)
        .catch((error) => {
            console.log(error);
        });
};

export const fetchAppsData = async () => {
    return axios.get(`http://go-dev.greedygame.com/v3/dummy/apps`)
        .catch((error) => {
            console.log(error);
        });
};