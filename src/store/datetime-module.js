import http from "../utils/http"

export default {
    state: {
        validDatetimes: [],
        date: undefined,
        time: undefined
    },
    getters: {
        validTimesForCurrentDate(state) {
            if (!state.date) {
                return [];
            }

            for (var i = 0; i < state.validDatetimes.length; ++i) {
                if (state.validDatetimes[i].date.toDateString() == state.date.toDateString()) {
                    return state.validDatetimes[i].times;
                }
            }

            return [];
        }
    },
    mutations: {
        setTime(state, time) {
            state.time = time;
        },
        setValidDatetimes(state, datetimes) {
            for (var i = 0; i < datetimes.length; ++i) {
                datetimes[i].date = new Date(datetimes[i].date);
            }
            state.validDatetimes = datetimes;
        }
    },
    actions: {
        setDate({state, dispatch, getters}, date) {
            state.date = date;

            if (!getters.validTimesForCurrentDate.includes(state.time)) {
                dispatch("selectMostRecentTime");
            }
        },
        initialize({dispatch}) {
            dispatch("updateAvailableDatetimes").then(function() {
                dispatch("selectMostRecentDate");
                dispatch("selectMostRecentTime");
            });
        },
        updateAvailableDatetimes({commit}) {
            return http.get("data/dose_rates/metadata.json").then(function(response) {
                commit("setValidDatetimes", response.body.available_data);
            });
        },
        selectMostRecentDate({state, dispatch}) {
            if (state.validDatetimes.length == 0) {
                return;
            }

            var mostRecentDate = state.validDatetimes[0].date;
            for (var i = 0; i < state.validDatetimes.length; ++i) {
                if (state.validDatetimes[i].date > mostRecentDate) {
                    mostRecentDate = state.validDatetimes[i].date;
                }
            }

            dispatch("setDate", mostRecentDate);
        },
        selectMostRecentTime({state, getters, commit}) {
            var validTimes = getters.validTimesForCurrentDate;
            if (validTimes.length == 0) {
                return;
            }

            var mostRecentTime = validTimes.sort().reverse()[0];
            commit("setTime", mostRecentTime);
        }
    }
}
