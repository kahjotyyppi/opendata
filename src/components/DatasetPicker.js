Vue.component('dataset-picker', {
    template: '<select class="dataset-picker" v-model="dataset" @change="onDatasetChanged"><option :value="dataset" v-for="dataset in datasets">{{dataset | formatDataset}}</option></select>',
    data: function() {
        return {
            datasets: [],
            dataset: ""
        };
    },
    mounted: function() {
        var that = this;
        $.get("data/dose_rates/metadata.json", function(response) {
            that.datasets = response["files"];
            that.datasets.sort();
            that.datasets.reverse();
            that.dataset = that.datasets[0];
            that.onDatasetChanged();
        });
    },
    methods: {
        onDatasetChanged: function() {
            this.$root.$emit('datasetChanged', this.dataset);
        }
    },
    filters: {
        formatDataset(dataset) {
            dataset = dataset.split(".")[0].split("T");
            var date = dataset[0];
            var time = dataset[1];
            time = time.slice(0, 2) + ":" + time.slice(2, 4);
            return date + " " + time;
        }
    }
});