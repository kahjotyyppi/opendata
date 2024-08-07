<template>
    <div v-show="isEnabled">
        <base-backdrop @click="disable" />
        <div class="settings-panel">
            <settings-panel-header @close="disable" />
            <div
                ref="panelBody"
                class="settings-panel-body"
            >
                <field-language :settings="settings" />
                <field-date-format :settings="settings" />
                <field-time-format :settings="settings" />
                <field-background-map :settings="settings" />
                <app-version />
            </div>
        </div>
    </div>
</template>

<script>
import SettingsPanelHeader from "@/components/settings-panel/SettingsPanelHeader.vue"
import FieldLanguage from "@/components/settings-panel/FieldLanguage.vue"
import FieldDateFormat from "@/components/settings-panel/FieldDateFormat.vue"
import FieldTimeFormat from "@/components/settings-panel/FieldTimeFormat.vue"
import FieldBackgroundMap from "@/components/settings-panel/FieldBackgroundMap.vue"
import BaseBackdrop from "@/components/base/BaseBackdrop.vue"
import AppVersion from "@/components/settings-panel/AppVersion.vue"
import Settings from "@/models/Settings"
import cloneDeep from "lodash/cloneDeep"
import eventBus from "@/utils/eventBus"

export default {
    name: "SettingsPanel",
    components: {
        SettingsPanelHeader,
        FieldLanguage,
        FieldDateFormat,
        FieldTimeFormat,
        FieldBackgroundMap,
        BaseBackdrop,
        AppVersion
    },
    emits: ["settingsChanged"],
    data: function () {
        return {
            isEnabled: false,
            settings: new Settings()
        }
    },
    watch: {
        settings: {
            deep: true,
            handler () {
                this.saveSettings()
            }
        }
    },
    mounted () {
        eventBus.$on("settings-panel-open", this.enable)
        eventBus.$on("mode-changed", this.modeChange)
    },
    methods: {
        enable () {
            this.settings = cloneDeep(this.$store.state.settings.settings)
            this.isEnabled = true

            // Reset scrollbar to top when the user opens the settings panel.
            this.$nextTick(() => {
                if (this.$refs.panelBody) {
                    this.$refs.panelBody.scrollTop = 0
                }
            })
        },
        disable () {
            this.isEnabled = false
            this.saveSettings()
        },
        saveSettings () {
            this.$store.commit("setSettings", cloneDeep(this.settings))
            eventBus.$emit("settingsChanged")
        },
        modeChange (mode) {
            this.settings = cloneDeep(this.$store.state.settings.settings)
            this.settings.mode = mode
            this.$store.commit("setSettings", cloneDeep(this.settings))
        }
    }
}
</script>

<style lang="scss">
.settings-panel {
    width: 90%;
    max-width: 30em;
    height: auto;
    max-height: 25em;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: $font-lg;
    font-family: $font-medium;
    z-index: $z-index-settings-panel;
    color: $color-font-dark;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: $border-radius-lg;
    overflow-y: hidden;
    padding: 1.5em 1.5em;
}

.settings-panel-body {
    height: 15em;
    overflow: auto;
}

.settings-panel-body > *:not(:last-child) {
    margin-bottom: 2em;
}
</style>