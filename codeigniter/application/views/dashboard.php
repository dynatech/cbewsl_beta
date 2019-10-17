<!-- <script src="../assets/js/session.js"></script> -->
<img src="<?php echo base_url(); ?>assets/images/banner_new.png" class="img-fluid" alt="Responsive image" style="width:100%">
<!-- Nav tabs -->

<ul class="nav nav-tabs" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#risk_assessment">Risk Assessment</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#field_survey">Field Survey</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#situation_report">Situation Report</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#sensor_maintenance">Sensor Maintenance</a>
    </li>
    <li class="nav-item" id="surficial-data-tab">
      <a class="nav-link" data-toggle="tab" href="#surficial_data">Surficial Data</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#ewi">EWI</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#reports">Reports</a>
    </li>
</ul>

  <!-- Tab panes -->
<div class="tab-content">
    <div id="risk_assessment" class="container-fluid tab-pane active"><br>
        <?php $this->load->view('risk_assessment/risk_assessment');?>
    </div>
    <div id="field_survey" class="container-fluid tab-pane fade"><br>
        <?php $this->load->view('field_survey/field_survey');?>
    </div>
    <div id="situation_report" class="container-fluid tab-pane fade"><br>
        <?php $this->load->view('situation_report/situation_report');?>
    </div>
    <div id="sensor_maintenance" class="container-fluid tab-pane fade"><br>
        <?php $this->load->view('sensor_maintenance/sensor_maintenance');?>
    </div>
    <div id="surficial_data" class="container-fluid tab-pane fade"><br>
        <?php $this->load->view('surficial_data/surficial_data');?>
    </div>
    <div id="ewi" class="container-fluid tab-pane fade"><br>
        <?php $this->load->view('ewi/ewi');?>
    </div>
    <div id="reports" class="container-fluid tab-pane fade"><br>
        <?php $this->load->view('reports/reports');?>
    </div>
</div>
<div id="editor"></div>


<!-- Button trigger modal -->
<!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#riskProfileModal">
  Launch demo modal
</button> -->

<?php $this->load->view('risk_assessment/modals');?>
<?php $this->load->view('field_survey/modals');?>
<?php $this->load->view('surficial_data/modals');?>
<?php $this->load->view('situation_report/modals');?>
<?php $this->load->view('ewi/modals');?>
<?php $this->load->view('templates/loading_modal');?>