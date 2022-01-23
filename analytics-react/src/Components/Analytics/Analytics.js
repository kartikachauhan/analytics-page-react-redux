import React, { useState, useEffect } from "react";
import moment from "moment";

import noData from "../assets/no-data.svg";
import CustomDate from "../custom-date/CustomDate";
import TableData from "../table-data/TableData";
import { fetchReports, fetchAppsData } from "../Api";

import "./Analytics.css";

export default function Analytics() {
    const [dataAvailable, setDataAvailable] = useState(false);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [appName, setAppName] = useState([]);
    const [customDate, setCustomDate] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [from, setFrom] = useState(() => {
        const item = JSON.parse(sessionStorage.getItem("fromto"));
        if (item) return new Date(item.from);
        else {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() - 6);
            return defaultDate;
        }
    });
    const [to, setTo] = useState(() => {
        const item = JSON.parse(sessionStorage.getItem("fromto"));

        if (item) return new Date(item.to);
        else return new Date();
    });
    const [selectedOptions, setSelectedOptions] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    const analyticsTable__headers = {
        list: [
            "Date",
            "App",
            "Clicks",
            "Requests",
            "Responses",
            "Impressions",
            "Revenue",
            "Fill rate",
            "CTR"
        ]
    };

    const fetchReportsData = (from, to) => {
        fetchReports({
            from: formatDateForApi(from),
            to: formatDateForApi(to),
        }).then((res) => {
            if (res.status === 200 && res.data.data && res.data.data.length > 0) {
                setAnalyticsData(res.data.data);
                setDataAvailable(true);
            } else {
                setDataAvailable(false);
            }
        });
    }

    useEffect(() => {
        fetchAppsData().then((res) => {
            if (res.status === 200 && res.data.data && res.data.data.length > 0) {
                setAppName(res.data.data);
            }
        })
    }, [])

    useEffect(() => {
        fetchReportsData(from, to);
    }, []);

    useEffect(() => {
        let storeThis = { from, to };
        sessionStorage.setItem("fromto", JSON.stringify(storeThis));
    }, [from, to]);

    const openSettings = () => {
        setShowSettings(true);
    }

    const closeSettings = () => {
        setShowSettings(false);
    }

    const chnageDateDropDown = () => {
        setCustomDate(true);
    };

    const closeCustomDate = () => {
        setCustomDate(false);
    };

    const formatDateForApi = (theDate) => {
        let month = theDate.getMonth() + 1;
        let day = theDate.getDate();

        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;

        return theDate.getFullYear() + "-" + month + "-" + day;
    };

    const handleFromTo = (from, to) => {
        fetchReportsData(from, to);
        setFrom(from);
        setTo(to);
    };

    const changeSettingOptions = (data, index) => {
        let temp = [];
        if (selectedOptions.includes(index)) {
            temp = selectedOptions.filter((option) => option !== index);
            setSelectedOptions(temp.sort((a, b) => a - b));
        } else
            setSelectedOptions([...selectedOptions, index].sort((a, b) => a - b));
    };

    let _from = null;
    let _to = null;
    let fromTo = "";

    _from = from;
    _to = to;
    if (_from && _to) {
        fromTo =
            moment(_from).format("MMMM Do YYYY") +
            " - " +
            moment(_to).format("MMMM Do YYYY");
    }

    return (
        <div className="main-app">
            <div className="main-app-title">Analytics</div>
            <div className="main-app-analytics-header">
                <div onClick={() => chnageDateDropDown()}>
                    <div className="main-app-analytics-date">
                        {fromTo}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                        style={{ display: "flex", alignItems: "center" }}
                        className="main-app-analytics-title-dropdown"
                        onClick={() => openSettings()}
                    >
                        <div>Settings</div>
                    </div>
                </div>
            </div>
            {showSettings && (
                <div className="main-app-analytics-settings-container">
                    <div className="main-app-analytics-settings-title">Dimensions and Metrices</div>
                    <div className="DisplayCustomDropDownAd">
                        {
                            analyticsTable__headers.list.map((data, index) => {
                                return (
                                        <div key={Math.random() * 10000}
                                            className="DisplayCustomDropDown-label draggable-item-horizontal"
                                            onClick={() => data == 'Date' || data == 'App' ? {} : changeSettingOptions(data, index)}
                                            style={{ cursor: data == 'Date' || data == 'App' ? "default" : "pointer" }}
                                            key={index}
                                        >
                                            <span style={{ background: selectedOptions.includes(index) ? "#136FED 0% 0% no-repeat padding-box" : "transparent" }}></span>
                                            <span> {data}</span>
                                        </div>
                                );
                            })
                        }
                    </div>
                    <div className="main-app-analytics-settings-save-close-container">
                        <div onClick={() => closeSettings()}>Close</div>
                        <div onClick={() => closeSettings()}>Apply Changes</div>
                    </div>
                </div>
            )}
            <div style={{ position: "relative" }}>
                {customDate && (
                    <CustomDate
                        from={from}
                        to={to}
                        close={closeCustomDate}
                        clickOutside={closeCustomDate}
                        sendFromTo={(from, to) => handleFromTo(from, to)}
                    />
                )}
            </div>
            <div className="main-app-analytics-body">
                {dataAvailable ?
                    (
                        <TableData selectedOptions={selectedOptions} analyticsData={analyticsData} analyticsTable__headers={analyticsTable__headers.list} appName={appName} setAnalyticsData={setAnalyticsData} />
                    )
                    : (
                        <div className="main-app-analytics-not-found-conatiner">
                            <div className="main-app-analytics-not-found-img-container">
                                <img src={noData} alt="no-data" />
                            </div>
                            <div className="main-app-analytics-not-found-text-container">
                                <div>Hey! Something’s off!</div>
                                <div>We couldn’t display the given data.</div>
                                <div>Try changing your filters or selecting a different date.</div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
};