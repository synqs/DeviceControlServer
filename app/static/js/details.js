Vue.component('wtc-summary-table', {
  props: ['id'],
  template: `
  <span>
  <button type="button" class="btn btn-light" v-on:click="edit_wtc">Settings</button>
  <button type="button" class="btn btn-light" v-on:click="stop_wtc" v-if="wtc.switch">Stop</button>
  <button type="button" class="btn btn-light" v-on:click="start_wtc" v-else>Start</button>

  <b-modal title="Update" hide-footer v-model="showEditModal">
  <b-form class="form-horizontal">
  <b-form-group id="form-name-edit-group" label="Name:" label-for="form-name-edit-input">
  <b-form-input id="form-name-edit-input" type="text"
  v-model="editForm.name" required placeholder="Enter name">
  </b-form-input>
  <b-form-group id="form-ip-edit-group" label="IP Adress:" label-for="form-ip-edit-input">
  <b-form-input id="form-ip-edit-input" type="text"
  v-model="editForm.ip_adress" required placeholder="Enter adress">
  </b-form-input>
  <b-form-group id="form-port-edit-group" label="Port:" label-for="form-port-edit-input">
  <b-form-input id="form-port-edit-input" type="text"
  v-model="editForm.port" required placeholder="Enter port">
  </b-form-input>
  <b-form-group id="form-wt-edit-group" label="Wait time:" label-for="form-wt-edit-input">
  <b-form-input id="form-wt-edit-input" type="text"
  v-model="editForm.sleeptime" required placeholder="Enter waittime">
  </b-form-input>
  <b-form-group id="form-setpoint-edit-group" label="Setpoint:" label-for="form-setpoint-edit-input">
  <b-form-input id="form-setpoint-edit-input" type="text"
  v-model="editForm.setpoint" required placeholder="Enter setpoint">
  </b-form-input>
  <b-form-group id="form-gain-edit-group" label="Gain:" label-for="form-gain-edit-input">
  <b-form-input id="form-gain-edit-input" type="text"
  v-model="editForm.gain" required placeholder="Enter gain">
  </b-form-input>
  <b-form-group id="form-integral-edit-group" label="tauI (s):" label-for="form-integral-edit-input">
  <b-form-input id="form-integral-edit-input" type="text"
  v-model="editForm.integral" required placeholder="Enter tauI">
  </b-form-input>
  <b-form-group id="form-diff-edit-group" label="tauD (s):" label-for="form-diff-edit-input">
  <b-form-input id="form-diff-edit-input" type="text"
  v-model="editForm.diff" required placeholder="Enter tauD">
  </b-form-input>

  </b-form-group>
  <b-button-group>
  <button type="button" variant="btn btn-light" v-on:click="onSubmitUpdate">Update</button>
  <b-button type="reset" variant="danger" v-on:click="onResetUpdate">Cancel</b-button>
  </b-button-group>
  </b-form>
  </b-modal>

  <table class="table table-hover">
  <thead>
  <tr>
  <th scope="col">Date</th>
  <th scope="col">Setpoint</th>
  <th scope="col">Input</th>
  <th scope="col">Error</th>
  <th scope="col">Output</th>
  <th scope="col">Gain</th>
  <th scope="col">tauI (s)</th>
  <th scope="col">tauD (s)</th>
  </tr>
  </thead>
  <tbody>
  <tr v-for="wtc in wtcs">
  <td >{{wtc.timestamp}}</td>
  <td >{{wtc.setpoint}}</td>
  <td >{{wtc.value }}</td>
  <td >{{wtc.error}}</td>
  <td >{{wtc.output}}</td>
  <td >{{wtc.gain}}</td>
  <td >{{wtc.integral}}</td>
  <td >{{wtc.diff}}</td>
  </tr>
  </tbody>
  </table>

  </span>
  `,
  data: function () {
    return {
      wtc: [],
      showEditModal: false,
      editForm: [],
      wtcs: []
    }
  },
  methods: {
    init_wtc: function () {
      const path = '/wtc/' + this.id;
      axios.get(path)
      .then((res) => {
        this.wtc = res.data.wtc;
        this.get_wtc();
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
    },
    get_wtc: function () {
      const path = '/wtc/' + this.wtc.id;
      axios.get(path)
      .then((res) => {
        this.wtc = res.data.wtc;
        this.wtcs.unshift(res.data.wtc);
        var time = res.data.wtc.timestamp;
        Plotly.extendTraces('plot', {
          x:[[time], [time], [time]],
          y:[[res.data.wtc.setpoint], [res.data.wtc.value], [res.data.wtc.output]]
        }, [0,1,2]);

        if (!this.wtc.switch){
          clearInterval(this.timer);
        }
        if (this.wtc.switch && !this.timer) {
          this.timer = setInterval(this.get_wtc, this.wtc.sleeptime*1000);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
    },
    start_wtc: function () {
      this.timer = setInterval(this.get_wtc, this.wtc.sleeptime*1000);
      const path = '/start/wtc/' + this.wtc.id;
      axios.get(path)
      .then((res) => {
        this.wtc = res.data.wtc;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
    },
    stop_wtc: function () {
      clearInterval(this.timer);
      const path = '/stop/wtc/' + this.wtc.id;
      axios.get(path)
      .then((res) => {
        this.wtc = res.data.wtc;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
    },
    edit_wtc: function () {
      this.editForm = this.wtc;
      this.showEditModal = !this.showEditModal;
    },
    onSubmitUpdate: function () {
      this.showEditModal = !this.showEditModal;
      const payload = {
        name: this.editForm.name,
        ip_adress: this.editForm.ip_adress,
        port: this.editForm.port,
        sleeptime: this.editForm.sleeptime,
        setpoint: this.editForm.setpoint,
        gain: this.editForm.gain,
        integral: this.editForm.integral,
        diff: this.editForm.diff
      };
      const path = '/wtc/' + this.wtc.id;
      axios.put(path, payload)
      .then(() => {
        this.get_wtc();
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
        this.get_wtc();
      });
    },
    onResetUpdate: function () {
      this.editForm = this.wtc;
      this.showEditModal = !this.showEditModal;
    }
  },
  mounted: function () {
    this.init_wtc();
  }
});

var IndexVue = new Vue({
  el: '#wtcMeasures'
});

$(document).ready(function() {

  function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
  }

  function export_table_to_csv(html, filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    var rows = $("#ard_log tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++)
      row.push(cols[j].innerText);

      csv.push(row.join(","));
    }

    // Download CSV
    download_csv(csv.join("\n"), filename);
  }
  $( "#exp_button" ).click(function() {
    var html = $("#ard_log").outerHTML;
    export_table_to_csv(html, "table.csv");
  });

  // set up the plotting
  var setpoint_trace = {
    x: [],
    y: [],
    name: 'Setpoint',
    type: 'scatter'
  };

  var input_trace = {
    x: [],
    y: [],
    name: 'Measured T',
    type: 'scatter'
  };

  var control_trace = {
    x: [],
    y: [],
    name: 'Control',
    type: 'scatter',
    yaxis: 'y2'
  };

  var data = [ setpoint_trace, input_trace, control_trace];
  var layout = {
    yaxis2: {
      title: 'Control',
      overlaying: 'y',
      side: 'right',
      tickfont: {color: '#2ca02c'},
      titlefont: {color: '#2ca02c'},
    }};

    Plotly.newPlot('plot', data, layout);
  });
