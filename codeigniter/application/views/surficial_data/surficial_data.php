<nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="surficial_summary_tab" data-toggle="tab" href="#surficial_summary" role="tab" aria-controls="surficial_summary" aria-selected="true">Summary</a>
        <a class="nav-item nav-link" id="current_measurement_tab" data-toggle="tab" href="#current_measurement" role="tab" aria-controls="current_measurement" aria-selected="false">Current Measurement</a>
        <a class="nav-item nav-link" id="monitoring_logs_tab" data-toggle="tab" href="#monitoring_logs" role="tab" aria-controls="monitoring_logs" aria-selected="true">Monitoring Logs</a>
    </div>
</nav>
<div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="surficial_summary" role="tabpanel" aria-labelledby="surficial_summary_tab">
        <div class="card">
            <div class="card-body">
                <div class="surficial-measuremnt-container">
                    <h4 style="color: #717171">
                        Surficial Measurement
                    </h4>
                    <h5 style="padding: 10px; color: #717171">Sample text here</h5>
                </div>
                <div class="moms-container">
                    <h4 style="color: #717171; padding-bottom: 10px;">
                        Manifestation of Movements
                    </h4>
                </div>
                <div class="surficial-graph-container">
                </div>
            </div>
        </div>
    </div>

    <div class="tab-pane fade" id="current_measurement" role="tabpanel" aria-labelledby="current_measurement_tab">
        <div class="card">
            <div class="card-body">
                <div class="current-measurement-container">
                    <div class="measurement-header" style="text-align: center;color: #9a9a9a;">
                    </div>
                    <div class="measurements" style="color: #9a9a9a;">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="tab-pane fade" id="monitoring_logs" role="tabpanel" aria-labelledby="monitoring_logs_tab">
        <div class="card">
            <div class="card-body">
            <table id="moms_table" class="display table table-striped" style="width:100%">
                        <thead>
                            <tr>
                                <th>Date Inserted</th>
                                <th>Observance Timestamp</th>
                                <th>Type of feature</th>
                                <th>Name of feature</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>Date Inserted</th>
                                <th>Observance Timestamp</th>
                                <th>Type of feature</th>
                                <th>Name of feature</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-light btn-block" id="add_moms_form"><i class="fas fa-plus-circle text-center"></i> Add Row</button>
                        </div>
                        <div class="col">
                        </div>
                    </div>
            </div>
        </div>
    </div>
</div>