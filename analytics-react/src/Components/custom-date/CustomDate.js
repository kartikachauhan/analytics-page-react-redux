import React, { useState, useRef, useEffect } from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import moment from "moment";
import "./CustomDate.css";
import "react-day-picker/lib/style.css";

const formatStandardDate = (date, formatType = "day-first") =>
    moment(date).format("DD/MM/YYYY");

const useOutsideAlerter = (ref, clickOutside) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                clickOutside && clickOutside();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
};

const CustomDate = (props) => {
    const [dateRange, setDateRange] = useState({
        from: props.from ? props.from : null,
        to: props.to ? new Date(props.to) : null,
        fromEdit: props.from ? formatStandardDate(new Date(props.from)) : "",
        toEdit: props.to ? formatStandardDate(new Date(props.to)) : "",
        fromError: false,
        toError: false,
    });

    const [applyActive, setApplyActive] = useState(false);
    const [fromError, setFromError] = useState(false);
    const [toError, setToError] = useState(false);
    const [toFieldMandatory, setToFieldMandatory] = useState(false);
    const modifiers = { start: dateRange.from, end: dateRange.to };
    const regexDate = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.clickOutside);

    useEffect(() => {
        if (dateRange.fromEdit.match(regexDate)) {
            if (dateRange.fromEdit.match(regexDate)[0] === dateRange.fromEdit) {
                let splitDash = dateRange.fromEdit.split("-");
                let splitDot = dateRange.fromEdit.split(".");
                let result = dateRange.fromEdit;

                if (splitDash.length === 3) result = splitDash.join("/");
                if (splitDot.length === 3) result = splitDot.join("/");

                const swapString = result.split("/");
                const date = new Date(
                    `${swapString[1]}/${swapString[0]}/${swapString[2]}`
                );
                setDateRange((prev) => ({
                    ...prev,
                    from: date,
                }));
            }
        } else {
            setFromError(true);
        }

        if (dateRange.toEdit.match(regexDate)) {
            if (dateRange.toEdit.match(regexDate)[0] === dateRange.toEdit) {
                let splitDash = dateRange.toEdit.split("-");
                let splitDot = dateRange.toEdit.split(".");
                let result = dateRange.toEdit;

                if (splitDash.length === 3) result = splitDash.join("/");
                if (splitDot.length === 3) result = splitDot.join("/");

                const swapString = result.split("/");
                const date = new Date(
                    `${swapString[1]}/${swapString[0]}/${swapString[2]}`
                );
                setDateRange((prev) => ({
                    ...prev,
                    to: date,
                }));
            }
        } else {
            setToError(true);
        }

        if (
            dateRange.fromEdit.match(regexDate) &&
            dateRange.toEdit.match(regexDate)
        ) {
            if (
                dateRange.fromEdit.match(regexDate)[0] === dateRange.fromEdit &&
                dateRange.toEdit.match(regexDate)[0] === dateRange.toEdit
            ) {
                if (
                    moment(dateRange.toEdit, "DD/MM/YYYY").diff(
                        moment(dateRange.fromEdit, "DD/MM/YYYY"),
                        "days"
                    ) >= 0
                ) {
                    setApplyActive(true);
                    setFromError(false);
                    setToError(false);
                } else {
                    setApplyActive(false);
                    setFromError(true);
                    setToError(true);
                }
            } else setApplyActive(false);
        } else setApplyActive(false);
    }, [dateRange.fromEdit, dateRange.toEdit]);

    const handleDayClick = (day, { disabled }) => {
        if (disabled) return;
        let range = null;
        if (dateRange.to === null && !toFieldMandatory) {
            range = DateUtils.addDayToRange(day, {
                from: dateRange.from,
                to: null,
            });
        } else if (dateRange.to !== null && toFieldMandatory) {
            range = DateUtils.addDayToRange(day, dateRange);
            setToFieldMandatory(false);
        } else {
            range = DateUtils.addDayToRange(day, {
                from: null,
                to: null,
            });
        }

        const fromEdit = new Date(range.from);
        fromEdit.setHours(0, 0, 0, 0);
        setDateRange({
            ...range,
            from: range.from,
            to: range.to,
            fromEdit: formatStandardDate(fromEdit),
            toEdit: range.to ? formatStandardDate(new Date(range.to)) : "",
        });
    };

    const handleSubmit = () => {
        if (applyActive) {
            const from = new Date(dateRange.from);
            from.setHours(0, 0, 0, 0);
            props.sendFromTo(from, dateRange.to);
            props.close();
        }
    };

    const handleToOutOfFocus = () => {
        setToFieldMandatory(true);
        try {
            let splitDash = dateRange.toEdit.split("-");
            let splitDot = dateRange.toEdit.split(".");
            let result = dateRange.toEdit;

            if (splitDash.length === 3) result = splitDash.join("/");
            if (splitDot.length === 3) result = splitDot.join("/");

            const swapString = result.split("/");
            const date = new Date(
                `${swapString[1]}/${swapString[0]}/${swapString[2]}`
            );
            setDateRange({
                ...dateRange,
                to: date,
            });
        } catch (e) {
            alert("Error in To");
        }
    };

    const handleFromOutOfFocus = () => {
        try {
            let splitDash = dateRange.fromEdit.split("-");
            let splitDot = dateRange.fromEdit.split(".");
            let result = dateRange.fromEdit;
            if (splitDash.length === 3) result = splitDash.join("/");
            if (splitDot.length === 3) result = splitDot.join("/");
            const swapString = result.split("/");
            const date = new Date(
                `${swapString[1]}/${swapString[0]}/${swapString[2]}`
            );
            setDateRange({
                ...dateRange,
                from: date,
            });
        } catch (e) {
            alert("Error in from");
        }
    };

    const handleFromField = (e) => {
        setFromError(false);
        setDateRange({
            ...dateRange,
            fromEdit: e.target.value,
        });
    };

    const handleToField = (e) => {
        setToError(false);
        setDateRange({
            ...dateRange,
            toEdit: e.target.value,
        });
    };

    const resetDate = () => {
        setDateRange({
            ...dateRange,
            from: null,
            to: null,
            fromEdit: "",
            toEdit: "",
        });
    };

    let datePicker = (
        <div>
            <DayPicker
                className="Selectable"
                numberOfMonths={12}
                selectedDays={[dateRange.from, dateRange]}
                modifiers={modifiers}
                onDayClick={handleDayClick}
                disabledDays={(day) => {
                    let dayDate = day;
                    dayDate.setHours(0, 0, 0, 0)
                    return dayDate > new Date()
                }}
            />
        </div>
    );

    return (
        <div
            className="reports-customdate"
            ref={wrapperRef}
        >
            <div className="reports-custom-date-filterdate">
                <div className="reports-advance-popup-filterdate-fromto">
                    <input
                        className={
                            fromError
                                ? "reports-advance-popup-filterdate-fromto-field--error"
                                : "reports-advance-popup-filterdate-fromto-field"
                        }
                        type="text"
                        value={dateRange.fromEdit}
                        onChange={handleFromField}
                        onBlur={handleFromOutOfFocus}
                        placeholder="From(DD/MM/YYYY)"
                    />
                </div>
                <div>-</div>
                <div className="reports-advance-popup-filterdate-fromto">
                    <input
                        className={
                            toError
                                ? "reports-advance-popup-filterdate-fromto-field--error"
                                : "reports-advance-popup-filterdate-fromto-field"
                        }
                        type="text"
                        value={dateRange.toEdit}
                        onChange={handleToField}
                        onFocus={() => setToFieldMandatory(true)}
                        onBlur={handleToOutOfFocus}
                        placeholder="To(DD/MM/YYYY)"
                    />
                </div>
            </div>
            <div className="customdate-reset">
                <div style={{ cursor: "pointer" }} onClick={resetDate}>
                    Reset
                </div>
            </div>
            <div className="reports-advance-popup-calendar">
                {datePicker}
            </div>
            <div
                className={
                    applyActive
                        ? "reports-advance-popup-subfilter-apply-active"
                        : "reports-advance-popup-subfilter-apply"
                }
            >
                <div onClick={handleSubmit}>APPLY</div>
            </div>
        </div>
    );
};

export default CustomDate;
