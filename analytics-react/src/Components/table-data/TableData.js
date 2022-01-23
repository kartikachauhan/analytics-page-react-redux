import React from "react";
import moment from "moment";
import "./TableData.css";

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

const convertLargeValues = (value) => {
    value = parseFloat(value);

    let decimalPart = 0;
    let result = value;
    let numeric = value;
    if (value >= 1000) {
        numeric = (value / 1000).toFixed(2)
        decimalPart = parseFloat(numeric) % 1;
        if (decimalPart === 0) numeric = parseInt(numeric);
        result = numeric + "K";
    }
    if (value >= 1000000) {
        numeric = (value / 1000000).toFixed(2)
        decimalPart = parseFloat(numeric) % 1
        if (decimalPart === 0) numeric = parseInt(numeric)
        result = numeric + "M";
    }
    if (value >= 1000000000) {
        numeric = (value / 1000000000).toFixed(2)
        decimalPart = parseFloat(numeric) % 1
        if (decimalPart === 0) numeric = parseInt(numeric)
        result = numeric + "B";
    }
    return result;
};

export default function TableData(props) {
    const { items, requestSort } = useSortableData(props.analyticsData);

    let dateTotalLength = props.analyticsData.length;
    let clicksSum = props.analyticsData.map(o => o.clicks).reduce((a, c) => { return a + c });
    let impressionsSum = props.analyticsData.map(o => o.impressions).reduce((a, c) => { return a + c });
    let requestsSum = props.analyticsData.map(o => o.requests).reduce((a, c) => { return a + c });
    let responsesSum = props.analyticsData.map(o => o.responses).reduce((a, c) => { return a + c });
    let revenueSum = props.analyticsData.map(o => o.revenue).reduce((a, c) => { return a + c });
    let fillRateSumAverage = (props.analyticsData.map(o => Math.round((o.requests / o.responses)) * 100).reduce((a, c) => { return a + c })) / dateTotalLength;
    let ctrSumAverage = (props.analyticsData.map(o => Math.round((o.clicks / o.impressions)) * 100).reduce((a, c) => { return a + c })) / dateTotalLength;

    return (
        <div className="main-app-analytics-table-data-header-grid">
            <div className="main-app-analytics-table-data-header-details-grid">
                {props.selectedOptions.map((option) => (
                    <div
                        className="main-app-analytics-table-header-title-grid"
                        key={option}
                        style={{ cursor: "pointer" }}
                        onClick={() => props.analyticsTable__headers[option] === "Date" || props.analyticsTable__headers[option] === "App" || props.analyticsTable__headers[option] === "Fill rate" || props.analyticsTable__headers[option] === "CTR" ? {} : requestSort(props.analyticsTable__headers[option].toLowerCase())}
                    >
                        {props.analyticsTable__headers[option]}
                    </div>
                ))}
            </div>
            <div className="main-app-analytics-table-total">
                {props.selectedOptions.includes(0) && (
                    <div className="main-app-analytics-table-total-item">
                        {dateTotalLength}
                    </div>
                )}
                {props.selectedOptions.includes(1) && (
                    <div className="main-app-analytics-table-total-item">
                        {/* this is static because the sum calculation was not clear for me */}
                        420
                    </div>
                )}
                {props.selectedOptions.includes(2) && (
                    <div className="main-app-analytics-table-total-item">
                        {convertLargeValues(clicksSum)}
                    </div>
                )}
                {props.selectedOptions.includes(3) && (
                    <div className="main-app-analytics-table-total-item">
                        {convertLargeValues(requestsSum)}
                    </div>
                )}
                {props.selectedOptions.includes(4) && (
                    <div className="main-app-analytics-table-total-item">
                        {convertLargeValues(responsesSum)}
                    </div>
                )}
                {props.selectedOptions.includes(5) && (
                    <div className="main-app-analytics-table-total-item">
                        {convertLargeValues(impressionsSum)}
                    </div>
                )}
                {props.selectedOptions.includes(6) && (
                    <div className="main-app-analytics-table-total-item">
                        {'$' + revenueSum.toFixed(2)}
                    </div>
                )}
                {props.selectedOptions.includes(7) && (
                    <div className="main-app-analytics-table-total-item">
                        {fillRateSumAverage + '%'}
                    </div>
                )}
                {props.selectedOptions.includes(8) && (
                    <div className="main-app-analytics-table-total-item">
                        {ctrSumAverage + '%'}
                    </div>
                )}
            </div>
            <div className="main-app-analytics-table-data-grid-export-main">
                <div className="main-app-analytics-table-data-grid-export">
                    {items.map((content) => (
                        <div className="main-app-analytics-table-data-details-grid">
                            {props.selectedOptions.includes(0) && (
                                <div className="main-app-analytics-table-data-date-grid">
                                    {moment(content.date).format("DD MMMM YYYY")}
                                </div>
                            )}
                            {props.selectedOptions.includes(1) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {props.appName && content.app_id ? props.appName.find((item) => item.app_id === content.app_id).app_name : "-"}
                                </div>
                            )}
                            {props.selectedOptions.includes(2) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {convertLargeValues(content.clicks)}
                                </div>
                            )}
                            {props.selectedOptions.includes(3) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {convertLargeValues(content.requests)}
                                </div>
                            )}
                            {props.selectedOptions.includes(4) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {convertLargeValues(content.responses)}
                                </div>
                            )}
                            {props.selectedOptions.includes(5) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {convertLargeValues(content.impressions)}
                                </div>
                            )}
                            {props.selectedOptions.includes(6) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {content.revenue ? '$' + (content.revenue).toFixed(2) : "$" + 0}
                                </div>
                            )}
                            {props.selectedOptions.includes(7) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {Math.round((content.requests / content.responses) * 100) + '%'}
                                </div>
                            )}
                            {props.selectedOptions.includes(8) && (
                                <div className="main-app-analytics-table-data-child-grid">
                                    {Math.round((content.clicks / content.impressions) * 100) + "%"}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
