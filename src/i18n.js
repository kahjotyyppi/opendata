import { createI18n } from "vue-i18n"

var i18n = createI18n({
    inheriteLocale: true,
    globalInjection: true,
    legacy: false,
    locale: localStorage.getItem("locale"),
    fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || "fi",
    preserveDirectiveContent: false,
    messages: {
    // Finnish translations
        fi: {
            info: { // info-panel
                header: "Tietoa",
                title: "Tietoa",
                p1: "Opendata on STUKin kehittämä avoimen lähdekoodin applikaatio, jolla voit tarkastella Suomen ulkoisen säteilyn valvontaverkon mittaustuloksia. Applikaatio saa datansa Ilmatieteen laitoksen avoimen datan rajapinnasta.",
                p2: "Lue lisää projektin ",
                p3: "GitHub-sivuilta",
            },
            settings: { // settingspanel
                title: "Asetukset",
                header: "Asetukset",
                language: "Kieli",
                date: "Päivitä päivämäärää",
                time: "Päivitä kellonaikaa",
                dateFormat: "Päiväyksen muoto",
                dateFormatA: "PP.KK.VVVV",
                dateFormatB: "VVVV-KK-PP",
                labelFinnish: "Suomi",
                labelEnglish: "Englanti",
                timeFormat: "Ajan esitysmuoto",
                timeFormatA: "24 tunnin kello",
                timeFormatB: "12 tunnin kello",
                backgroundMap: "Kartta",
                backgroundMapDefault: "Oletus (OSM)",
                backgroundMapCustom: "Mukautettu",
            },
            changeMode: { // change-mode
                title: "Vaihda näkymää (annosnopeudet/ilman radioaktiivisuus)",
            },
            playback: { // media-controller
                title: {
                    date: "Päivitä päiväämäärää",
                    time: "Päivitä kellonaikaa",
                    disabled: {
                        date: "Valitse aikaisempi päivämäärä",
                        time: "Valitse aikaisempi kellonaika",
                    },
                    start: "Aloita toisto",
                    stop: "Pysäytä toisto",
                    speed: "Toistonopeus"
                }
            },
            dose: { // layers
                doseRateTresholds: "Annosnopeusrajat",
            },
            radionuclideMode: { // RadionuclideTables
                date: "Keräysjakso",
                concentration: "Aktiivisuuspitoisuus",
                uncertainty: "Epävarmuus",
                noData: "Tälle aikajaksolle ei ole saatavilla dataa",
                info: "Pääkaupunkiseudun mittauspiste on muuttanut vuoden 2022 toukokuun alusta Helsingistä Vantaalle. Vuoden 2022 huhtikuun loppuun saakka mittaustuloksia voi hakea Helsingistä. Toukokuusta 2022 alkaen tulokset löytyvät Vantaalta."
            },
            doseRate: "Annosnopeudet",
            airRadionuclides: "Ilman Radionuklidit"
        },
        // English translations
        en: {
            info: { // info-panel
                header: "About",
                title: "About",
                p1: "Opendata is an open source application developed by STUK that enables viewing of external radiation results from around Finland. The application gets its data from the Finnish Meteorological Institute's open data API.",
                p2: "To learn more visit the project on ",
                p3: "GitHub",
            },
            settings: { // settingspanel
                title: "Settings",
                header: "Settings",
                language: "Language",
                date: "Update date",
                time: "Update time",
                dateFormat: "Date format",
                dateFormatA: "DD.MM.YYYY",
                dateFormatB: "YYYY.MM.DD",
                labelFinnish: "Finnish",
                labelEnglish: "English",
                timeFormat: "Time notation",
                timeFormatA: "24-hour clock",
                timeFormatB: "12-hour clock",
                backgroundMap: "Map",
                backgroundMapDefault: "Default (OSM)",
                backgroundMapCustom: "Custom",
            },
            changeMode: { // change-mode
                title: "Change mode (dose rates/air radionuclides)",
            },
            playback: { // media-controller
                title: {
                    date: "Update date",
                    time: "Update time",
                    disabled: {
                        date: "Choose an earlier date to enable playback",
                        time: "Choose an earlier time to enable playback",
                    },
                    start: "Start playback",
                    stop: "Stop playback",
                    speed: "Playback speed"
                }
            },
            dose: { // layers
                doseRateTresholds: "Dose rate thresholds",
            },
            radionuclideMode: { // RadionuclideTables
                date: "Collection Period",
                concentration: "Concentration",
                uncertainty: "Uncertainty",
                noData: "No data available for this time period",
                info: "The measurement point for the capital region has moved from Helsinki to Vantaa at the beginning of May 2022. Until the end of April 2022, you can view measurement results from Helsinki. From may 2022, the results can be found from Vantaa."
            },
            doseRate: "Dose Rates",
            airRadionuclides: "Air Radionuclides"
        },
    }
})

export default i18n