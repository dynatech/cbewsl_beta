<nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="summary_tab" data-toggle="tab" href="#sensor_summary" role="tab" aria-controls="sensor_summary" aria-selected="true">Summary</a>
        <a class="nav-item nav-link" id="sensor_status_tab" data-toggle="tab" href="#sensor_status" role="tab" aria-controls="sensor_status" aria-selected="false">Sensor Status</a>
        <a class="nav-item nav-link" id="maintenance_logs_tab" data-toggle="tab" href="#maintenance_logs" role="tab" aria-controls="maintenance_logs" aria-selected="true">Maintenance Logs</a>
        <a class="nav-item nav-link" id="rainfall_graph_tab" data-toggle="tab" href="#rainfall_graph" role="tab" aria-controls="rainfall_graph" aria-selected="true">Rainfall Graph</a>
    </div>
</nav>
<div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="sensor_summary" role="tabpanel" aria-labelledby="summary_tab">
        <div class="card">
            <div class="card-body">
                <div>
                    <h4 style="color: #717171">
                        RAINFALL STATUS
                    </h4>
                    <h5 style="padding: 10px; color: #717171">1-day threshold: <b id="one_day_rain"></b></h5>
                    <h5 style="padding: 10px; color: #717171">3-day threshold: <b id="three_day_rain"></b></h5>
                </div>
                <!-- <div class="moms-container">
                    <h4 style="color: #717171; padding-bottom: 10px; padding-top: 10px;">
                        SUBSURFACE STATUS
                    </h4>
                    <h5 style="padding: 10px; color: #717171">Sample Text</h5>
                </div>
                <div class="surficial-graph-container">
                </div> -->
            </div>
        </div>
    </div>

    <div class="tab-pane fade" id="sensor_status" role="tabpanel" aria-labelledby="sensor_status_tab">
        <div class="card">
            <div class="card-body">
                <p id="latest_sensor_status"></p>
            </div>
        </div>
    </div>

    <div class="tab-pane fade" id="maintenance_logs" role="tabpanel" aria-labelledby="maintenance_logs_tab">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col" id="maintenance_logs_calendar"></div>
                    <div class="col" id="maintenance_logs_data">
                        <div class="row">
                            <div class="col" id="maintenance_log">
                                <img src="http://cbewsl.com/assets/images/letter_header1.png" style="width: 100%"/>
                                <img src="http://cbewsl.com/assets/images/banner_new.png" style="width: 100%"/>
                                <p id="maintenance_log_date_time">
                                    Date : June 21, 2019
                                    Time : 3:30 pm
                                </p>
                                <p id="maintenance_log_summary">
                                    [data here]
                                </p>
                                <div class="float-right">
                                    <button type="button" class="btn btn-primary btn-sm" id="edit_maintenance_log">Update</button>
                                    <button type="button" class="btn btn-danger btn-sm" id="delete_maintenance_log">Delete</button>
                                </div>
                            </div>
                            <div class="col" id="maintenance_log_form">
                                <input type="hidden" class="form-control" id="sensor_maintenance_id" value="0">
                                <div class="row">
                                    <div class="col">
                                        <form>
                                            <div class="form-group">
                                                <label id="maintenance_log_label">Please select a date</label><br>
                                                <label for="working_nodes">Working Nodes</label>
                                                <input type="number" class="form-control" id="working_nodes"/>
                                            </div>
                                            <div class="form-group">
                                                <label for="anomalous_nodes">Anomalous Nodes</label>
                                                <input type="number" class="form-control" id="anomalous_nodes"/>
                                            </div>
                                            <div class="form-group">
                                                <label for="summary">Rain Gauge Status</label>
                                                <input type="text" class="form-control" id="rain_gauge_status"/>
                                                <br>
                                                <button type="button" class="btn btn-primary btn-sm float-right" id="add_maintenance_logs">Add</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="tab-pane fade" id="subsurface_graph" role="tabpanel" aria-labelledby="subsurface_graph_tab">
        <div class="card">
            <div class="card-body">
                <p id="latest_"></p>
            </div>
        </div>
    </div>

    <div class="tab-pane fade" id="rainfall_graph" role="tabpanel" aria-labelledby="rainfall_graph_tab">
        <div class="card">
            <div class="card-body" id="rainfall_graphs_container">
                Loading graph. . . 
            </div>
        </div>
    </div>
</div>